import Human from "https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/human.esm.js";

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

const human = new Human();
const stt = new SpeechRecognition();
stt.continuous = true;
stt.lang = "en-US";
stt.interimResults = false;
stt.maxAlternatives = 1;
stt.processLocally = true;
// TODO: close occasionally to clear results array
// TODO: add google-chrome only warning/check 
stt.addEventListener("stop", stt.start)
stt.addEventListener("result", (e) => {
    for (let result of e.results) {
        if (!result.isFinal) continue;
        const res = result[0];
        console.log(res.transcript)
    }
})
stt.addEventListener("error", (event) => {
    console.error("STT Error:", event.error);
});


let inputSource = undefined;
const video = document.createElement("video");
video.muted = true;
let interacted = false
window.addEventListener("click", async () => {
    inputSource = navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    })
    inputSource.then((stream) => {
        video.srcObject = stream;
        video.play();
    }).catch((err) => {
        console.error(err);
        alert("Failed to capture webcam video or mic audioi. The program will not run at this time.")
    });

    let sttAvail = await SpeechRecognition.available({ langs: ["en-US"], processLocally: true })

    if (sttAvail === "unavailable") {
        alert(`Local en-US text to speech is unavailable. Please download or make accesible the relavent language pack. The program will not run at this time.`);
    } else if (sttAvail === "available") {
        stt.start();
        stt.started = true;
    } else {
        let downloadRes = await SpeechRecognition.install({
            langs: ["en-US"],
            processLocally: true,
        })
        if (!downloadRes) alert("Failed to download en-US text to speech. Make sure you have a reliable internet connection and try again. The program will not run at this time.")
    }

    stt.started = true;

    interacted = true;
});


export { interacted, human, humanConfig, video, stt }
