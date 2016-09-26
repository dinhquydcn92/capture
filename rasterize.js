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
    output=system.args[2];
    page.resources = [];

    page.onLoadStarted = function () {
        page.startTime = new Date();
    };

    page.customHeaders = {
        "X-Test": "foo",
        "DNT": "1",
        "Upgrade-Insecure-Requests": 1,
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36"
    };


    page.viewportSize = {
        width: 1399,
        height: 768
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
        page.evaluate(function () {
            document.body.style.background = '#fff';
            if (typeof(ADS_CHECKER) == 'undefined') {
                var timeloadchk = 10000;
            } else {
                var timeloadchk = 1000;
            }
            window.setTimeout(function () {

                if (typeof(admSliderMedium) != 'undefined') {
                    admSliderMedium();
                }
               var checkAvaiBanHtml5 = function checkAvaiBanHtml5() {
                    return true;
                }
                checkAvaiBanHtml5();
            }, timeloadchk);
        });


    };
    page.onResourceError = function (resourceError) {
        page.reason = resourceError.errorString;
        page.reason_url = resourceError.url;
    };
    page.settings.webSecurityEnabled = false;


    phantom.addCookie({
        'name': '__R', /* required property */
        'value': '1', /* required property */
        'domain': '.dantri.com.vn',
        'path': '/', /* required property */
        'httponly': true,
        'secure': false,
        'expires': (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
    });
    phantom.addCookie({
        'name': '__RC', /* required property */
        'value': '4', /* required property */
        'domain': '.dantri.com.vn',
        'path': '/', /* required property */
        'httponly': true,
        'secure': false,
        'expires': (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
    });
    //phantom.addCookie({
    //    'name': 'changebeta', /* required property */
    //    'value': '1', /* required property */
    //    'domain': '.dantri.com.vn',
    //    'path': '/', /* required property */
    //    'httponly': true,
    //    'secure': false,
    //    'expires': (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
    //});
    phantom.addCookie({
        'name': '__R', /* required property */
        'value': '3', /* required property */
        'domain': '.kenh14.vn',
        'path': '/', /* required property */
        'httponly': true,
        'secure': false,
        'expires': (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
    });
    phantom.addCookie({
        'name': '__RC', /* required property */
        'value': '5', /* required property */
        'domain': '.kenh14.vn',
        'path': '/', /* required property */
        'httponly': true,
        'secure': false,
        'expires': (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
    });
    page.clearCookies();
    page.clearMemoryCache();
    page.open(page.address, function (status) {
        window.setTimeout(function () {
            page.render(output);
            phantom.exit();
        }, 40000);
        return false;
        if (status !== 'success') {
            console.log(page.reason);
            console.log('FAIL to load the address' + status);
            //phantom.exit(1);
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
