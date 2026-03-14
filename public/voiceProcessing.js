import { renderBrainOutput, renderVoiceInput } from "./rendering.js";

const stt = new SpeechRecognition();
stt.continuous = false;
stt.lang = "en-US";
stt.interimResults = false;
stt.maxAlternatives = 3;
stt.processLocally = false;
stt.addEventListener("end", () => { stt.start() })
stt.addEventListener("speechend", () => { stt.stop() })
stt.addEventListener("error", (event) => {
    console.error("STT Error:", event.error);
});

window.addEventListener("click", async () => {
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
})



// Commands
const commands = {
    // Big Brother
    "big": {
        "brother": {
            "*": fullGenericRequest
        }
    },

    // Stalin
    "stalin": {
        "*": fullGenericRequest
    },

    // Netanyahu
    "netanyahu": {
        "*": fullGenericRequest
    },

    // Jarvis
    "jarvis": {
        "blow": {
            "up": {
                "my": {
                    "balls": blowUpBalls
                }
            }
        },
        "*": fullGenericRequest
    },

    // Amazon
    "alexa": {
        "*": fullGenericRequest
    },

    "google": {
        "scan": {
            "this": {
                "guy's": {
                    "balls": scanBalls
                }
            }
        }
    },
}

function fullGenericRequest(text) {
    renderVoiceInput(text)
}

function blowUpBalls(text) {
}

function scanBalls(text) {
}

stt.addEventListener("result", (e) => {
    if (!e.results[0].isFinal) return;
    const text = e.results[0][0].transcript + " " // Add space at the end so keywords said last trigger bc * check
    console.log("New speech heard", text)
    const textArr = text.split(" ");
    let lastObj = commands;
    renderBrainOutput("New speech input detected")
    for (let word of textArr) {
        let targetObj = lastObj[word.toLowerCase()] || lastObj["*"];
        if (typeof targetObj === "object") {
            renderBrainOutput(`Found branch extension "${word}"`);
            lastObj = targetObj
        } else if (typeof targetObj === "function") {
            renderBrainOutput("Executing function")
            targetObj(text)
            break;
        } else if (typeof targetObj === "undefined") {
            lastObj = commands
        }
    }

})

export { stt }
