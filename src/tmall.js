// ==UserScript==
// @name         TmallSalesSaver
// @namespace    http://hjmao.cn/
// @version      0.1
// @description  save the browsered tmall sale list page!
// @author       Huajian Mao
// @match        https://shengmengtu.tmall.com/search.htm?spm=*&scene=taobao_shop
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
    function getSaleNumsOfId(id) {
        var sales = localStorage.getItem('sales');

        if (sales === null || sales === undefined) {
            sales = {};
        } else {
            sales = JSON.parse(sales);
        }

        var thisSale = sales[id];
        if (thisSale === null || thisSale === undefined) {
            console.log("Item not found!");
        } else {
            var saleNums = thisSale.num;
            if (saleNums === null || saleNums === undefined) {
                console.log("Item has no sale number history!");
            } else {
                console.log(thisSale.title);
                var i = saleNums.length;
                for (var saleNum of saleNums) {
                    if (i > 5) {
                        i--;
                        continue;
                    }
                    var dateStr = unixtime2formated(saleNum.date);
                    console.log("[" + dateStr + "] " + saleNum.num);
                }
                console.log("========================");
            }
        }
    }

    function getTotalSaleNums() {
        var sales = getSalesFromLocalStorage();
        var total = sales.total;
        if (total === null || total === undefined || total.length === 0) {
            console.log("No total data.");
        } else {
            var totalObj;
            var dateStr;
            if (total.length >= 2) {
                totalObj = total[total.length - 2];
                dateStr = unixtime2formated(totalObj.date);
                console.log("[" + dateStr + "] " + totalObj.num + " (约" + totalObj.money + "元)");
            }
            if (total.length >= 1) {
                totalObj = total[total.length - 1];
                dateStr = unixtime2formated(totalObj.date);
                console.log("[" + dateStr + "] " + totalObj.num + " (约" + totalObj.money + "元)");
            }
        }
    }


    function getUpdatedSaleNums() {
        var updatedSaleIds = new Set();
        var sales = getSalesFromLocalStorage();
        for (var id of Object.keys(sales)) {
            var thisSale = sales[id];
            var saleNums = thisSale.num;
            if (saleNums === null || saleNums === undefined || saleNums.length === 0) {
                continue;
            } else if (saleNums.length === 1) {
                updatedSaleIds.add(id);
                continue;
            } else if (saleNums.length >= 2) {
                var saleLength = saleNums.length;
                if (saleNums[saleLength - 1].num !== saleNums[saleLength - 2].num) {
                    updatedSaleIds.add(id);
                    continue;
                }
            }
        }

        for (var thisId of updatedSaleIds) {
            getSaleNumsOfId(thisId);
        }
    }

    document.onreadystatechange = function(event) {
        updateSalesOnTmall();


        getUpdatedSaleNums();

        for (var id of ["542909419938", "527186950590", "527396610383", "539987603681"]) {
            getSaleNumsOfId(id);
        }

        getTotalSaleNums();
    };
})();
