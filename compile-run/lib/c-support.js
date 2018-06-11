var spawn = require("child_process").spawn;
var fs = require('fs');
var runCFile = function (filepath, fileName, stdin, callback) {

        var proc = spawn('gcc', [filepath + './uploads/' + fileName + ".c", "-o", filepath + './uploads/' + fileName]);
        var stdout = "";
        var stderr = "";
        var f = false;
        var timeout = setTimeout(function () {
            proc.stdin.pause();
            proc.kill();
            f = true;
        }, 2000);
        proc.stderr.on('data', function (_stderr) {
            stderr += _stderr;
        });
        proc.stderr.on('end', function () {
            proc.kill();
            f = true;
        });
        proc.on('close', function (code) {
            proc.kill();
            f = true;
            if (code == 0) {
                console.log(code);
                var proc1 = spawn(filepath + './uploads/' + fileName /*+ '.exe'*/);
                var stdout1 = "";
                var stderr1 = "";
                var fl = false;
                var timeout1 = setTimeout(function () {
                    proc1.stdin.pause();
                    proc1.kill();
                    fl = true;
                }, 2000);
                /*
                if (stdin) {
                    proc1.stdin.write(stdin + "\n");
                    proc1.stdin.end();
                }  */
                if(stdin.length>0){
                  for(x in stdin){
                    proc1.stdin.write(stdin[x]+" ");
                    if(x==stdin.length-1){
                      proc1.stdin.write("\n");
                      proc1.stdin.end();
                    }
                  }
                }

                proc1.stdout.on('data', function (_stdout) {
                    stdout1 += _stdout;
                });
                proc1.stdout.on('end', function () {
                    proc.kill();
                    fl = true;
                });
                proc1.stderr.on('data', function (_stderr) {
                    stderr1 += _stderr;
                });
                proc1.stderr.on('end', function () {
                    proc.kill();
                    fl = true;
                });
                proc1.on('close', function (code) {
                  callback(stdout1, "");
                    if (code == 0);
                      //callback(stdout1, "");
                    else {
                        callback("", stderr);
                    }
                });
                if (fl) {
                    clearTimeout(timeout1);
                }
            }
            else {
                callback("", stderr);
            }
        });
        if (f) {
            clearTimeout(timeout);
        }
    }
    /*Async function to run c code and pass stdout,stderr to the callback fn*/
var runC = function (code, stdin, callback) {
    if (!fs.existsSync('./code')) {
        fs.mkdirSync('./code', 0744);
    }
    if (!fs.existsSync('./code/c')) {
        fs.mkdirSync('./code/c', 0744);
    }
    var fileName = 'Source-' + Math.floor(Math.random() * 100000) + '-' + new Date().getTime();
    //Writes source file..
    fs.writeFile('./code/c/' + fileName + '.c', code, function (err) {
        if (!err) {
            runCFile('./code/c', fileName, stdin, function (stdout, stderr) {
                callback(stdout, stderr, "");
            });
        }
        else {
            console.log(err);
            callback("", "", "Couldn't write the file!");
        }
    });
}
module.exports = {
    runC: runC
    , runCFile: runCFile
}
