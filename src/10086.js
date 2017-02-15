// ==UserScript==
// @name         PhoneNumberFetcher
// @namespace    http://hjmao.me/
// @version      0.1
// @description  To save 10086 phone numbers in local storage!
// @author       Huajian Mao
// @include      http://service.bj.10086.cn/phone/jxhsimcard/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getNumbersFromLocalStorage() {
        var numbers = localStorage.getItem('numbers');

        if (numbers === null || numbers === undefined) {
            numbers = [];
        } else {
            numbers = JSON.parse(numbers);
        }

        return numbers;
    }

    var refreshIntervalId;

    function getNumbersInPage() {
        var numbers = getNumbersFromLocalStorage();

        var mainNum = document.querySelector('#mainNum');

        var totalPageNum = parseInt(document.querySelector('.totalPageNum').innerText);
        var currPageNum = parseInt(document.querySelector('.currPageNum').innerText);
        console.log("Going to get numbers in " + currPageNum);

        var trs = mainNum.querySelectorAll('tr');
        for (var tr of trs) {
            var id = tr.getAttribute('id');
            if (id !==null && id !== undefined) {
                var fields = id.split('|');
                if (fields.length === 6 && fields[1].length === 11) {
                    numbers.push(fields[1]);
                }
            }
        }

        var gotoPageNum = currPageNum + 1;
        if (gotoPageNum > totalPageNum) {
            if (refreshIntervalId !== null && refreshIntervalId !== undefined) {
                clearInterval(refreshIntervalId);
            }
        } else {
            document.querySelector('#kkpager_btn_go_input').setAttribute('value', currPageNum + 1);
            document.querySelector('#kkpager_btn_go').onclick();
        }

        localStorage.setItem('numbers', JSON.stringify(numbers));
        console.log("Have fetched " + numbers.length + " numbers!");
    }

    refreshIntervalId = setInterval(getNumbersInPage, 5000);
})();
