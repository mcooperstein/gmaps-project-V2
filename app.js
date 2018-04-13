// API Key: AIzaSyBxzjNVPV6tghQ75IZ-PBrEpm4dr1AgObQ
// example API endpoint: https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Vancouver+BC|Seattle&destinations=San+Francisco|Victoria+BC&mode=bicycling&language=eng-ENG&key=AIzaSyBxzjNVPV6tghQ75IZ-PBrEpm4dr1AgObQ

/*
var string = "Marc Cooperstein";
string.slice(1, -1)
"arc Cooperstei"
*/

var streetViewService;
var panorama;
var maps2;
var map;
var markers = [];
var numMarkers = 0;
let latCoords2 = "";
let lonCoords2 = "";
let latAnswer = "";
let lonAnswer = "";

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
});

function initMap2() {
    var usa = {
        lat: 39.5,
        lng: -98.45
    };
    map2 = new google.maps.Map(document.getElementById('right'), {
        zoom: 3,
        scrollwheel: false,
        center: usa
    });
    // This event listener will call addMarker() when the map is clicked.
    map2.addListener('click', function (event) {
        if (numMarkers < 1) {
            addMarker(event.latLng);
        }
    });
    //addMarker(usa);
    var geocoder = new google.maps.Geocoder();
    document.getElementById('checkGuess').addEventListener('click', function () {
        geocodeAddress(geocoder, map2);
    });
}

function initMap() {
    $("#start").hide();
    $("#search").show();
    $("#submit, #remove, #checkGuess, #tryAgain").show();
    $("#homepage").hide();
    $("#guessLocation").hide();
    var myLatLng = {
        lat: 98.35,
        lng: 39.5
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
        //$("#answer").text(data.location.description).hide();
        $("#answer").text(data.location.description);
        //window.answer = data.location.description; - tried passing variable to global window object
        //$("#answer").text("The answer was: " + data.location.description);
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
});*/

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('answer').innerHTML;
    //var address = window.address;
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status === 'OK') {
            //resultsMap.setCenter(results[0].geometry.location);
            var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
                icon: image
            });
            var answerCoord = marker.position


            $("#answerCoordinates").text(answerCoord)
            var answerCoord2 = document.getElementById("answerCoordinates").innerHTML
            $("#answerCoordinates").text(answerCoord2.slice(1, -1));
            console.log(answerCoord2);

            let answerCoordsArr = answerCoord2.split(" ");

            for (let i = 1; i < answerCoordsArr[0].length - 1; i++) {
                latAnswer += answerCoordsArr[0][i];
            }
            for (let i = 0; i < answerCoordsArr[1].length - 1; i++) {
                lonAnswer += answerCoordsArr[1][i];
            }
            latAnswer = Number(latAnswer)
            lonAnswer = Number(lonAnswer)
            console.log(latAnswer, lonAnswer);




            apiCall3();
            //answerCoordinates.toString().slice(1, -1);
            //console.log(answerCoordinates);
            //$("#answerCoordinates").text(answerCoordinates);
            //console.log(parseFloat($("#answerCoordinates").text(answerCoordinates)));
            //console.log(results[0].geometry.location)
            //$("#answer, #reveal").css("color", "red");
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

//Function to reverse geocode a place
/*function geocodeLatLng(geocoder, map, infowindow) {
    var input = data.location.latLng;
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
    numMarkers = 0;
    $("#answer, #reveal").css("color", "beige");
})

/*var check = document.getElementById("checkGuess");

check.addEventListener("click", function () {
    $("#answer").css("color", "red");

    //addMarker(data.location);
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    var beachMarker = new google.maps.Marker({
        position: {
            lat: 39,
            lng: -98
        },
        //position: data.location,
        map: map2,
        icon: image
    });
})*/

var remove = document.getElementById("remove");

remove.addEventListener("click", function () {
    deleteMarkers();
    numMarkers = 0;
})

// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map2
    });
    markers.push(marker);
    console.log(marker.position);
    var coords = marker.position
        /* var coords2 = coords.substring(1, -1);
         console.log(coords2)*/
    $("#guessCoordinates").text(marker.position);
    var coords2 = document.getElementById("guessCoordinates").innerHTML
        //console.log(typeof coords2, coords2.split(" "))
    let coords2Arr = coords2.split(" ");

    for (let i = 1; i < coords2Arr[0].length - 1; i++) {
        latCoords2 += coords2Arr[0][i];
    }
    for (let i = 0; i < coords2Arr[1].length - 1; i++) {
        lonCoords2 += coords2Arr[1][i];
    }
    latCoords2 = Number(latCoords2)
    lonCoords2 = Number(lonCoords2)
    console.log(latCoords2, lonCoords2);
    //console.log(coords2.slice(1, -1))
    $("#guessCoordinates").text(coords2.slice(1, -1));
    numMarkers++;
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function myFunction() {
    if (this.readyState == 4 && this.status == 200) {
        var json = JSON.parse(this.responseText);
        console.log(json)
        $("#distance").text("Distance: " + json.rows.elements[0].distance.text);
    }
}

function apiCall3() {
    var guessCoords = document.getElementById("guessCoordinates").innerHTML
    var answerCoords = document.getElementById("answerCoordinates").innerHTML;
    var myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = myFunction;
    myRequest.open("GET", "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + guessCoords + "&destinations=" + answerCoords + "&key=AIzaSyDagLHdqiHjZzqf2kJUI7MwRR0TTC7qzZk");
    myRequest.send();
    console.log(myRequest);
    getDistanceFromLatLonInKm(latCoords2, lonCoords2, latAnswer, lonAnswer);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    d *= 0.621372 // convert km to miles
        //return d;
    $("#distance").text("Your guess was " + parseInt(d) + " miles away from actual location");
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
