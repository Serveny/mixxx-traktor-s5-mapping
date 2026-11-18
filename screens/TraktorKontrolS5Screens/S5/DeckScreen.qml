// Track Deck view, following S5 manual 4.2.1.3 (-- 🚜 S5 Docs 4.2.1.3): artwork, title/artist, loop size,
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
    readonly property int deckNumber: parseInt(root.group.replace(/\D/g, ""))
    readonly property string deckLetter: "ABCD"[root.deckNumber - 1] || "?"
    // The other deck on this side (A<->C, B<->D), shown small like the manual's Split View (2.6).
    readonly property string secondaryGroup: `[Channel${root.deckNumber > 2 ? root.deckNumber - 2 : root.deckNumber + 2}]`
    // Mixxx key enum order, shown in Open Key notation like Traktor.
    readonly property var openKeys: ["", "1d", "8d", "3d", "10d", "5d", "12d", "7d", "2d", "9d", "4d", "11d", "6d",
        "10m", "5m", "12m", "7m", "2m", "9m", "4m", "11m", "6m", "1m", "8m", "3m"]

    color: "black"

    // Browser state (manual 2.1), see ScreenBrowser in the HID mapping.
    property bool browserSorting: false
    property int browserSortColumn: 0
    property bool browserSortDescending: false
    property bool browserPreviewMode: false
    // Last seen request counters; the mapping increments them once per request.
    property var lastRequests: ({})

    // Returns how often a request counter was incremented since the last call.
    function takeRequests(key, value) {
        const last = root.lastRequests[key]
        root.lastRequests[key] = value
        return last === undefined ? 0 : value - last
    }

    function onSharedValue(value, _entity, key) {
        switch (key) {
        case "group": root.group = value || root.group; break
        case "popup": root.popup = value || "none"; break
        case "sliceSize": root.sliceSize = value || root.sliceSize; break
        case "quantizeSize": root.quantizeSize = value || root.quantizeSize; break
        case "browserSorting": root.browserSorting = !!value; break
        case "browserSortColumn": root.browserSortColumn = value || 0; break
        case "browserSortDescending": root.browserSortDescending = !!value; break
        case "browserPreviewMode": root.browserPreviewMode = !!value; break
        case "browserScrollRequest": browser.scroll(root.takeRequests(key, value)); break
        case "browserActivateRequest": if (root.takeRequests(key, value) > 0) browser.activateSelected(); break
        case "browserBackRequest": if (root.takeRequests(key, value) > 0) browser.back(); break
        case "browserPreviewRequest": if (root.takeRequests(key, value) > 0) browser.previewSelected(); break
        }
    }

    // Needs Mixxx's controller shared-data API (mixxxdj/mixxx#16129) and sharedDataNamespace="S5" in both mapping XMLs.
    Component.onCompleted: {
        if (typeof engine.makeSharedValueConnection !== "function") {
            return
        }
        for (const key of ["group", "popup", "sliceSize", "quantizeSize", "browserSorting", "browserSortColumn",
                "browserSortDescending", "browserPreviewMode", "browserScrollRequest", "browserActivateRequest",
                "browserBackRequest", "browserPreviewRequest"]) {
            const value = engine.getSharedValue(root.screenId, key)
            if (value !== undefined) {
                // Counters only record a baseline here, so requests from before startup are not replayed.
                root.onSharedValue(value, root.screenId, key)
            }
            engine.makeSharedValueConnection(root.screenId, key, root.onSharedValue)
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
    Mixxx.ControlProxy { id: loopStart; group: root.group; key: "loop_start_position" }
    Mixxx.ControlProxy { id: loopEnd; group: root.group; key: "loop_end_position" }
    Mixxx.ControlProxy { id: playPosition; group: root.group; key: "playposition" }
    Mixxx.ControlProxy { id: duration; group: root.group; key: "duration" }
    Mixxx.ControlProxy { id: trackLoaded; group: root.group; key: "track_loaded" }
    Mixxx.ControlProxy { id: zoomControl; group: root.group; key: "waveform_zoom" }
    Mixxx.ControlProxy { id: samples; group: root.group; key: "track_samples" }
    Mixxx.ControlProxy { id: quantize; group: root.group; key: "quantize" }
    Mixxx.ControlProxy { id: stemCount; group: root.group; key: "stem_count" }

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        // Header like the manual's Track Deck view (4.2.1.3): artwork, title/artist, loop size,
        // remaining/elapsed time, BPM with sync state, deck letter. The key sits under the loop size.
        RowLayout {
            Layout.fillWidth: true
            Layout.preferredHeight: 46
            Layout.leftMargin: 3
            Layout.rightMargin: 3
            Layout.topMargin: 3
            spacing: 5

            Rectangle {
                Layout.preferredWidth: 42
                Layout.preferredHeight: 42
                color: "#222"

                Image {
                    anchors.fill: parent
                    source: root.track ? root.track.coverArtUrl : ""
                    fillMode: Image.PreserveAspectCrop
                }
            }

            ColumnLayout {
                Layout.fillWidth: true
                spacing: -2

                Text {
                    Layout.fillWidth: true
                    text: trackLoaded.value && root.track ? root.track.title : "No Track"
                    color: root.accent
                    font.pixelSize: 19
                    elide: Text.ElideRight
                }

                Text {
                    Layout.fillWidth: true
                    text: trackLoaded.value && root.track ? root.track.artist : ""
                    color: Qt.darker(root.accent, 1.6)
                    font.pixelSize: 16
                    elide: Text.ElideRight
                }
            }

            // Loop size in a circle, filled green while a loop is active.
            ColumnLayout {
                spacing: 1

                Rectangle {
                    Layout.alignment: Qt.AlignHCenter
                    Layout.preferredWidth: 28
                    Layout.preferredHeight: 28
                    radius: 14
                    color: loopEnabled.value ? "#00b400" : "transparent"
                    border.color: loopEnabled.value ? "#00b400" : root.accent
                    border.width: 2

                    Text {
                        anchors.centerIn: parent
                        text: root.formatBeats(loopSize.value)
                        color: loopEnabled.value ? "black" : root.accent
                        font.pixelSize: loopSize.value >= 1 ? 15 : 10
                        font.bold: true
                    }
                }

                Text {
                    Layout.alignment: Qt.AlignHCenter
                    text: root.openKeys[keyControl.value] || ""
                    color: keylock.value ? "black" : "#aaa"
                    font.pixelSize: 11
                    font.bold: true

                    Rectangle {
                        anchors.fill: parent
                        anchors.margins: -1
                        z: -1
                        radius: 2
                        visible: keylock.value
                        color: root.accent
                    }
                }
            }

            // Remaining time over elapsed time, red in the last 30 s.
            ColumnLayout {
                spacing: -2

                Text {
                    Layout.alignment: Qt.AlignRight
                    text: `-${root.formatTime((1 - playPosition.value) * duration.value)}`
                    color: trackLoaded.value && (1 - playPosition.value) * duration.value < 30 ? "#ff3030" : root.accent
                    font.pixelSize: 21
                    font.bold: true
                }

                Text {
                    Layout.alignment: Qt.AlignRight
                    text: root.formatTime(playPosition.value * duration.value)
                    color: Qt.darker(root.accent, 1.4)
                    font.pixelSize: 15
                    font.bold: true
                }
            }

            ColumnLayout {
                spacing: -2

                Text {
                    Layout.alignment: Qt.AlignRight
                    text: bpm.value.toFixed(2)
                    color: root.accent
                    font.pixelSize: 21
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
                    color: syncEnabled.value || syncLeader.value > 0 ? "#ffb000" : Qt.darker(root.accent, 1.4)
                    font.pixelSize: 15
                    font.bold: true
                }
            }

            Text {
                Layout.preferredWidth: 30
                horizontalAlignment: Text.AlignHCenter
                text: root.deckLetter
                color: root.accent
                font.pixelSize: 44
                font.bold: true
            }
        }

        // Scrolling waveform, zoomed with Display Buttons 3/4 (manual 2.6).
        MixxxControls.WaveformDisplay {
            Layout.fillWidth: true
            Layout.fillHeight: true
            Layout.topMargin: 3
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
                    // Dark green background tint for an active loop, nothing for an inactive one.
                    color: "#00b400"
                    opacity: 0.3
                    disabledColor: "transparent"
                    disabledOpacity: 0
                }
            }

            // Blue tones like TRAKTOR. ignoreEq and normalized (local Mixxx patch) keep the EQ knobs and
            // pregain out of the drawing, so e.g. a bassline stays visible while its EQ is turned down,
            // and scale the track's loudest peak to the full height.
            Mixxx.WaveformRendererRGB {
                ignoreEq: true
                normalized: true
                axesColor: "#00ffffff"
                lowColor: "#1c4c9c"
                midColor: "#3c8ce0"
                highColor: "#b4e8ff"
                // Green inside an active loop, like TRAKTOR (local Mixxx patch).
                loopLowColor: "#1c7c1c"
                loopMidColor: "#3cc83c"
                loopHighColor: "#c0ffc0"
                gainAll: 1.0
                gainLow: 1.0
                gainMid: 1.0
                gainHigh: 1.0
            }

            Mixxx.WaveformRendererBeat {
                color: "#808080"
            }

            Mixxx.WaveformRendererMark {
                playMarkerColor: "#ff2020"
                playMarkerBackground: "transparent"
                defaultMark: Mixxx.WaveformMark {
                    align: "top|right"
                    color: "#ff8000"
                    textColor: "#ffffff"
                    text: " %1 "
                }

                // Loop in/out: green line with a triangle at the bottom.
                Mixxx.WaveformMark {
                    control: "loop_start_position"
                    text: "▲"
                    align: "bottom|center"
                    color: "#00e000"
                    textColor: "#00e000"
                }

                Mixxx.WaveformMark {
                    control: "loop_end_position"
                    text: "▲"
                    align: "bottom|center"
                    color: "#00e000"
                    textColor: "#00e000"
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

        // Stem Deck: one box per stem with volume and mute (manual 3.8).
        RowLayout {
            Layout.fillWidth: true
            Layout.preferredHeight: 30
            Layout.leftMargin: 4
            Layout.rightMargin: 4
            Layout.topMargin: 4
            visible: trackLoaded.value && stemCount.value > 0
            spacing: 4

            Repeater {
                model: root.track && stemCount.value > 0 ? root.track.stemsModel : 0

                Item {
                    id: stem

                    required property int index
                    required property string label
                    required property color color
                    readonly property string stemGroup: `${root.group.slice(0, -1)}_Stem${stem.index + 1}]`

                    Mixxx.ControlProxy { id: stemVolume; group: stem.stemGroup; key: "volume" }
                    Mixxx.ControlProxy { id: stemMute; group: stem.stemGroup; key: "mute" }

                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    opacity: stemMute.value ? 0.35 : 1

                    Rectangle {
                        anchors.fill: parent
                        radius: 3
                        color: "#262626"
                    }

                    Rectangle {
                        anchors.left: parent.left
                        anchors.top: parent.top
                        anchors.bottom: parent.bottom
                        width: parent.width * stemVolume.value
                        radius: 3
                        color: stem.color
                    }

                    Text {
                        anchors.centerIn: parent
                        text: stemMute.value ? `${stem.label} (M)` : stem.label
                        color: "white"
                        style: Text.Outline
                        styleColor: "black"
                        font.pixelSize: 13
                        font.bold: true
                    }
                }
            }
        }

        // Other deck on this side, only when it has a track.
        SecondaryDeck {
            Layout.fillWidth: true
            Layout.preferredHeight: 22
            Layout.leftMargin: 4
            Layout.rightMargin: 4
            Layout.topMargin: 4
            deckGroup: root.secondaryGroup
        }

        // Overview with play position and hotcues.
        Item {
            Layout.fillWidth: true
            Layout.preferredHeight: 34
            Layout.margins: 3

            Mixxx.WaveformOverview {
                anchors.fill: parent
                track: root.track
                normalized: true
                colorLow: "#1c4c9c"
                colorMid: "#3c8ce0"
                colorHigh: "#b4e8ff"
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

            // Loop in/out as green triangles at the bottom.
            Repeater {
                model: 2

                Text {
                    required property int index
                    readonly property real position: index === 0 ? loopStart.value : loopEnd.value

                    visible: loopEnabled.value > 0 && position >= 0 && samples.value > 0
                    x: parent.width * position / samples.value - width / 2
                    anchors.bottom: parent.bottom
                    anchors.bottomMargin: -4
                    text: "▲"
                    color: "#00e000"
                    font.pixelSize: 12
                }
            }

            Rectangle {
                x: parent.width * playPosition.value - 1
                width: 2
                height: parent.height
                color: "#ff2020"
            }
        }
    }

    // BPM / KEY / SLICE SIZE / QUANTIZE pop-ups (manual 2.8.2, 2.9, 3.3.2, 3.5.3).
    Rectangle {
        anchors.centerIn: parent
        width: 260
        height: 120
        radius: 8
        visible: root.popup !== "none" && root.popup !== "browser"
        color: "#e0101010"
        border.color: root.accent
        border.width: 2

        Column {
            anchors.centerIn: parent
            spacing: 4

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: ({ bpm: "BPM", key: "KEY", sliceSize: "SLICE SIZE", quantize: "QUANTIZE", beatgrid: "BEATGRID" })[root.popup] || ""
                color: "#aaa"
                font.pixelSize: 16
                font.bold: true
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: {
                    switch (root.popup) {
                    case "bpm":
                    case "beatgrid": return bpm.value.toFixed(2)
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

    BrowserView {
        id: browser
        anchors.fill: parent
        visible: root.popup === "browser"
        group: root.group
        sorting: root.browserSorting
        sortColumn: root.browserSortColumn
        sortDescending: root.browserSortDescending
        previewMode: root.browserPreviewMode
    }

    component SecondaryDeck: Rectangle {
        id: secondary

        property string deckGroup
        readonly property var deckTrack: Mixxx.PlayerManager.getPlayer(secondary.deckGroup).currentTrack

        Mixxx.ControlProxy { id: secondaryLoaded; group: secondary.deckGroup; key: "track_loaded" }
        Mixxx.ControlProxy { id: secondaryBpm; group: secondary.deckGroup; key: "bpm" }
        Mixxx.ControlProxy { id: secondaryPosition; group: secondary.deckGroup; key: "playposition" }
        Mixxx.ControlProxy { id: secondaryPlay; group: secondary.deckGroup; key: "play" }

        visible: secondaryLoaded.value > 0
        radius: 3
        color: "#1a1a1a"

        Rectangle {
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            width: parent.width * secondaryPosition.value
            radius: 3
            color: "#333"
        }

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 4
            anchors.rightMargin: 4
            spacing: 6

            Text {
                text: "ABCD"[parseInt(secondary.deckGroup.replace(/\D/g, "")) - 1] || "?"
                color: secondaryPlay.value ? "#2aa6ff" : "#888"
                font.pixelSize: 14
                font.bold: true
            }

            Text {
                Layout.fillWidth: true
                text: secondary.deckTrack ? secondary.deckTrack.title : ""
                color: "#ccc"
                font.pixelSize: 13
                elide: Text.ElideRight
            }

            Text {
                text: secondaryBpm.value.toFixed(1)
                color: "#ccc"
                font.pixelSize: 13
                font.bold: true
            }
        }
    }
}
