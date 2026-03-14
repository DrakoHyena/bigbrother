import { human, video, humanConfig } from "/videoProcessing.js"
import { stt } from "/voiceProcessing.js"
import { assets } from "/assets/assetManager.js";

// Config/util
const eyeSpeed = 0.025;
const pupilMovement = 1; // 0 to 1 value (1.0 goes to the very edge of the eye)

function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Canvas
const canvas = document.getElementById("displayCanvas");
const ctx = canvas.getContext("2d");

let eyeSize, pupilSize, eyeRange, pupilRange;

function updateSizes() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    eyeSize = canvas.height * 0.1;
    pupilSize = eyeSize * 0.5;
    eyeRange = canvas.height * .5;

    // Calculates max movement so the pupil stays inside the eye geometry
    pupilRange = (eyeSize - pupilSize) * pupilMovement;
}
window.addEventListener("resize", updateSizes);
updateSizes();

const frameData = {
    objects: [],
    eyes: new Map()
};

function newEye(id) {
    const eye = {
        fade: 0,
        pupilX: canvas.width / 2,
        pupilY: canvas.height / 2,
        eyeX: canvas.width / 2,
        eyeY: canvas.height / 2,
        targetX: canvas.width / 2,
        targetY: canvas.height / 2,
        dead: false
    };
    frameData.eyes.set(id, eye);
    return eye;
}

function updateEye(id, x, y) {
    let eye = frameData.eyes.get(id);
    if (!eye) {
        eye = newEye(id);
    }

    if (x !== undefined && y !== undefined) {
        eye.targetX = x;
        eye.targetY = y;
    }

    eye.fade = lerp(eye.fade, id > frameData.objects.length - 1 ? 0 : 1, eyeSpeed);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const dxCenter = eye.targetX - centerX;
    const dyCenter = eye.targetY - centerY;
    const distToCenter = Math.hypot(dxCenter, dyCenter);

    const dirX = distToCenter === 0 ? 0 : (dxCenter / distToCenter);
    const dirY = distToCenter === 0 ? 0 : (dyCenter / distToCenter);

    let eyeTargetX, eyeTargetY;

    if (distToCenter > eyeRange) {
        eyeTargetX = eye.targetX - eyeSize * pupilMovement * dirX;
        eyeTargetY = eye.targetY - eyeSize * pupilMovement * dirY;
    } else {
        eyeTargetX = eye.targetX;
        eyeTargetY = eye.targetY;
    }

    eye.eyeX = lerp(eye.eyeX, eyeTargetX, eyeSpeed);
    eye.eyeY = lerp(eye.eyeY, eyeTargetY, eyeSpeed);
    eye.pupilX = lerp(eye.pupilX, eye.targetX, eyeSpeed);
    eye.pupilY = lerp(eye.pupilY, eye.targetY, eyeSpeed);

    const dxEye = eye.pupilX - eye.eyeX;
    const dyEye = eye.pupilY - eye.eyeY;
    const distFromEye = Math.hypot(dxEye, dyEye) || 1;

    if (distFromEye > pupilRange) {
        eye.pupilX = eye.eyeX + (dxEye / distFromEye) * pupilRange;
        eye.pupilY = eye.eyeY + (dyEye / distFromEye) * pupilRange;
    }

    if (eye.fade <= 0.001) {
        eye.dead = true;
    } else {
        eye.dead = false;
    }
}

function updateFrame() {
    human.detect(video, humanConfig).then(dat => {
        if (!dat.object) return;

        frameData.objects = dat.object.filter(item =>
            item.label === "person" || item.label === "dog" || item.label === "cat"
        );

        for (let i = 0; i < frameData.objects.length; i++) {
            const item = frameData.objects[i];
            const [x, y, width, height] = item.boxRaw;

            const cx = 1 - (x + (width / 2));
            const cy = y + (height / 2);

            const mx = canvas.width * cx;
            const my = canvas.height * cy;

            updateEye(item.id, mx, my);
        }
        setTimeout(updateFrame);
    })
}
updateFrame();

function renderLoop() {
    let vidXS = canvas.width / video.videoWidth || 1;
    let vidYS = canvas.height / video.videoHeight || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // ctx.drawImage(video, 0, 0, video.videoWidth * vidXS, video.videoHeight * vidYS);

    for (let [id, eye] of frameData.eyes) {
        updateEye(id);

        ctx.globalAlpha = eye.fade;
        ctx.beginLayer();
        const eyeRenderSize = eyeSize + pupilSize

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(eye.eyeX, eye.eyeY, eyeRenderSize * .75, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(eye.pupilX, eye.pupilY, pupilSize, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.drawImage(assets.eye, eye.eyeX - eyeRenderSize, eye.eyeY - eyeRenderSize, eyeRenderSize * 2, eyeRenderSize * 2);
        ctx.endLayer();

        if (eye.dead === true) {
            frameData.eyes.delete(id)
        }
    }

    ctx.restore();


    requestAnimationFrame(renderLoop);
}

// HTML
let lastHtmlUpdate = Date.now();
const htmlHideTime = 5000;
const htmlContainer = document.getElementById("htmlContainer")
const textContainer = document.getElementById("textContainer")
const imageContainer = document.getElementById("imageContainer")
const processingContainer = document.getElementById("processingContainer")
const voiceContainer = document.getElementById("voiceContainer")

function renderVoiceInput(text) {
    const textEle = document.createElement("p");
    const spanEle = document.createElement("span");
    spanEle.innerText = (new Date().toLocaleTimeString());
    textEle.append(spanEle, " " + text);
    voiceContainer.appendChild(textEle);
}

function showHTML() {
    lastHtmlUpdate = Date.now();
}

setInterval(() => {
    if (Date.now() - lastHtmlUpdate > htmlHideTime) {
        //htmlContainer.style.opacity = 0;
    } else {
        htmlContainer.style.opacity = 1;
    }
}, 1000)

export { renderLoop, ctx, renderVoiceInput, showHTML }
