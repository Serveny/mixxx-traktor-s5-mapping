.pragma library

// Mixxx key enum order (ChromaticKey, 0 = invalid), shown in Open Key notation like TRAKTOR.
const openKeys = ["", "1d", "8d", "3d", "10d", "5d", "12d", "7d", "2d", "9d", "4d", "11d", "6d",
    "10m", "5m", "12m", "7m", "2m", "9m", "4m", "11m", "6m", "1m", "8m", "3m"]

// TRAKTOR's musical key colors (Screens/Defines/Colors.qml, musicalKeyColors): one color per Open Key
// number around the circle of fifths, shared by the major (d) and minor (m) key.
const openKeyColors = ["#ff0078", "#a000c8", "#0028ff", "#0064ff", "#0088b8", "#00ff80", "#00ff00", "#90ff00", "#ffc800", "#ff7800", "#ff4000", "#ff0000"]

function openKey(keyId) {
    return openKeys[keyId] || ""
}

// Returns undefined for an unknown key.
function color(keyId) {
    const key = openKey(keyId)
    return key ? openKeyColors[parseInt(key) - 1] : undefined
}
