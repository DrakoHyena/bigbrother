import Human from "https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/human.esm.js";
import { updateStatus } from "./loadingManager.js";

const humanConfig = {
    backend: 'webgl',
    cacheModels: true,
    validateModels: true,
    async: true,
    warmup: 'full',
    cacheSensitivity: 0.70,
    skipAllowed: true,
    deallocate: true,
    flags: {},
    softwareKernels: false,
    filter: {
        enabled: false,
        equalization: false,
        width: 0,
        height: 0,
        flip: false,
        return: true,
        autoBrightness: true,
        brightness: 0,
        contrast: 0,
        sharpness: 0,
        blur: 0,
        saturation: 0,
        hue: 0,
        negative: false,
        sepia: false,
        vintage: false,
        kodachrome: false,
        technicolor: false,
        polaroid: false,
        pixelate: 0,
    },
    gesture: {
        enabled: false,
    },
    face: {
        enabled: false,
        detector: {
            modelPath: 'blazeface.json',
            rotation: false,
            maxDetected: 1,
            skipFrames: 99,
            skipTime: 2500,
            minConfidence: 0.2,
            minSize: 0,
            iouThreshold: 0.1,
            scale: 1.4,
            mask: false,
            return: false,
        },
        mesh: {
            enabled: false,
            modelPath: 'facemesh.json',
            keepInvalid: false,
        },
        attention: {
            enabled: false,
            modelPath: 'facemesh-attention.json',
        },
        iris: {
            enabled: false,
            scale: 2.3,
            modelPath: 'iris.json',
        },
        emotion: {
            enabled: false,
            minConfidence: 0.1,
            skipFrames: 99,
            skipTime: 1500,
            modelPath: 'emotion.json',
        },
        description: {
            enabled: false,
            modelPath: 'faceres.json',
            skipFrames: 99,
            skipTime: 3000,
            minConfidence: 0.1,
        },
        antispoof: {
            enabled: false,
            skipFrames: 99,
            skipTime: 4000,
            modelPath: 'antispoof.json',
        },
        liveness: {
            enabled: false,
            skipFrames: 99,
            skipTime: 4000,
            modelPath: 'liveness.json',
        },
    },
    body: {
        enabled: false,
        modelPath: 'movenet-lightning.json',
        maxDetected: -1,
        minConfidence: 0.3,
        skipFrames: 1,
        skipTime: 200,
    },
    hand: {
        enabled: false,
        rotation: true,
        skipFrames: 99,
        skipTime: 1000,
        minConfidence: 0.50,
        iouThreshold: 0.2,
        maxDetected: -1,
        landmarks: true,
        detector: {
            modelPath: 'handtrack.json',
        },
        skeleton: {
            modelPath: 'handlandmark-lite.json',
        },
    },
    object: {
        enabled: true,
        modelPath: 'centernet.json',
        minConfidence: 0.2,
        iouThreshold: 0.4,
        maxDetected: 10,
        skipFrames: 99,
        skipTime: 2000,
    },
    segmentation: {
        enabled: false,
        modelPath: 'rvm.json',
        ratio: 0.5,
        mode: 'default',
    },
}

let inputSource = undefined;
const video = document.createElement("video");
video.muted = true;
const audCtx = new AudioContext({
    sinkId: { type: "none" },
    sampleRate: 16000
});
let micNode = undefined;
let interacted = false
window.addEventListener("click", async () => {
    if (audCtx.state === 'suspended') {
        await audCtx.resume();
    }
    inputSource = navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            channelCount: 1,
        }
    })
    inputSource.then((stream) => {
        micNode = audCtx.createMediaStreamSource(stream)
        video.srcObject = stream;
        video.play();
    }).catch((err) => {
        console.error(err);
        alert("Failed to capture webcam video or mic audio")
    });
    interacted = true;
});


const human = new Human();
let stt = undefined;
async function setupProcessing() {
    updateStatus("Loading ")
    const voskModule = await window.loadVosklet();
    const voskModel = await voskModule.createModel("/models/vosk-model-small-en-us-0.15.tar.gz", "English", "vosk-model-small-en-us-0.15");
    const voskRecognizer = await voskModule.createRecognizer(voskModel, audCtx.sampleRate);
    voskRecognizer.addEventListener("result", ev => console.log("Result: ", ev.detail));
    voskRecognizer.addEventListener("partialResult", ev => console.log("Partial result: ", ev.detail));
    stt = voskRecognizer;

    const audTransferer = await voskModule.createTransferer(audCtx, 128 * 150);
    audTransferer.port.onmessage = ev => {
        voskRecognizer.acceptWaveform(ev.data);
    }
    micNode.connect(audTransferer);
}

export { interacted, setupProcessing, human, humanConfig, video, stt, micNode }
