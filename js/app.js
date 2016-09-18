
// TODO: list of barebones items:
// - restaurant yelp ID 'yelp-san-francisco' for example.
// - my description info.
// The rest of the below info should be populated by a yelp API request.

// Yelp API info:
// consumer key: eiWqm3-rfTcK5W9mbfOghw
// consumer secret: qrsHhqWUtivxnYcQ3Zc1cQsr-fU
// token ocYvvfQnstGlM7ycDnWYjF7qdC93yvnH
// token secret -_BVyEpbH1AULHfp_SZOZRahsp4

// Foursquare API info:
// client ID: 5IEZ35JU3I1RNEMKSQXLVQ1RWMTHZHSGNQO4U0E4SPBAQC1V
// client secret: DHD0LK5VUJWKD4SUYSL4BUKX0XQ32WU03LMXVNHH04SIBRU4


var foursquareUrl = 'https://api.foursquare.com/v2/venues/';
var foursquareParams = $.param({
    'client_id': '5IEZ35JU3I1RNEMKSQXLVQ1RWMTHZHSGNQO4U0E4SPBAQC1V',
    'client_secret': 'DHD0LK5VUJWKD4SUYSL4BUKX0XQ32WU03LMXVNHH04SIBRU4',
    'v': '20130815'
});

var restObjArray = [
    {
        'name': 'Darwin Cafe',
        'id': '4c4e30871b8e1b8dd9d3c426',
        'notes': 'One of our favorite spots, by proxy of being located about 10 feet from our building.  The charcuterie, salads, and sandwiches are delicious and satisfying.'
    }
];

var Restaurant = function( restObj, venue_data ) {
    self = this;
    self.id = restObj.id;
    self.name = restObj.name;
    self.description = restObj.notes;
    self.coordinates = {};
    self.img_url = '';
    self.url = '';
    self.rest_url = '';

    var img_size = '100x100';
    var contentString = $( '#info-template' ).html();

    self.coordinates.lat = parseFloat(venue_data.location.lat);
    self.coordinates.lng = parseFloat(venue_data.location.lng);

    console.log(self.coordinates);

    self.img_url = venue_data.bestPhoto.prefix + img_size + venue_data.bestPhoto.suffix;

    self.url = venue_data.canonicalUrl;

    self.rest_url = venue_data.url;

    contentString = contentString.replace( '{{title}}', self.name )
                                 .replace( '{{img_url}}', self.img_url )
                                 .replace( '{{rest_url}}', self.rest_url)
                                 .replace( '{{url}}', self.url )
                                 .replace( '{{content}}', self.description );

    self.marker = new google.maps.Marker({
        map: map,
        position: self.coordinates,
        title: self.name,
        animation: google.maps.Animation.DROP
    });

    self.infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

    self.marker.addListener( 'click', function(){
        self.marker.setAnimation(4);
        self.infoWindow.open(map, self.marker);
    });

    map.addListener( 'click', function(){
        self.infoWindow.close();
    });

};

var ViewModel = function() {
    var self = this;
    self.restList = ko.observableArray( [] );

    restObjArray.forEach(function ( restObj ){
        console.log(restObj);
         var api_url = foursquareUrl + restObj.id + '?' + foursquareParams;

        $.ajax({
            url: api_url,
            data: {format: 'json'},
            dataType: 'json'
        }).done(function(data){

            var venue_data = data.response.venue;
            console.log(venue_data);
            self.restList.push( new Restaurant( restObj, venue_data ) );

        }).fail(function(){
            console.log( 'Foursquare API failed for ' + restObj.name );
        });
    });

    self.restList().forEach(function( rest ) {
        rest.marker.setMap(map);

    });

};

var viewM = new ViewModel();
ko.applyBindings( viewM );

