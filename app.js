var streetViewService;
var panorama;
var maps2;
var map;

$(function () {
    $("#guessLocation").hide();
    $("#loading").hide();
    $("#output").show();
    $("#search").hide();
    $("#submit, #remove, #checkGuess, #tryAgain").hide();
    $("#start").show();
});

$("#start").click(function () {
    initMap();
    $("#start").hide();
    $("#search").show();
    $("#submit, #remove, #checkGuess, #tryAgain").show();
    $("#homepage").hide();
});

function initMap2() {
    var uluru = {
        lat: 39.5,
        lng: -98.45
    };
    map2 = new google.maps.Map(document.getElementById('right'), {
        zoom: 3,
        scrollwheel: false,
        center: uluru
    });
}

function initMap() {
    var myLatLng = {
        lat: 98.35,
        lng: 39.5,

    };

    map = new google.maps.Map(document.getElementById('left'), {
        center: myLatLng,
        scrollwheel: false,
        zoom: 4,
        mapTypeControl: true

    });

    var location = randomLocation();

    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('left'), {

            position: location,
            //addressControl false removes address box
            addressControl: false,
            pov: {
                heading: 34,
                pitch: 10
            }
        });

    map.setStreetView(panorama);

    streetViewService = new google.maps.StreetViewService();
    streetViewService.getPanorama({
        location: location,
        radius: 50
    }, processSVData);
}

function randomLocation() {
    var long = Math.random() * -58 - 66;
    var lati = Math.random() * 25 + 24;
    var random = {
        lat: lati,
        lng: long

    };
    return random;
}

function processSVData(data, status) {

    if (status === 'OK') {
        $("#guessLocation").show();
        $("#loading").hide();
        panorama.setPano(data.location.pano);
        panorama.setPov({
            heading: 270,
            pitch: 0
        });
        panorama.setVisible(true);
        $("#answer").text(data.location.description).hide();
        console.log(data.location);
        initMap2();
    } else {
        console.error('Street View data not found for this location.');
        $("#loading").show();
        initMap();
    }

}
var dots = 0;

function loadText() {
    dots++;
    if (dots == 1) {
        $("h3").text("Loading.");
    } else if (dots == 2) {
        $("h3").text("Loading..");
    } else {
        $("h3").text("Loading...");
        dots = 0;
    }
}
setInterval(function () {
    loadText();

}, 1000)

//Geocode Address search bar disabled
/*$("#submit").click(function () {
    var geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map2);
});

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('search').value;
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}*/

//Function to reverse geocode a place
/*function geocodeLatLng(geocoder, map, infowindow) {
    var input = randomLocation();
    var latlngStr = input.split(',', 2);
    var latlng = {
        lat: parseFloat(latlngStr[0]),
        lng: parseFloat(latlngStr[1])
    };
    geocoder.geocode({
        'location': latlng
    }, function (results, status) {
        if (status === 'OK') {
            if (results[1]) {
                map.setZoom(11);
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map
                });
                infowindow.setContent(results[1].formatted_address);
                infowindow.open(map, marker);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}*/

var refresh = document.getElementById("tryAgain");

refresh.addEventListener("click", function () {
    initMap();
})

var check = document.getElementById("checkGuess");

check.addEventListener("click", function () {
    $("#answer").show();
})
