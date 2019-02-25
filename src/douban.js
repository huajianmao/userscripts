// ==UserScript==
// @name         Douban Book
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://book.douban.com/tag/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let loadDataFromLS = () => {
        var books = localStorage.getItem('books');

        if (books === null || books === undefined) {
            books = {};
        } else {
            books = JSON.parse(books);
        }

        return books
    }

    let filter = (books, value, count) => {
        return Object.values(books).filter(book => book.star.count >= count && book.star.value >= value)
    }

    let getIntroByBook = async (book) => {
        let BASE_URI = "https://book.douban.com/subject"
        const request = BASE_URI + "/" + book.id

        var el = document.createElement( 'html' )
        const response = await fetch(request)
        el.innerHTML = await response.text()
        el.getElementsByClassName('related_info')[0].getElementsByClassName('indent')[0]
        // FIXME: Bug here
        const intro = [...el.getElementsByClassName('related_info')[0].getElementsByClassName('indent')[0].getElementsByClassName('intro')].slice(-1).pop()
        const content = intro.innerHTML.replace(/\<\/p\>((?!\<p\>).)*\<p\>/g, '\n').replace(/\<\/p\>\s*/g, '').replace(/\s*\<p\>/g, '')
        if (content) {
            book.intro = content
        }
        return content
    }

    // filter(books, 8, 1500).map(book => getIntroByBook(book).then(result => console.log(result)))

    let format = (books) => {
        var mapped = Object.values(books)
            .map(book => {
                return [
                    "## " + "[" + book.title + "](" + "https://book.douban.com/subject/" + book.id + ")",
                    "【评分：" + book.star.value + " / 评论数：" + book.star.count + "】" + "【" + book.publisher + "】",
                    book.intro.split('\n').map(line => ">  " + line).join('\n')
                ].join("\n\n")
            })
        return mapped
    }
    
    let addBookToBooks = (book, books) => {
        if (!books[book.id]) {
            books[book.id] = book
        }
        return books
    }

    let saveDataToLS = (books) => {
        localStorage.setItem('books', JSON.stringify(books));
    }

    // Your code here...
    let getBookItems = () => {
        var bookItems = [...document.getElementsByClassName('subject-item')].map(item => [...item.childNodes[3].children])

        bookItems = bookItems.map(item => {
            return {
                id: item[0].children[0].href.replace(/^\D+/g, '').replace(/\D+$/g, ''),
                // uri: item[0].children[0].href,
                title: item[0].innerText,
                publisher: item[1].innerText,
                star: {
                    value: parseFloat(item[2].children[1] && item[2].children[1].innerText),
                    count: parseInt(item[2].children[2] && item[2].children[2].innerText.replace(/^\D+/g, '').replace(/\D+$/g, '')),
                },
                intro: item[3].innerText
            }
        })
        return bookItems
    }

    let gotoNextPage = () => {
        window.scrollTo({left: 0, top: document.body.scrollHeight, behavior: 'smooth'})
        setTimeout(() => {
            var nextLink = document.getElementsByClassName('next')[0].children[1]
            nextLink.click()
        }, 2000)
    }

    var books = loadDataFromLS()
    console.log(books)
    var bookItems = getBookItems()
    console.log(bookItems)
    for (var i = 0; i< bookItems.length; i++) {
        var book = bookItems[i]
        addBookToBooks(book, books)
    }
    console.log(books)
    saveDataToLS(books)
    setTimeout(() => {
        gotoNextPage()
    }, 2000)
})();
