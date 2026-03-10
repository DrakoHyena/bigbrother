import { interacted, micNode, setupProcessing } from "./processing.js";
import { renderLoop } from "./rendering.js";

const loadingDiv = document.getElementById("loadingDiv");
const statusText = document.getElementById("statusText");
const subStatusText = document.getElementById("subStatusText");

let isDoneLoading = false;
let assetsDoneLoadingFlag = false;

function updateStatus(main, sub) {
    statusText.innerText = main;
    subStatusText.innerText = sub;
}

function assetsDoneLoading() {
    assetsDoneLoadingFlag = true;
}

const loadingInterval = setInterval(() => {
    if (assetsDoneLoadingFlag === false) return;
    if (!window.loadVosklet || !micNode) return updateStatus("Loading Vosk", "This could take a minute")
    if (!interacted) return updateStatus("Click anywhere to invite Big Brother into your home", "This is your last chance to exit.")
    loadingDiv.remove();
    setupProcessing();
    renderLoop();
    clearInterval(loadingInterval)
}, 10);

export {
    updateStatus,
    assetsDoneLoading,
}
