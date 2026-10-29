#define _POSIX_C_SOURCE 199309L
#include <errno.h>
#include <libusb-1.0/libusb.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

enum {
    SCREEN_WIDTH = 480,
    SCREEN_HEIGHT = 272,
    DEFAULT_VENDOR_ID = 0x17cc,
    TRANSFER_TIMEOUT_MS = 1000,
};

static int parse_u16(const char* text, uint16_t* value) {
    char* end = NULL;
    int base = 0;
    unsigned long parsed;

    if (strpbrk(text, "abcdefABCDEF") != NULL) {
        base = 16;
    }

    errno = 0;
    parsed = strtoul(text, &end, base);
    if (errno || end == text || *end != '\0' || parsed > 0xffffUL) {
        return -1;
    }

    *value = (uint16_t)parsed;
    return 0;
}

static int parse_u8(const char* text, uint8_t* value) {
    uint16_t parsed;

    if (parse_u16(text, &parsed) || parsed > 0xffU) {
        return -1;
    }

    *value = (uint8_t)parsed;
    return 0;
}

static int parse_int_arg(const char* text, int min, int max, int* value) {
    char* end = NULL;
    long parsed;

    errno = 0;
    parsed = strtol(text, &end, 0);
    if (errno || end == text || *end != '\0' || parsed < min || parsed > max) {
        return -1;
    }

    *value = (int)parsed;
    return 0;
}

static int read_env_u16(const char* name, uint16_t default_value, uint16_t* value) {
    const char* text = getenv(name);

    if (!text || !*text) {
        *value = default_value;
        return 0;
    }

    return parse_u16(text, value);
}

static int read_required_env_u8(const char* name, uint8_t* value) {
    const char* text = getenv(name);

    if (!text || !*text) {
        fprintf(stderr, "missing required environment variable %s\n", name);
        return -1;
    }

    if (parse_u8(text, value)) {
        fprintf(stderr, "invalid %s value: %s\n", name, text);
        return -1;
    }

    return 0;
}

static void usage(const char* argv0) {
    fprintf(stderr,
            "usage: S5_PRODUCT_ID=0x1234 S5_INTERFACE=4 S5_OUT_EP=0x03 %s "
            "<screen_idx> <x> <y> <width> <height> <rgb565_hex>\n",
            argv0);
}

static void put_be16(uint8_t* buffer, int offset, int value) {
    buffer[offset] = (uint8_t)((value >> 8) & 0xff);
    buffer[offset + 1] = (uint8_t)(value & 0xff);
}

// S5/S8/D2 framing: 16-byte header, command stream, blit + end. Pixels go in pairs.
static int build_packet(
        uint8_t screen_idx,
        int x,
        int y,
        int width,
        int height,
        uint16_t rgb565,
        uint8_t** packet,
        int* packet_len) {
    const int pairs = (width * height + 1) / 2;
    const int payload_len = pairs * 4;
    const int len = 16 + 4 + payload_len + 4 + 4;
    uint8_t* data = calloc((size_t)len, 1);
    uint8_t* body;

    if (!data) {
        return -1;
    }

    data[0] = 0x84;
    data[2] = screen_idx;
    data[3] = 0x60;
    put_be16(data, 8, x);
    put_be16(data, 10, y);
    put_be16(data, 12, width);
    put_be16(data, 14, height);

    // 0x00: literal run, 24-bit big-endian pair count
    data[16] = 0x00;
    data[17] = (uint8_t)((pairs >> 16) & 0xff);
    data[18] = (uint8_t)((pairs >> 8) & 0xff);
    data[19] = (uint8_t)(pairs & 0xff);

    body = data + 20;
    for (int i = 0; i < pairs * 2; i++) {
        body[2 * i] = (uint8_t)((rgb565 >> 8) & 0xff);
        body[2 * i + 1] = (uint8_t)(rgb565 & 0xff);
    }

    data[20 + payload_len] = 0x03; // blit
    data[24 + payload_len] = 0x40; // end
    data[24 + payload_len + 2] = screen_idx;

    *packet = data;
    *packet_len = len;
    return 0;
}

int main(int argc, char** argv) {
    uint16_t vendor_id = DEFAULT_VENDOR_ID;
    uint16_t product_id = 0;
    uint8_t interface_number = 0;
    uint8_t out_ep = 0;
    int screen_idx = 0;
    int x = 0;
    int y = 0;
    int width = 0;
    int height = 0;
    uint16_t rgb565 = 0;
    uint8_t* packet = NULL;
    int packet_len = 0;
    libusb_context* ctx = NULL;
    libusb_device_handle* handle = NULL;
    int transferred = 0;
    int rc = 0;

    if (argc != 7) {
        usage(argv[0]);
        return 2;
    }

    if (read_env_u16("S5_VENDOR_ID", DEFAULT_VENDOR_ID, &vendor_id) ||
            read_env_u16("S5_PRODUCT_ID", 0, &product_id) ||
            read_required_env_u8("S5_INTERFACE", &interface_number) ||
            read_required_env_u8("S5_OUT_EP", &out_ep)) {
        return 2;
    }

    if (product_id == 0) {
        fprintf(stderr, "S5_PRODUCT_ID must be set to the verified product ID\n");
        return 2;
    }

    if (parse_int_arg(argv[1], 0, 1, &screen_idx) ||
            parse_int_arg(argv[2], 0, SCREEN_WIDTH - 1, &x) ||
            parse_int_arg(argv[3], 0, SCREEN_HEIGHT - 1, &y) ||
            parse_int_arg(argv[4], 1, SCREEN_WIDTH, &width) ||
            parse_int_arg(argv[5], 1, SCREEN_HEIGHT, &height) ||
            parse_u16(argv[6], &rgb565)) {
        usage(argv[0]);
        return 2;
    }

    if (x + width > SCREEN_WIDTH || y + height > SCREEN_HEIGHT) {
        fprintf(stderr, "rectangle exceeds %dx%d screen bounds\n", SCREEN_WIDTH, SCREEN_HEIGHT);
        return 2;
    }

    if (build_packet((uint8_t)screen_idx, x, y, width, height, rgb565, &packet, &packet_len)) {
        fprintf(stderr, "failed to allocate packet\n");
        return 1;
    }

    rc = libusb_init(&ctx);
    if (rc != 0) {
        fprintf(stderr, "libusb_init failed: %s\n", libusb_error_name(rc));
        free(packet);
        return 1;
    }

    handle = libusb_open_device_with_vid_pid(ctx, vendor_id, product_id);
    if (!handle) {
        fprintf(stderr, "device not found: vendor=0x%04x product=0x%04x\n", vendor_id, product_id);
        libusb_exit(ctx);
        free(packet);
        return 1;
    }

    if (libusb_kernel_driver_active(handle, interface_number) == 1) {
        rc = libusb_detach_kernel_driver(handle, interface_number);
        if (rc != 0) {
            fprintf(stderr, "detach kernel driver failed: %s\n", libusb_error_name(rc));
        }
    }

    rc = libusb_claim_interface(handle, interface_number);
    if (rc != 0) {
        fprintf(stderr,
                "claim interface failed: interface=%u error=%s\n",
                interface_number,
                libusb_error_name(rc));
        libusb_close(handle);
        libusb_exit(ctx);
        free(packet);
        return 1;
    }

    // S5_REPEAT=n resends the frame n times (100 ms apart) while the interface stays claimed.
    const char* repeat_text = getenv("S5_REPEAT");
    int repeat = repeat_text ? atoi(repeat_text) : 1;
    struct timespec start, end, pause = {0, 100 * 1000 * 1000};
    for (int i = 0; i < (repeat > 0 ? repeat : 1); i++) {
        clock_gettime(CLOCK_MONOTONIC, &start);
        rc = libusb_bulk_transfer(
                handle,
                out_ep,
                packet,
                packet_len,
                &transferred,
                TRANSFER_TIMEOUT_MS);
        clock_gettime(CLOCK_MONOTONIC, &end);
        if (rc != 0 || transferred != packet_len) {
            break;
        }
        fprintf(stderr, "frame %d: %ld ms\n", i,
                (end.tv_sec - start.tv_sec) * 1000 + (end.tv_nsec - start.tv_nsec) / 1000000);
        nanosleep(&pause, NULL);
    }
    if (rc != 0 || transferred != packet_len) {
        fprintf(stderr,
                "bulk transfer failed: endpoint=0x%02x transferred=%d/%d error=%s\n",
                out_ep,
                transferred,
                packet_len,
                libusb_error_name(rc));
        libusb_release_interface(handle, interface_number);
        libusb_close(handle);
        libusb_exit(ctx);
        free(packet);
        return 1;
    }

    printf("sent %d bytes to screen %d\n", transferred, screen_idx);

    libusb_release_interface(handle, interface_number);
    libusb_close(handle);
    libusb_exit(ctx);
    free(packet);
    return 0;
}
