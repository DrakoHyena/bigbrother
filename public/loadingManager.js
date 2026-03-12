import { interacted, stt } from "./processing.js";
import { renderLoop, ctx } from "./rendering.js";

const loadingDiv = document.getElementById("loadingDiv");
const statusText = document.getElementById("statusText");
const subStatusText = document.getElementById("subStatusText");

let assetsDoneLoadingFlag = false;

function updateStatus(main, sub) {
    statusText.innerText = main;
    subStatusText.innerText = sub;
}

function assetsDoneLoading() {
    assetsDoneLoadingFlag = true;
}

const loadingInterval = setInterval(() => {
    if (!!window.navigator.userAgentData.brands.filter(e => e.brand === 'Google Chrome').length === false)
        return updateStatus("Big Brother requires that you use Google-Chrome", "(This is due to Google-Chrome specific features)")
    if (!!ctx.beginLayer === false)
        return updateStatus("Big Brother requires browser features you dont have enabled", "Go to chrome://flags and enable Experimental Web Platform Features")
    if (assetsDoneLoadingFlag === false)
        return; // updateStatus in assetLoading
    if (!interacted)
        return updateStatus("Click anywhere to invite Big Brother into your home", "This is your last chance to exit.")
    if (!stt.started)
        return updateStatus("Installing Microphone Bugs", "(Big Brother should always be in the know)")
    loadingDiv.remove();
    renderLoop();
    clearInterval(loadingInterval)
}, 10);

export {
    updateStatus,
    assetsDoneLoading,
}
