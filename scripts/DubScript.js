var ffmpeg = require('ffmpeg-static');
var exec = require('child_process').exec;
var fs = require('fs');

var inputDir = "./test/Dump";
var outputDir = "./test/Production";

convertFiles();

function convertFiles() {
    // Loop through all the files in the temp directory
    fs.readdir(inputDir, (err, files) => {
        files.forEach(file => {
            // Get file name without extension
            const dotPos = file.indexOf('.');
            const fileName = file.slice(0, dotPos);

            // Command to convert from mp3 to wav
            const cmd = ffmpeg.path + " -y -i " + inputDir + "/" + file + " " + outputDir + "/" + fileName + ".wav";

            // Execute the command
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    console.log('Error:' + stderr);
                } else {
                    console.log("Converted " + file + " to " + fileName + ".wav");
                }
            });
        });
    });
}