// ==UserScript==
// @name         goat
// @namespace    https://*.testportal.pl/
// @version      4.2.0
// @description  milego
// @author       Michal Pszon
// @updateURL    https://raw.githubusercontent.com/halupa123/testportalek/refs/heads/main/script.js?token=GHSAT0AAAAAADBXOSCGWCX76FTII5HYD5GY2BPHI3A
// @downloadURL  https://raw.githubusercontent.com/halupa123/testportalek/refs/heads/main/script.js?token=GHSAT0AAAAAADBXOSCGWCX76FTII5HYD5GY2BPHI3A
// @match        https://*.testportal.net/*
// @match        https://*.testportal.pl/*
// @grant        none
// ==/UserScript==

//(function() {
//    'use strict';
    const original = RegExp.prototype.test;
    RegExp.prototype.test = function (s) {
        const string = this.toString();
        if (string.includes("native code") && string.includes("function")) {
            return true;
        }
        const r = original.call(this, s);
        return r;
    };

    logToServer = function(x) { console.log(x) }
    function initPage() {
        if (!window.location.href.includes("LoadTestStart.html")) {
            return
        }
        document.getElementsByClassName('test-card-body')[0].innerHTML = "Jest kurwa do zajebania xdd"
    }
    function timeLimit() {
        window.startTime = Infinity;

        document.hasFocus = () => {
            return true;
        };
    }
    setTimeout(initPage, 100)
    if (window.location.href.includes("LoadTestStart.html")) {
        return
    }
    setTimeout(timeLimit, 0)
//})();
