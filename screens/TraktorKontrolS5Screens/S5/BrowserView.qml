// Browser view, following S5 manual 2.1: track list with the selected entry highlighted in blue,
// location at the top, SORT BY at the bottom left and PREVIEW at the bottom right.
// Mixxx's QML library only offers the full track collection, so there are no playlist/folder levels.
// The screen renders in its own thread while the library model lives in the GUI thread, and Qt aborts when
// a view binds to a model across threads. So the rows are copied into a JS array when the browser opens.
// Views whose delegates are created while rendering hit the same check, so the list is a fixed set of rows.
// shortcut: library changes while the browser is open only show up when it is opened again.
import QtQuick 2.15

import Mixxx 1.0 as Mixxx

Rectangle {
    id: root

    // Deck the selected track is loaded into.
    required property string group
    property bool sorting: false
    property int sortColumn: 0
    property bool sortDescending: false
    property bool previewMode: false

    readonly property int rowHeight: 31
    // Same order as browserSortColumns in src/components/screen-browser.ts.
    readonly property var sortLabels: ["TITLE", "ARTIST", "BPM", "KEY"]
    readonly property var sortKeys: ["title", "artist", "bpm", "key"]
    readonly property int visibleRows: 7
    property var rows: []
    property int selected: 0
    // First row shown, keeping the selection in the middle where possible.
    readonly property int firstRow: Math.max(0, Math.min(root.selected - Math.floor(root.visibleRows / 2),
                                                         root.rows.length - root.visibleRows))

    color: "black"

    function scroll(rows) {
        root.selected = Math.max(0, Math.min(root.rows.length - 1, root.selected + rows))
    }

    function selectedUrl() {
        return root.rows.length > 0 ? root.rows[root.selected].url : null
    }

    function loadSelected() {
        const url = root.selectedUrl()
        const player = Mixxx.PlayerManager.getPlayer(root.group)
        if (url && player) {
            player.loadTrackFromLocationUrl(url, false)
        }
    }

    function previewSelected() {
        const url = root.selectedUrl()
        const player = Mixxx.PlayerManager.getPlayer("[PreviewDeck1]")
        if (!url || !player) {
            return
        }
        // Loading ignores the track that is already loaded, so restart that one directly.
        if (player.currentTrack && String(player.currentTrack.trackLocationUrl) === String(url)) {
            previewPlay.value = 1
        } else {
            player.loadTrackFromLocationUrl(url, true)
        }
    }

    // Plain reads only: no signal connections to the GUI-thread model.
    function readRows() {
        const model = sourceTree.allTracks()
        const text = (row, column) => String(model.data(model.index(row, column), 0) ?? "")
        const result = []
        for (let row = 0, count = model.rowCount(); row < count; row++) {
            result.push({
                title: text(row, 0),
                artist: text(row, 1),
                bpm: Number(model.data(model.index(row, 2), 0)) || 0,
                key: text(row, 3),
                url: model.getUrl(row),
            })
        }
        return result
    }

    function sortRows() {
        const key = root.sortKeys[root.sortColumn]
        const direction = root.sortDescending ? -1 : 1
        const compare = key === "bpm"
            ? (a, b) => (a.bpm - b.bpm) * direction
            : (a, b) => a[key].localeCompare(b[key], undefined, { sensitivity: "base" }) * direction
        root.rows = root.rows.slice().sort(compare)
        root.selected = 0
    }

    onVisibleChanged: {
        if (visible) {
            root.rows = root.readRows()
            root.sortRows()
        }
    }
    onSortColumnChanged: sortRows()
    onSortDescendingChanged: sortRows()

    Mixxx.ControlProxy { id: previewPlay; group: "[PreviewDeck1]"; key: "play" }

    Mixxx.LibrarySourceTree {
        id: sourceTree

        // readRows() reads the columns by position.
        defaultColumns: [
            Mixxx.TrackListColumn { columnIdx: Mixxx.TrackListColumn.SQLColumns.Title },
            Mixxx.TrackListColumn { columnIdx: Mixxx.TrackListColumn.SQLColumns.Artist },
            Mixxx.TrackListColumn { columnIdx: Mixxx.TrackListColumn.SQLColumns.Bpm },
            Mixxx.TrackListColumn { columnIdx: Mixxx.TrackListColumn.SQLColumns.Key }
        ]
    }

    // Header: location in the library.
    Rectangle {
        id: header
        anchors.top: parent.top
        width: parent.width
        height: 26
        color: "#1a1a1a"

        Text {
            anchors.left: parent.left
            anchors.leftMargin: 6
            anchors.verticalCenter: parent.verticalCenter
            text: "BROWSER > TRACKS"
            color: "#aaa"
            font.pixelSize: 14
            font.bold: true
        }

        Text {
            anchors.right: parent.right
            anchors.rightMargin: 6
            anchors.verticalCenter: parent.verticalCenter
            text: root.rows.length > 0 ? `${root.selected + 1} / ${root.rows.length}` : "0"
            color: "#aaa"
            font.pixelSize: 14
        }
    }

    Column {
        anchors.top: header.bottom
        anchors.bottom: footer.top
        width: parent.width

        Repeater {
            model: root.visibleRows

            delegate: Rectangle {
                required property int index

                readonly property int row: root.firstRow + index
                readonly property var entry: root.rows[row] ?? null
                readonly property bool isSelected: entry !== null && row === root.selected

                width: parent.width
                height: root.rowHeight
                color: isSelected ? "#2aa6ff" : (row % 2 ? "#141414" : "black")

                Column {
                    anchors.left: parent.left
                    anchors.leftMargin: 6
                    anchors.right: details.left
                    anchors.rightMargin: 6
                    anchors.verticalCenter: parent.verticalCenter

                    Text {
                        width: parent.width
                        text: entry ? entry.title : ""
                        color: "white"
                        font.pixelSize: 15
                        font.bold: true
                        elide: Text.ElideRight
                    }

                    Text {
                        width: parent.width
                        text: entry ? entry.artist : ""
                        color: isSelected ? "white" : "#999"
                        font.pixelSize: 12
                        elide: Text.ElideRight
                    }
                }

                Column {
                    id: details
                    anchors.right: parent.right
                    anchors.rightMargin: 6
                    anchors.verticalCenter: parent.verticalCenter

                    Text {
                        anchors.right: parent.right
                        text: entry && entry.bpm > 0 ? entry.bpm.toFixed(1) : ""
                        color: "white"
                        font.pixelSize: 14
                    }

                    Text {
                        anchors.right: parent.right
                        text: entry ? entry.key : ""
                        color: isSelected ? "white" : "#999"
                        font.pixelSize: 12
                    }
                }
            }
        }
    }

    // Footer: SORT BY (left Performance Mode button) and PREVIEW (right Performance Mode button).
    Rectangle {
        id: footer
        anchors.bottom: parent.bottom
        width: parent.width
        height: 26
        color: "#1a1a1a"

        Rectangle {
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            width: sortText.implicitWidth + 12
            color: root.sorting ? "#2aa6ff" : "transparent"

            Text {
                id: sortText
                anchors.centerIn: parent
                text: `SORT BY ${root.sortLabels[root.sortColumn]} ${root.sortDescending ? "▼" : "▲"}`
                color: "white"
                font.pixelSize: 14
                font.bold: root.sorting
            }
        }

        Rectangle {
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            width: previewText.implicitWidth + 12
            color: root.previewMode ? "#2aa6ff" : "transparent"

            Text {
                id: previewText
                anchors.centerIn: parent
                text: previewPlay.value ? "PREVIEW ▶" : "PREVIEW"
                color: "white"
                font.pixelSize: 14
                font.bold: root.previewMode
            }
        }
    }
}
