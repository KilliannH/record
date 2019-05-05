// Imports modules.
const fs = require(`fs`);
const path = require(`path`);
const Lame = require('lame');
const Speaker = require('speaker');
const { exec } = require('child_process');

const AudioRecorder = require(`node-audiorecorder`);
const xevEmitter = require('xev-emitter')(process.stdin);

// Initialize recorder and file stream.
const audioRecorder = new AudioRecorder({
    program: 'rec',
    silence: 0,         // Silence threshold to stop recording.
    keepSilence: false   // Keep the silence in the recording.
}, console);

// Create file path with random name.
const fileName = path.join(__dirname, '../', 'appointment-ai-v2/', 'record').concat('.wav');

// Create write stream.
let fileStream = null;

let ding = fs.createReadStream('ding.mp3');


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
        setTimeout(() => {

            audioRecorder.stop();
            fileStream = null;

            var a = exec('cd ~/Documents/appointment-ai-v2 && python3 main.py');
            ding.pipe(new Lame.Decoder())
                .on('format', function (format) {
                    this.pipe(new Speaker(format));
                });

            process.on('exit', function () {
                a.kill();
            });

        }, 1500);
    }
});
