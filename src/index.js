let debugMsg = document.getElementById('debug_msg');
const player = document.getElementById('player');
let chunks = [];

function renderRecording(blob, player) {
    debugMsg.innerText += "Replay the audio...\n";
    const blobUrl = URL.createObjectURL(blob);
    player.setAttribute('src', blobUrl);
}


function loadMedia() {
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      }).then((stream) => {
        debugMsg.innerText += "\nInit audio recorder...\n";

        const mimeType = 'audio/webm;codecs=opus';
        const recorder = new MediaRecorder(stream, { type: mimeType });

        debugMsg.innerText += "Start recording...\n";
        
        recorder.ondataavailable = (event) => {
            console.log('recording...');
            if(event.data && event.data.size > 0) {
                chunks.push(event.data);
            }
        };
        recorder.start({ mimeType: mimeType }, 5);

        setTimeout(() => {
            debugMsg.innerText += "Stop recording...\n";
            recorder.stop();

            const recording = new Blob(chunks, {
                type: mimeType
            });
            
            renderRecording(recording, player);
            chunks = [];
        }, 6000);
        
      }).catch((err) => {
        debugMsg.innerText += "[Error] Can't capture audio\n";
        debugMsg.innerText += "[Error] "+err.name+ ": "+ err.message +"\n";
      });
  
} 

loadMedia();