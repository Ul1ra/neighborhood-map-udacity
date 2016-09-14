var marker = {}

function initMap() {
    var myLatLng = {lat: 37.769115, lng: -122.435745};

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: myLatLng
    });

    marker = new google.maps.Marker({
        position: myLatLng,
        animation: google.maps.Animation.DROP,
        map: map,
        // label: 'What up?',
        title: 'Hello World!'
    });

    // marker.addListener('click', toggleBounce);
    marker.addListener('click', function(){
        marker.setAnimation(4);
    });

}

function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}
