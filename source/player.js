const urlParams = new URLSearchParams(window.location.search);
const fetchUrl = urlParams.get('f') == null ? "/dfl/1/00000000-0000-0000-0000-000000000000.bytes" : `/dfl/1/${urlParams.get('f')}.bytes`;

window.RufflePlayer = window.RufflePlayer || {};
const ruffle = window.RufflePlayer.newest();
const player = ruffle.createPlayer();

window.RufflePlayer.config = {
    "allowNetworking": "none",
    "allowScriptAccess": false,
    "autoplay": "auto",
    "forceAlign": true,
    "forceScale": true,
    "letterbox": "on",
    "logLevel": "ERROR",
    "openUrlMode": "deny",
    "polyfills": false,
    "scale": "showAll",
    "unmuteOverlay": "on"
};

document.body.appendChild(player);
player.load(fetchUrl);