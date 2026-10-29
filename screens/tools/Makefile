CC ?= cc
CFLAGS ?= -O2 -Wall -Wextra -std=c11
PKG_CONFIG ?= pkg-config

LIBUSB_CFLAGS := $(shell $(PKG_CONFIG) --cflags libusb-1.0)
LIBUSB_LIBS := $(shell $(PKG_CONFIG) --libs libusb-1.0)

.PHONY: all clean

all: s5_screen_test

s5_screen_test: s5_screen_test.c
	$(CC) $(CFLAGS) $(LIBUSB_CFLAGS) -o $@ $< $(LIBUSB_LIBS)

clean:
	rm -f s5_screen_test
