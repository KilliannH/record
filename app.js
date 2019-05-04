// Imports modules.
const fs = require(`fs`),
    path = require(`path`);

const AudioRecorder = require(`node-audiorecorder`);
const xevEmitter = require('xev-emitter')(process.stdin);

const DIRECTORY = `examples-recordings`;

// Initialize recorder and file stream.
const audioRecorder = new AudioRecorder({
    program: 'rec',
    silence: 0,         // Silence threshold to stop recording.
    keepSilence: false   // Keep the silence in the recording.
}, console);

// Create path to write recordings to.
if (!fs.existsSync(DIRECTORY)){
    fs.mkdirSync(DIRECTORY);
}
// Create file path with random name.
const fileName = path.join(DIRECTORY, 'record').concat(`.wav`);
console.log(`filename : `, fileName);

// Create write stream.
let fileStream = null;

process.stdin.resume();

xevEmitter.on('KeyPress', (key) => {
    console.log(key, 'was pressed');
    if(key === 'ISO_Level3_Shift') {
        fileStream = fs.createWriteStream(fileName, { encoding: `binary` });
        audioRecorder.start().stream().pipe(fileStream);
    }
});

xevEmitter.on('KeyRelease', (key) => {
    console.log(key, 'was released');
    if(key === 'ISO_Level3_Shift') {
        audioRecorder.stop();
        fileStream = null;
    }
});
