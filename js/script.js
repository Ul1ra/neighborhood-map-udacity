var map = {};
var marker = {};
var infoWindow = {}

function initMap() {
    var myLatLng = {lat: 37.769115, lng: -122.435745};

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: myLatLng
    });

    infoWindow = new google.maps.InfoWindow();

    // viewM.kickoff();

}

function addMarker( restObj ) {
    console.log('ran');
    marker = new google.maps.Marker({
        position: restObj.coordinates,
        animation: google.maps.Animation.DROP,
        map: map,
        // label: 'What up?',
        title: 'Hello World!'
    });

    // marker.addListener('click', toggleBounce);
    marker.addListener( 'click', function(){
        marker.setAnimation(4);
        restObj.infoWindow.open(map, marker);
    });

    map.addListener( 'click', function(){
        restObj.infoWindow.close();
    });
}
