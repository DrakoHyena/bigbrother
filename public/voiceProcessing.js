import { renderVoiceInput } from "./rendering.js";

const stt = new SpeechRecognition();
stt.continuous = false;
stt.lang = "en-US";
stt.interimResults = false;
stt.maxAlternatives = 3;
stt.processLocally = false;
stt.addEventListener("end", () => { stt.start() })
stt.addEventListener("result", (e) => {
    if (!e.results[0].isFinal) return;
    const text = e.results[0][0].transcript
    renderVoiceInput(text)
})
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
export { stt }
