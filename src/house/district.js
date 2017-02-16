
    function getDistrictsFromLocalStorage() {
        var districts = localStorage.getItem('districts');

        if (districts === null || districts === undefined) {
            districts = {};
        } else {
            districts = JSON.parse(districts);
        }

        return districts;
    }

    function saveDistrictsToLocalStorage() {
        var districts = getDistrictsFromLocalStorage();

        var labels = document.querySelectorAll('label.BMapLabel');
        for (var label of labels) {
            var div = label.querySelector('div.bubble');
            var id = div.getAttribute('data-id');
            var district = districts[id];
            if (district === null || district === undefined) {
                district = {};
                district.id = id;
                district.border = div.getAttribute('data-position_border');
                district.longitude = div.getAttribute('data-longitude');
                district.latitude = div.getAttribute('data-latitude');
                district.name = div.querySelector('p.name').innerText;
                district.price = div.querySelector('p.num').innerText;
                district.count = div.querySelector('span.count').innerText;
                districts[id] = district;
            }
        }

        localStorage.setItem('districts', JSON.stringify(districts));
    }
    saveDistrictsToLocalStorage();
    console.log(Object.keys(getDistrictsFromLocalStorage()).length);

