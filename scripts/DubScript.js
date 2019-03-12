const ffmpeg = require('ffmpeg-static');
const exec = require('child_process').exec;
const fs = require('fs');
const csv = require('csv');
const pdfreader = require('pdfreader');

const inputDir = "./test/Dump";
const outputDir = "./test/Production";

// Check if ouput directory exists and create
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

getData('./dublist/dublist.pdf');

function convertFiles(data) {
    data.forEach((row) => {
        // Get file names
        const originalFile = row.original;
        const newFile = row.new;

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

// Get data from the pdf
function getData(fileName) {
    const data = [];
    new pdfreader.PdfReader().parseFileItems(fileName, function (err, item) {
        if (err)
            console.log(err);
        else if (!item)
            parseData(data);
        else if (item.text)
            data.push(item.text);
    });
}

// Convert the data into an array of objects
function parseData(data) {
    const dubs = [];
    data.forEach((d, i) => {
        if (d.startsWith("NET")) {
            dubs.push({ new: d.slice(3), original: data[i + 1] });
        }
    });

    convertFiles(dubs);
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