// ==UserScript==
// @name         LianjiaSaver
// @namespace    http://hjmao.me/
// @version      0.1
// @description  To save lianjia brief info in local storage!
// @author       Huajian Mao
// @include      http://hz.lianjia.com/ershoufang/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var houses = localStorage.getItem('houses');
    if (houses === null || houses === undefined) {
        houses = {};
    } else {
        houses = JSON.parse(houses);
    }

    var houseLis = document.querySelectorAll('li.clear');
    for (var house of houseLis) {
        var houseObj = {};
        houseObj.id = "";
        houseObj.xiaoqu = {};
        houseObj.district = {};
        houseObj.price = {};
        houseObj.tags = [];

        var image = house.getElementsByTagName('img')[0];
        houseObj.avatar = image.getAttribute('src');

        var title = house.getElementsByClassName('title')[0].getElementsByTagName('a')[0];
        houseObj.title = title.text;
        houseObj.url = title.getAttribute('href');
        if (houseObj.url !== undefined && houseObj.url !== null) {
            var lastSlashIndex = houseObj.url.lastIndexOf("/");
            if (lastSlashIndex >= 0) {
                var subString = houseObj.url.substring(lastSlashIndex + 1);
                var endIndex = subString.indexOf(".html");
                houseObj.id = subString.substring(0, endIndex);
            }
        }

        var houseInfo = house.getElementsByClassName('address')[0].getElementsByClassName('houseInfo')[0];
        var xiaoqu = houseInfo.getElementsByTagName('a')[0];
        houseObj.xiaoqu.name = xiaoqu.text;
        houseObj.xiaoqu.url = xiaoqu.getAttribute('href');
        houseObj.info = houseInfo.innerText;

        var positionInfo = house.getElementsByClassName('flood')[0].getElementsByClassName('positionInfo')[0];
        var district = positionInfo.getElementsByTagName('a')[0];
        houseObj.district.name = district.text;
        houseObj.district.url = district.getAttribute('href');
        houseObj.position = positionInfo.innerText;

        houseObj.followInfo = house.getElementsByClassName('followInfo')[0].innerText;

        var tagSpans = house.getElementsByClassName('tag')[0].getElementsByTagName('span');
        for (var tagSpan of tagSpans) {
            houseObj.tags.push(tagSpan.innerText);
        }

        var priceInfo = house.getElementsByClassName('priceInfo')[0];
        houseObj.price.total = priceInfo.getElementsByClassName('totalPrice')[0].innerText;
        houseObj.price.unit = priceInfo.getElementsByClassName('unitPrice')[0].getAttribute('data-price');

        houses[houseObj.id] = houseObj;
    }

    localStorage.setItem('houses', JSON.stringify(houses));
})();
