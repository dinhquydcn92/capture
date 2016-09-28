"use strict";
if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function () {
        function pad(n) {
            return n < 10 ? '0' + n : n;
        }

        function ms(n) {
            return n < 10 ? '00' + n : n < 100 ? '0' + n : n
        }

        return this.getFullYear() + '-' +
            pad(this.getMonth() + 1) + '-' +
            pad(this.getDate()) + 'T' +
            pad(this.getHours()) + ':' +
            pad(this.getMinutes()) + ':' +
            pad(this.getSeconds()) + '.' +
            ms(this.getMilliseconds()) + 'Z';
    }
}

var page = require('webpage').create(),
    system = require('system'), output;

if (system.args.length === 1) {
    console.log('Usage: netsniff.js <some URL>');
    phantom.exit(1);
} else {

    page.address = system.args[1];
    output = system.args[2];
    page.resources = [];

    page.onLoadStarted = function () {
        page.startTime = new Date();
    };


    page.customHeaders = {

        "Upgrade-Insecure-Requests": 1,
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36"
    };


    page.viewportSize = {
        width: 1920,
        height: 1080
    };

    page.onResourceReceived = function (res) {
        if (res.stage === 'start') {
            page.resources[res.id].startReply = res;
        }
        if (res.stage === 'end') {
            page.resources[res.id].endReply = res;
        }
    };
    page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36';
    page.onLoadFinished = function (status) {
        return false;
        page.evaluate(function () {
            var timeloadchk = 10000;
            window.setTimeout(function () {
                document.body.style.background = '#fff';
                if (typeof(admSliderMedium) != 'undefined') {
                    admSliderMedium();
                }
                var checkAvaiBanHtml5 = function checkAvaiBanHtml5() {
                    return true;
                }
            }, timeloadchk);
        });
        window.setTimeout(function () {
            page.render(output);
            phantom.exit();
        }, 30000);


    };
    page.onResourceError = function (resourceError) {
        page.reason = resourceError.errorString;
        page.reason_url = resourceError.url;
    };
    page.settings.webSecurityEnabled = false;


    phantom.addCookie({
        'name': '__R', /* required property */
        'value': '1', /* required property */
        'domain': '.kenh14.vn',
        'path': '/', /* required property */
        'httponly': true,
        'secure': false,
        'expires': (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
    });
    phantom.addCookie({
        'name': '__RC', /* required property */
        'value': '4', /* required property */
        'domain': '.kenh14.vn',
        'path': '/', /* required property */
        'httponly': true,
        'secure': false,
        'expires': (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
    });
    phantom.addCookie({
        'name': 'changebeta', /* required property */
        'value': '1', /* required property */
        'domain': '.kenh14.vn',
        'path': '/', /* required property */
        'httponly': true,
        'secure': false,
        'expires': (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
    });


    var timeout1;
    var burn = 0;
    var fncall = function (scriptLink) {
        var content = page.content;
        if (burn === 0 && content.indexOf('ads_zone49') != -1) {
            burn = 1;
            page.evaluate(function () {
                document.body.style.background = '#fff';
                if (typeof(admSliderMedium) != 'undefined') {
                    admSliderMedium();
                }
                var checkAvaiBanHtml5 = function checkAvaiBanHtml5() {
                    return true;
                };
                var idw = document.getElementById('ads_zone49');
                if (idw) {
                    idw.innerHTML = '<iframe src="javacript:void(0);" frameborder="0" scrolling="no" width="980" height="250" id="bannertrack"></iframe>';
                    window.setTimeout(function () {

                    }, 1000);
                }

            });


        }
        if (burn === 1 && content.indexOf('bannertrack') != -1) {
            burn = 2;

            page.evaluate(function (scriptLink) {
                var idf = document.getElementById('bannertrack');
                var io = idf.contentWindow;
                io.document.write(scriptLink);
                io.close();


            }, scriptLink);
            window.setTimeout(function () {
                page.render(output);
                phantom.exit();
            }, 30000);
        }
        if (burn != 2) {
            timeout1 = setTimeout(function () {
                fncall(scriptLink);
            }, 1000);
        }


    };
    page.open(page.address, function (status) {
        var fs = require('fs');
        var content = fs.read('demo.txt');
        fncall(content);
        return false;
        if (status !== 'success') {
            console.log(page.reason);
            console.log('FAIL to load the address' + status);
        } else {
            page.endTime = new Date();
            page.title = page.evaluate(function () {
                return document.title;
            });
            content = page.content;
            console.log(content);
            phantom.exit();
        }
    });
}
