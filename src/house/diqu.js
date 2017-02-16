
    function getDiqusFromLocalStorage() {
        var diqus = localStorage.getItem('diqus');

        if (diqus === null || diqus === undefined) {
            diqus = {};
        } else {
            diqus = JSON.parse(diqus);
        }

        return diqus;
    }

    function saveDiqusToLocalStorage() {
        var diqus = getDiqusFromLocalStorage();

        var labels = document.querySelectorAll('label.BMapLabel');
        for (var label of labels) {
            var div = label.querySelector('div.bubble');
            var id = div.getAttribute('data-id');
            var diqu = diqus[id];
            if (diqu === null || diqu === undefined) {
                diqu = {};
                diqu.id = id;
                diqu.border = div.getAttribute('data-position_border');
                diqu.longitude = div.getAttribute('data-longitude');
                diqu.latitude = div.getAttribute('data-latitude');
                diqu.name = div.querySelector('p.name').innerText;
                diqu.count = div.querySelector('p.count').innerText;
                diqu.price = div.querySelector('p.num').innerText;
                diqus[id] = diqu;
            }
        }

        localStorage.setItem('diqus', JSON.stringify(diqus));
    }
    saveDiqusToLocalStorage();
    console.log(Object.keys(getDiqusFromLocalStorage()).length);

