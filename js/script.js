var map = {};
var marker = {};

function initMap() {
    var myLatLng = {lat: 37.769115, lng: -122.435745};

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: myLatLng
    });

    viewM.kickoff();
    // __init__();

}


function addMarker(restObj, map) {
    // var contentString = '<div id="content">'+
    //     '<div id="siteNotice">'+
    //     '</div>'+
    //     '<h1 id="firstHeading" class="firstHeading">San Francisco</h1>'+
    //     '<div id="bodyContent">'+
    //     '<p><b>San Francisco</b> is actually pretty awesome.<br><br>' +
    //     'In case you weren\'t aware.' +
    //     '</div>'+
    //     '</div>';

    marker = new google.maps.Marker({
        position: restObj.coordinates,
        animation: google.maps.Animation.DROP,
        map: map,
        // label: 'What up?',
        title: 'Hello World!'
    });

    // marker.addListener('click', toggleBounce);
    marker.addListener('click', function(){
        marker.setAnimation(4);
        restObj.infoWindow.open(map, marker);
    });

    map.addListener('click', function(){
        restObj.infoWindow.close();
    });
}

// function addMarker(coordinates, map){
//     var contentString = '<div id="content">'+
//         '<div id="siteNotice">'+
//         '</div>'+
//         '<h1 id="firstHeading" class="firstHeading">San Francisco</h1>'+
//         '<div id="bodyContent">'+
//         '<p><b>San Francisco</b> is actually pretty awesome.<br><br>' +
//         'In case you weren\'t aware.' +
//         '</div>'+
//         '</div>';

//     marker = new google.maps.Marker({
//         position: coordinates,
//         animation: google.maps.Animation.DROP,
//         map: map,
//         // label: 'What up?',
//         title: 'Hello World!'
//     });

//     var infoWindow = new google.maps.InfoWindow({
//         content: contentString
//     });

//     // marker.addListener('click', toggleBounce);
//     marker.addListener('click', function(){
//         marker.setAnimation(4);
//         infoWindow.open(map, marker);
//     });

//     map.addListener('click', function(){
//         infoWindow.close();
//     });
// }

// addMarker({lat: 37.769115, lng: -122.435745}, map);

// function toggleBounce() {
//     if (marker.getAnimation() !== null) {
//         marker.setAnimation(null);
//     } else {
//         marker.setAnimation(google.maps.Animation.BOUNCE);
//     }
// }
