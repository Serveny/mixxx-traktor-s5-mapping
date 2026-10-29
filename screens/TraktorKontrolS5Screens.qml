import QtQuick 2.15

import Mixxx 1.0 as Mixxx
import S5 as S5

Mixxx.ControllerScreen {
    id: root

    required property string screenId

    readonly property int screenWidth: 480
    readonly property int screenHeight: 272
    readonly property int screenIndex: root.screenId === "leftdeck" ? 0 : 1
    readonly property bool renderDebug: false

    property var lastFrame: null

    init: function(_controllerName, _isDebug) {
        console.log(`S5 screen ${root.screenId} started`)
        root.state = "Live"
    }

    shutdown: function() {
        console.log(`S5 screen ${root.screenId} stopping`)
        root.state = "Stop"
    }

    // Returns [first, last] changed row, or null when the frame is unchanged.
    function changedRows(input) {
        if (!root.lastFrame) {
            root.lastFrame = new ArrayBuffer(input.byteLength)
            new Uint8Array(root.lastFrame).set(new Uint8Array(input))
            return [0, root.screenHeight - 1]
        }
        const rowWords = root.screenWidth / 2
        const current = new Uint32Array(input)
        const last = new Uint32Array(root.lastFrame)
        let first = -1
        let lastRow = -1
        for (let y = 0; y < root.screenHeight; y++) {
            for (let i = y * rowWords, end = i + rowWords; i < end; i++) {
                if (current[i] !== last[i]) {
                    if (first < 0) {
                        first = y
                    }
                    lastRow = y
                    break
                }
            }
        }
        last.set(current)
        return first < 0 ? null : [first, lastRow]
    }

    // S5/S8/D2 display packet: 16-byte header, literal pixel run, blit, end.
    // Verified on hardware: 480x272, RGB565 big-endian, screen index 0 = left, 1 = right.
    transformFrame: function(input, _timestamp) {
        const rows = root.changedRows(input)
        if (!rows) {
            return new ArrayBuffer(0)
        }
        const y = rows[0]
        const height = rows[1] - rows[0] + 1
        const width = root.screenWidth
        const pairs = width * height / 2
        const payloadLength = pairs * 4
        const output = new ArrayBuffer(16 + 4 + payloadLength + 8)
        const bytes = new Uint8Array(output)

        bytes[0] = 0x84
        bytes[2] = root.screenIndex
        bytes[3] = 0x60
        bytes[10] = y >> 8
        bytes[11] = y & 0xff
        bytes[12] = width >> 8
        bytes[13] = width & 0xff
        bytes[14] = height >> 8
        bytes[15] = height & 0xff

        bytes[16] = 0x00 // literal run, 24-bit pair count
        bytes[17] = (pairs >> 16) & 0xff
        bytes[18] = (pairs >> 8) & 0xff
        bytes[19] = pairs & 0xff
        bytes.set(new Uint8Array(input, y * width * 2, payloadLength), 20)

        bytes[20 + payloadLength] = 0x03 // blit
        bytes[24 + payloadLength] = 0x40 // end
        bytes[26 + payloadLength] = root.screenIndex

        if (root.renderDebug) {
            console.log(`S5 ${root.screenId}: rows ${y}-${rows[1]}, ${output.byteLength} bytes`)
        }
        return output
    }

    Component {
        id: splashOff
        S5.SplashOff {
            anchors.fill: parent
        }
    }

    Component {
        id: deckScreen
        S5.DeckScreen {
            anchors.fill: parent
            screenId: root.screenId
        }
    }

    Loader {
        anchors.fill: parent
        sourceComponent: root.state === "Live" ? deckScreen : splashOff
    }
}
