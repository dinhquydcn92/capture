var express = require('express');
var bodyParser = require('body-parser');
const exec = require('child_process').exec;
var screenshot = require('url-to-screenshot');
var fs = require('fs');
var _ = require('lodash');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var cron = require('node-cron');
var moment = require('moment');
function deleteImage(link) {
    var timeDelete = parseInt(moment().format('x')) + parseInt(2 * 60 * 60 * 1000);
    var second = moment(timeDelete).format('ss');
    var minute = moment(timeDelete).format('mm');
    var hour = moment(timeDelete).format('HH');
    var dayOfMonth = moment(timeDelete).format('D');
    var month = moment(timeDelete).format('M');
    var time = second + ' ' + minute + ' ' + hour + ' ' + dayOfMonth + ' ' + month + ' *';
    cron.schedule(time, function () {
        exec('rm -rf ' + link, {maxBuffer: 500000 * 1024});
    });
}
function replace(stdout) {
    var newstdout = stdout.replace(/Unsafe JavaScript attempt to access frame with URL about:blank from frame with URL file:\/\/netsniff\.js\. Domains, protocols and ports must match\./gi, '');
    return newstdout;
};

//get har
app.post('/send/url', function (req, res) {
    var url = "'" + req.body.url + "'";
    var type = req.body.type;
    if (type === 'all') {
        exec('phantomjs netsniff.js ' + url + ' && chown -R nginx:nginx *', {maxBuffer: 500000 * 1024}, function (error, stdout, stderr) {
            if (!error && stdout) {
                var data = JSON.parse(replace(stdout));
                deleteImage(data.log.link);
                res.send({data: stdout});
            } else {
                console.log(error);
                res.send({data: 'fail'});

            }
        });
    } else if (type === 'image') {
        exec('phantomjs netsniff.js ' + url + ' && chown -R nginx:nginx *', {maxBuffer: 15000 * 1024}, function (error, stdout, stderr) {
            if (!error) {
                var data = JSON.parse(stdout);
                deleteImage(data.log.link);
                var arr = [];
                for (var i = 0; i < data.log.entries.length; i++) {
                    if (data.log.entries[i].response.content.mimeType.toString().split("/")[0] === 'image') {
                        arr.push(data.log.entries[i]);

                    }

                }
                data.log.entries = arr;
                var sendData = JSON.stringify(data);
                if (sendData) {
                    res.send({data: sendData});
                }
            } else {
                res.send({data: 'fail'});
            }
        });
    }
});


//get script har
app.post('/send/script', function (req, res) {
    var content = req.body.script;
    var contentHTML = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title></title></head><body> ' + content + '</body> </html>';
    var path = 'demo.html';
    var type = req.body.type;
    if (type === 'image') {
        fs.writeFile(path, contentHTML, function (err) {
            if (err) {
                res.send({data: 'fail'});
            } else {
                fs.exists(path, function (exists) {
                    if (exists) {
                        exec('phantomjs netsniff.js ' + 'http://test.quynd.com/demo.html' + ' && chown -R nginx:nginx *', {maxBuffer: 500000 * 1024}, function (error, stdout, stderr) {
                            if (!error) {
                                var data = JSON.parse(stdout);
                                deleteImage(data.log.link);
                                var arr = [];
                                for (var i = 0; i < data.log.entries.length; i++) {
                                    if (data.log.entries[i].response.content.mimeType.toString().split("/")[0] === 'image') {
                                        arr.push(data.log.entries[i]);
                                    }
                                }
                                data.log.entries = arr;
                                var sendData = JSON.stringify(data);
                                if (sendData) {
                                    res.send({data: sendData});
                                }
                            }
                        });

                    }
                });
            }
        });
    } else if (type === 'all') {
        fs.writeFile(path, contentHTML, function (err) {
            if (err) {
                res.send({data: 'fail'});
            } else {
                fs.exists(path, function (exists) {
                    if (exists) {
                        exec('phantomjs netsniff.js ' + 'http://test.quynd.com/demo.html' + ' && chown -R nginx:nginx *', {maxBuffer: 500000 * 1024}, function (error, stdout, stderr) {
                            if (!error) {
                                var data = JSON.parse(stdout);
                                deleteImage(data.log.link);
                                res.send({data: stdout});
                            }
                        });

                    }
                });
            }
        });
    }
});

//Capture screen
app.post('/capture/url', function (req, res) {
    var linkImage = ('image' + Date.now().toString() + 'u.jpg');
    var url = "'" + req.body.url + "'";
    var cmd = ('phantomjs rasterize.js ' + url + ' ' + linkImage + ' && chown -R nginx:nginx * ').toString();
    exec(cmd, {maxBuffer: 500000 * 1024}, function (error, stdout, stderr) {
        if (!error) {
            deleteImage(linkImage);
            res.send({data: linkImage});
        } else {
            res.send({data: 'fail'});

        }
    });
});

//Capture Screen script
app.post('/capture/script', function (req, res) {
    var linkImage = ('image' + Date.now().toString() + 'u.jpg');
    var url = '"' + req.body.url + '"';
    var content = req.body.script;
    var contentHTML = content;
    var path = 'demo.txt';
    fs.writeFile(path, contentHTML, function (err) {
        if (err) {
            res.send({data: 'fail'});
        } else {
            fs.exists(path, function (exists) {
                if (exists) {
                    var cmd = ('phantomjs rasterize.js ' + url + ' ' + linkImage + ' && chown -R nginx:nginx * ').toString();
                    exec(cmd, {maxBuffer: 500000 * 1024}, function (error, stdout, stderr) {
                        if (!error) {
                            deleteImage(linkImage);
                            res.send({data: linkImage});
                        } else {
                            console.log(error);
                            res.send({data: 'fail'});

                        }
                    });

                }
            });
        }
    });

});

app.listen(4300, function () {
    console.log('Example app listening on port 4300!');
});
