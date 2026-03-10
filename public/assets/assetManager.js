import { updateStatus, assetsDoneLoading } from "../loadingManager.js";

const assetsToLoad = {
    eye: "eye.png"
}
const assets = {};

let endCount = 1;
let count = 0;
for (let assetName in assetsToLoad) {
    const fileName = assetsToLoad[assetName];
    const img = new Image();
    img.src = `/assets/${fileName}`;
    img.onerror = () => {
        updateStatus(`Failed to download ${fileName}`, "Please reload.");
    }
    img.onload = () => {
        createImageBitmap(img).then(bmp => {
            assets[assetName] = bmp;
            count++;
            if (count === endCount) {
                assetsDoneLoading();
                updateStatus("Finished loading assets", "yay!")
            }
        })
    }
}

export { assets }
