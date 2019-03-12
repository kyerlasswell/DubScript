const ffmpeg = require('ffmpeg-static');
const exec = require('child_process').exec;
const fs = require('fs');
const csv = require('csv');

const inputDir = "./test/Dump";
const outputDir = "./test/Production";

// Check if ouput directory exists and create
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

readCSV();

function convertFiles(csvFile) {
    csvFile.forEach((row) => {
        // Get file names
        const originalFile = row[1];
        const newFile = row[0];

        // Check if original file exists
        if (!fs.existsSync(inputDir + '/' + originalFile + ".mp3")) {
            return;
        }

        // Command to convert from mp3 to wav
        const cmd = ffmpeg.path + " -y -i " + inputDir + "/" + originalFile + ".mp3 " + outputDir + "/" + newFile + ".wav";

        // Execute the command
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                console.log('Error:' + stderr);
            } else {
                console.log("Converted " + originalFile + ".mp3 to " + newFile + ".wav");
            }
        });
    });
}

function readCSV() {
    const output = [];
    fs.createReadStream('./dublist/dublist.csv')
        .pipe(csv.parse())
        .on('data', (row) => {
            output.push(row);
        })
        .on('end', () => {
            convertFiles(output);
        });
}