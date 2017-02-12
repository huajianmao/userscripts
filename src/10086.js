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

  var refreshIntervalId;
  var numbers = new Set();
  var totalPageNum = parseInt(document.querySelector('.totalPageNum').innerText);

  function getNumbersInPage() {
    var mainNum = document.querySelector('#mainNum');
    var currPageNum = parseInt(document.querySelector('.currPageNum').innerText);
    console.log("Going to get numbers in " + currPageNum);

    var trs = mainNum.querySelectorAll('tr');
    for (var tr of trs) {
      var id = tr.getAttribute('id');
      if (id !==null && id !== undefined) {
        var fields = id.split('|');
        if (fields.length === 6 && fields[1].length === 11) {
          numbers.add(fields[1]);
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

    console.log("Have fetched " + numbers.size + " numbers!");
  }

  refreshIntervalId = setInterval(getNumbersInPage, 10000);
})();
