// ==UserScript==
// @name         TmallSalesSaver
// @namespace    http://hjmao.cn/
// @version      0.1
// @description  save the browsered tmall sale list page!
// @author       Huajian Mao
// @match        https://shengmengtu.tmall.com/search.htm?spm=a1z10.1-b.w5001-13303190287.9.TR32f1&scene=taobao_shop
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getSalesFromLocalStorage() {
        var sales = localStorage.getItem('sales');

        if (sales === null || sales === undefined) {
            sales = {};
        } else {
            sales = JSON.parse(sales);
        }

        return sales;
    }

    function unixtime2formated(unixtime) {
        var date = new Date(parseFloat(unixtime)*1000);

        var year = date.getFullYear();
        var month = "0" + date.getMonth();
        var day = "0" + date.getDate();
        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var dateStr = year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        return dateStr;
    }

    function updateSalesOnTmall() {
        var sales = getSalesFromLocalStorage();

        var items = document.getElementsByClassName('item');
        var now = new Date().getTime() / 1000;
        var thisTotal = 0;
        var totalMoney = 0;
        for (var i=0; i<items.length; i++) {
            var item = items.item(i);
            var id = item.getAttribute('data-id');

            var thisSale = sales[id];
            if (thisSale === null || thisSale === undefined || thisSale === "{}") {
                thisSale = {};
                thisSale.id = id;
                thisSale.title = title;
                thisSale.link = link;
            }
            var oldNum = thisSale.num;
            if (oldNum === null || oldNum === undefined) {
                oldNum = [];
            }
            if (oldNum.length > 0 && oldNum[oldNum.length-1].date === now) {
                continue;
            }

            var detail = item.getElementsByClassName('detail')[0];
            var price = detail.getElementsByClassName('c-price')[0].innerText;
            var itemLinkA = detail.getElementsByClassName('item-name')[0];
            var title = itemLinkA.text;
            var link = "https:" + itemLinkA.getAttribute('href');
            var saleNum = detail.getElementsByClassName('sale-num')[0].textContent;
            if (parseInt(saleNum) <= 0) {
                continue;
            } else {
                thisTotal += parseInt(saleNum);
                totalMoney += parseFloat(price) * parseInt(saleNum);
            }

            oldNum.push({'date': now, 'num': saleNum, 'price': price});
            thisSale.num = oldNum;

            sales[id] = thisSale;
        }
        if (sales.total === null || sales.total === undefined) {
            sales.total = [];
        }
        sales.total.push({date: now, num: thisTotal, money: totalMoney});

        localStorage.setItem('sales', JSON.stringify(sales));
    }

    document.onreadystatechange = function(event) {
        updateSalesOnTmall();
    };
})();
