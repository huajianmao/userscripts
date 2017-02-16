
    function getXiaoqusFromLocalStorage() {
        var xiaoqus = localStorage.getItem('xiaoqus');

        if (xiaoqus === null || xiaoqus === undefined) {
            xiaoqus = {};
        } else {
            xiaoqus = JSON.parse(xiaoqus);
        }

        return xiaoqus;
    }

    function saveXiaoqusToLocalStorage() {
        var xiaoqus = getXiaoqusFromLocalStorage();

        var labels = document.querySelectorAll('label');
        for (var label of labels) {
            var p = label.querySelector('p.bubble');
            var id = p.getAttribute('data-id');
            var xiaoqu = xiaoqus[id];
            if (xiaoqu === null || xiaoqu === undefined) {
                xiaoqu = {};
                xiaoqu.id = id;
                xiaoqu.schoolid = p.getAttribute('data-schoolid');
                xiaoqu.longitude = p.getAttribute('data-longitude');
                xiaoqu.latitude = p.getAttribute('data-latitude');
                xiaoqu.name = p.querySelector('i.num').innerText;
                var urlA = p.querySelector('i.name-des').querySelector('a');
                xiaoqu.url = urlA.getAttribute('href');
                xiaoqu.info = urlA.text;
                xiaoqus[id] = xiaoqu;
            }
        }

        localStorage.setItem('xiaoqus', JSON.stringify(xiaoqus));
    }
    saveXiaoqusToLocalStorage();
    console.log(Object.keys(getXiaoqusFromLocalStorage()).length);
