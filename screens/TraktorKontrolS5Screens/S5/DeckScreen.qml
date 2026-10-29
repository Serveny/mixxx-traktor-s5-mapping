// Track Deck view, following S5 manual 4.2.1.3: artwork, title/artist, loop size,
// play position, BPM, deck focus and sync state, plus waveform and BPM/KEY pop-ups (2.8/2.9).
import QtQuick 2.15
import QtQuick.Layouts 1.3

import Mixxx 1.0 as Mixxx
import Mixxx.Controls 1.0 as MixxxControls

Rectangle {
    id: root

    required property string screenId

    // Overwritten by the HID mapping through the shared-data API, when Mixxx has it.
    property string group: root.screenId === "rightdeck" ? "[Channel2]" : "[Channel1]"
    property string popup: "none"
    property real sliceSize: 1
    property real quantizeSize: 1

    readonly property var player: Mixxx.PlayerManager.getPlayer(root.group)
    readonly property var track: root.player ? root.player.currentTrack : null
    readonly property color accent: deckLetter === "C" || deckLetter === "D" ? "#e6e6e6" : "#2aa6ff"
    readonly property string deckLetter: "ABCD"[parseInt(root.group.replace(/\D/g, "")) - 1] || "?"
    // Mixxx key enum order, shown in Open Key notation like Traktor.
    readonly property var openKeys: ["", "1d", "8d", "3d", "10d", "5d", "12d", "7d", "2d", "9d", "4d", "11d", "6d",
        "10m", "5m", "12m", "7m", "2m", "9m", "4m", "11m", "6m", "1m", "8m", "3m"]

    color: "black"

    function onSharedDataUpdate(data) {
        const state = data ? data[root.screenId] : null
        if (!state) {
            return
        }
        root.group = state.group || root.group
        root.popup = state.popup || "none"
        root.sliceSize = state.sliceSize || root.sliceSize
        root.quantizeSize = state.quantizeSize || root.quantizeSize
    }

    Component.onCompleted: {
        if (typeof engine.makeSharedDataConnection === "function") {
            engine.makeSharedDataConnection(root.onSharedDataUpdate)
            root.onSharedDataUpdate(engine.getSharedData())
        }
    }

    function formatBeats(beats) {
        return beats >= 1 ? `${beats}` : `1/${Math.round(1 / beats)}`
    }

    function formatTime(seconds) {
        const s = Math.max(0, Math.floor(seconds))
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
    }

    Mixxx.ControlProxy { id: bpm; group: root.group; key: "bpm" }
    Mixxx.ControlProxy { id: fileBpm; group: root.group; key: "file_bpm" }
    Mixxx.ControlProxy { id: keyControl; group: root.group; key: "key" }
    Mixxx.ControlProxy { id: keylock; group: root.group; key: "keylock" }
    Mixxx.ControlProxy { id: syncEnabled; group: root.group; key: "sync_enabled" }
    Mixxx.ControlProxy { id: syncLeader; group: root.group; key: "sync_leader" }
    Mixxx.ControlProxy { id: loopSize; group: root.group; key: "beatloop_size" }
    Mixxx.ControlProxy { id: loopEnabled; group: root.group; key: "loop_enabled" }
    Mixxx.ControlProxy { id: playPosition; group: root.group; key: "playposition" }
    Mixxx.ControlProxy { id: duration; group: root.group; key: "duration" }
    Mixxx.ControlProxy { id: trackLoaded; group: root.group; key: "track_loaded" }
    Mixxx.ControlProxy { id: zoomControl; group: root.group; key: "waveform_zoom" }
    Mixxx.ControlProxy { id: samples; group: root.group; key: "track_samples" }
    Mixxx.ControlProxy { id: quantize; group: root.group; key: "quantize" }

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        // Header: artwork, title/artist, BPM with sync state, deck focus.
        RowLayout {
            Layout.fillWidth: true
            Layout.preferredHeight: 58
            Layout.margins: 4
            spacing: 6

            Rectangle {
                Layout.preferredWidth: 50
                Layout.preferredHeight: 50
                color: "#222"

                Image {
                    anchors.fill: parent
                    source: root.track ? root.track.coverArtUrl : ""
                    fillMode: Image.PreserveAspectCrop
                }
            }

            ColumnLayout {
                Layout.fillWidth: true
                spacing: 0

                Text {
                    Layout.fillWidth: true
                    text: trackLoaded.value && root.track ? root.track.title : "No Track"
                    color: "white"
                    font.pixelSize: 20
                    font.bold: true
                    elide: Text.ElideRight
                }

                Text {
                    Layout.fillWidth: true
                    text: trackLoaded.value && root.track ? root.track.artist : ""
                    color: "#aaa"
                    font.pixelSize: 15
                    elide: Text.ElideRight
                }
            }

            ColumnLayout {
                spacing: 0

                Text {
                    Layout.alignment: Qt.AlignRight
                    text: bpm.value.toFixed(2)
                    color: "white"
                    font.pixelSize: 24
                    font.bold: true
                }

                Text {
                    Layout.alignment: Qt.AlignRight
                    text: {
                        if (syncLeader.value > 0) return "MASTER"
                        if (syncEnabled.value) return "SYNC"
                        if (!fileBpm.value) return ""
                        const percent = (bpm.value / fileBpm.value - 1) * 100
                        return `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}%`
                    }
                    color: syncEnabled.value || syncLeader.value > 0 ? "#ffb000" : "#aaa"
                    font.pixelSize: 13
                    font.bold: true
                }
            }

            Rectangle {
                Layout.preferredWidth: 40
                Layout.preferredHeight: 50
                radius: 4
                color: root.accent

                Text {
                    anchors.centerIn: parent
                    text: root.deckLetter
                    color: "black"
                    font.pixelSize: 32
                    font.bold: true
                }
            }
        }

        // Info bar: key, loop size, elapsed and remaining time.
        RowLayout {
            Layout.fillWidth: true
            Layout.preferredHeight: 26
            Layout.leftMargin: 4
            Layout.rightMargin: 4
            spacing: 4

            InfoBox {
                Layout.preferredWidth: 70
                label: root.openKeys[keyControl.value] || "-"
                highlighted: keylock.value
            }

            InfoBox {
                Layout.preferredWidth: 70
                label: `↻ ${root.formatBeats(loopSize.value)}`
                highlighted: loopEnabled.value
                highlightColor: "#00b400"
            }

            InfoBox {
                Layout.fillWidth: true
                label: `${root.formatTime(playPosition.value * duration.value)}`
            }

            InfoBox {
                Layout.fillWidth: true
                label: `-${root.formatTime((1 - playPosition.value) * duration.value)}`
                highlighted: trackLoaded.value && (1 - playPosition.value) * duration.value < 30
                highlightColor: "#d00000"
            }
        }

        // Scrolling waveform, zoomed with Display Buttons 3/4 (manual 2.6).
        MixxxControls.WaveformDisplay {
            Layout.fillWidth: true
            Layout.fillHeight: true
            Layout.topMargin: 4
            group: root.group
            zoom: zoomControl.value
            backgroundColor: "#000000"

            Mixxx.WaveformRendererEndOfTrack {
                color: "#d00000"
                endOfTrackWarningTime: 30
            }

            Mixxx.WaveformRendererMarkRange {
                Mixxx.WaveformMarkRange {
                    startControl: "loop_start_position"
                    endControl: "loop_end_position"
                    enabledControl: "loop_enabled"
                    color: "#00b400"
                    opacity: 0.5
                    disabledColor: "#ffffff"
                    disabledOpacity: 0.2
                }
            }

            Mixxx.WaveformRendererRGB {
                axesColor: "#00ffffff"
                lowColor: "#ff2020"
                midColor: "#20ff20"
                highColor: "#4080ff"
                gainAll: 1.0
                gainLow: 1.0
                gainMid: 1.0
                gainHigh: 1.0
            }

            Mixxx.WaveformRendererBeat {
                color: "#808080"
            }

            Mixxx.WaveformRendererMark {
                playMarkerColor: "white"
                playMarkerBackground: "transparent"
                defaultMark: Mixxx.WaveformMark {
                    align: "top|right"
                    color: "#ff8000"
                    textColor: "#ffffff"
                    text: " %1 "
                }

                Mixxx.WaveformMark {
                    control: "cue_point"
                    text: "C"
                    align: "top|right"
                    color: "#ff8000"
                    textColor: "#ffffff"
                }
            }
        }

        // Overview with play position and hotcues.
        Item {
            Layout.fillWidth: true
            Layout.preferredHeight: 44
            Layout.margins: 4

            Mixxx.WaveformOverview {
                anchors.fill: parent
                track: root.track
            }

            Rectangle {
                anchors.top: parent.top
                anchors.bottom: parent.bottom
                anchors.left: parent.left
                width: parent.width * playPosition.value
                color: "#80000000"
            }

            Repeater {
                model: 16

                Item {
                    id: hotcue

                    required property int index

                    Mixxx.ControlProxy { id: status; group: root.group; key: `hotcue_${hotcue.index + 1}_status` }
                    Mixxx.ControlProxy { id: position; group: root.group; key: `hotcue_${hotcue.index + 1}_position` }
                    Mixxx.ControlProxy { id: cueColor; group: root.group; key: `hotcue_${hotcue.index + 1}_color` }

                    visible: status.value > 0 && samples.value > 0
                    x: parent.width * position.value / samples.value
                    height: parent.height

                    Rectangle {
                        width: 2
                        height: parent.height
                        color: `#${Math.max(0, cueColor.value).toString(16).padStart(6, "0")}`
                    }
                }
            }

            Rectangle {
                x: parent.width * playPosition.value - 1
                width: 2
                height: parent.height
                color: "white"
            }
        }
    }

    // BPM / KEY / SLICE SIZE / QUANTIZE pop-ups (manual 2.8.2, 2.9, 3.3.2, 3.5.3).
    Rectangle {
        anchors.centerIn: parent
        width: 260
        height: 120
        radius: 8
        visible: root.popup !== "none"
        color: "#e0101010"
        border.color: root.accent
        border.width: 2

        Column {
            anchors.centerIn: parent
            spacing: 4

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: ({ bpm: "BPM", key: "KEY", sliceSize: "SLICE SIZE", quantize: "QUANTIZE" })[root.popup] || ""
                color: "#aaa"
                font.pixelSize: 16
                font.bold: true
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: {
                    switch (root.popup) {
                    case "bpm": return bpm.value.toFixed(2)
                    case "key": return `${root.openKeys[keyControl.value] || "-"}${keylock.value ? " 🔒" : ""}`
                    case "sliceSize": return root.formatBeats(root.sliceSize)
                    case "quantize": return quantize.value ? root.formatBeats(root.quantizeSize) : "OFF"
                    }
                    return ""
                }
                color: "white"
                font.pixelSize: 44
                font.bold: true
            }
        }
    }

    component InfoBox: Rectangle {
        property string label
        property bool highlighted: false
        property color highlightColor: root.accent

        Layout.fillHeight: true
        radius: 3
        color: highlighted ? highlightColor : "#262626"

        Text {
            anchors.centerIn: parent
            text: parent.label
            color: parent.highlighted ? "black" : "white"
            font.pixelSize: 16
            font.bold: true
        }
    }
}
