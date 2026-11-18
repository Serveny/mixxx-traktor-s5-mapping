// Browser view, following S5 manual 2.1: the folders and tracks of the current library folder with the
// selected entry highlighted in blue, the location at the top, SORT BY at the bottom left and PREVIEW at the
// bottom right. The folders are Mixxx's library sidebar (Tracks, Playlists, Crates, Computer, History, ...);
// opening one also opens it in Mixxx's library, like TRAKTOR's browser follows the controller.
// The screen renders in its own thread while the library lives in the GUI thread, so Mixxx.LibraryBrowser
// (Mixxx patch) sends plain copies, and the list is a fixed set of rows: views whose delegates are created
// while rendering abort with a cross-thread connection error.
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
    // Same order as browserSortColumns in src/components/screen-browser.ts; "#" is the order in Mixxx's library.
    readonly property var sortLabels: ["TITLE", "ARTIST", "BPM", "#", "KEY"]
    readonly property var sortKeys: ["title", "artist", "bpm", "position", "key"]
    readonly property int visibleRows: 7

    // Opened folder: child rows from the top level, and their labels.
    property var path: []
    property var pathLabels: []
    property var folders: []
    property var tracks: []
    // Folders first, then the sorted tracks.
    property var rows: []
    property int selected: 0
    // Row to select once the requested folder arrives; -1 keeps the selection.
    property int pendingSelection: -1
    // First row shown, keeping the selection in the middle where possible.
    readonly property int firstRow: Math.max(0, Math.min(root.selected - Math.floor(root.visibleRows / 2),
                                                         root.rows.length - root.visibleRows))

    color: "black"

    function scroll(rows) {
        root.selected = Math.max(0, Math.min(root.rows.length - 1, root.selected + rows))
    }

    function selectedEntry() {
        return root.rows[root.selected] ?? null
    }

    function selectedUrl() {
        const entry = root.selectedEntry()
        return entry && !entry.folder ? entry.url : null
    }

    // -- 🚜 S5 Docs 2.1.2: "Press the BROWSE encoder to open a folder." / "Press the BROWSE encoder to load a track."
    function activateSelected() {
        const entry = root.selectedEntry()
        if (entry && entry.folder) {
            root.openFolder(root.path.concat([root.selected]), 0)
        } else {
            root.loadSelected()
        }
    }

    // -- 🚜 S5 Docs 2.1.2: "To return to the previous folder: Press the BACK button."
    function back() {
        if (root.path.length > 0) {
            root.openFolder(root.path.slice(0, -1), root.path[root.path.length - 1])
        }
    }

    function openFolder(path, selection) {
        root.pendingSelection = selection
        libraryBrowser.open(path)
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

    function sortTracks() {
        const key = root.sortKeys[root.sortColumn]
        const direction = root.sortDescending ? -1 : 1
        const compare = typeof root.tracks[0]?.[key] === "number"
            ? (a, b) => (a[key] - b[key]) * direction
            : (a, b) => a[key].localeCompare(b[key], undefined, { sensitivity: "base" }) * direction
        root.tracks = root.tracks.slice().sort(compare)
    }

    function updateRows() {
        root.rows = root.folders.map(label => ({ folder: true, title: label })).concat(root.tracks)
        if (root.pendingSelection >= 0) {
            root.selected = root.pendingSelection
            root.pendingSelection = -1
        }
        root.scroll(0)
    }

    function resort() {
        root.sortTracks()
        // Show the first track in the new order.
        root.selected = root.folders.length
        root.updateRows()
    }

    // -- 🚜 S5 Docs 2.2.3: "The Browser resumes at the last selected item."
    onVisibleChanged: {
        if (visible) {
            root.openFolder(root.path, root.selected)
        }
    }
    onSortColumnChanged: resort()
    onSortDescendingChanged: resort()

    Mixxx.ControlProxy { id: previewPlay; group: "[PreviewDeck1]"; key: "play" }

    Mixxx.LibraryBrowser {
        id: libraryBrowser

        // Always followed by tracksChanged, which applies the pending selection.
        onOpened: (path, labels, children) => {
            root.path = Array.from(path)
            root.pathLabels = Array.from(labels)
            root.folders = Array.from(children)
        }
        onTracksChanged: tracks => {
            root.tracks = Array.from(tracks, (track, index) => Object.assign({ position: index }, track))
            root.sortTracks()
            root.updateRows()
        }
    }

    // Header: location in the library.
    Rectangle {
        id: header
        anchors.top: parent.top
        width: parent.width
        height: 26
        color: "#1a1a1a"

        // -- 🚜 S5 Docs 2.1.2: "shows your current location in the folder structure at the top of the display,
        // e.g. BROWSER>PLAYLIST>DEMO TRACKS". Long paths keep their end visible.
        Text {
            anchors.left: parent.left
            anchors.leftMargin: 6
            anchors.right: counter.left
            anchors.rightMargin: 6
            anchors.verticalCenter: parent.verticalCenter
            text: ["BROWSER"].concat(root.pathLabels).join(" > ").toUpperCase()
            color: "#aaa"
            font.pixelSize: 14
            font.bold: true
            elide: Text.ElideLeft
        }

        Text {
            id: counter
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
                readonly property bool isFolder: entry?.folder ?? false

                width: parent.width
                height: root.rowHeight
                color: isSelected ? "#2aa6ff" : (row % 2 ? "#141414" : "black")

                // Folder symbol: a tab on top of the body.
                Item {
                    id: folderIcon
                    anchors.left: parent.left
                    anchors.leftMargin: 6
                    anchors.verticalCenter: parent.verticalCenter
                    width: isFolder ? 16 : 0
                    height: 12
                    visible: isFolder

                    Rectangle {
                        width: 7
                        height: 3
                        color: isSelected ? "white" : "#bbb"
                    }

                    Rectangle {
                        y: 2
                        width: parent.width
                        height: parent.height - 2
                        radius: 1
                        color: isSelected ? "white" : "#bbb"
                    }
                }

                Column {
                    anchors.left: folderIcon.right
                    anchors.leftMargin: isFolder ? 6 : 0
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
                        visible: !isFolder
                        text: entry?.artist ?? ""
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
                        text: entry?.key ?? ""
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
