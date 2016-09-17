
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

var yelpUrl = 'https://api.yelp.com/v2/business/yelp-san-francisco';
yelpUrl += '?' + $.param({
    'oauth_consumer_key': 'eiWqm3-rfTcK5W9mbfOghw',
    'oauth_token': 'ocYvvfQnstGlM7ycDnWYjF7qdC93yvnH',
});

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


var Restaurant = function(restObj) {
    self = this;
    self.id = restObj.id;
    self.name = restObj.name;
    self.description = restObj.notes;

    self.api_url = foursquareUrl + self.id + '?' + foursquareParams;

    $.ajax({
        url: self.api_url,
        data: {format: 'json'},
        dataType: 'json'
    }).done(function(data){
        console.log(data);
        console.log('Successfully queried Foursquare API for ' + self.name);
    }).fail(function(){
        console.log('Foursquare API failed for ' + self.name);
    });

    self.coordinates = {lat: 37.780679, lng: -122.396086};
    self.img_url = 'https://irs3.4sqi.net/img/general/100x100/11759381_S2jRhZnYEoNioxNNRIftqFVNvm97uKI12JuUKfqFk_Y.jpg';
    self.url = 'https://foursquare.com/v/darwin-cafe/4c4e30871b8e1b8dd9d3c426';
    self.rest_url = 'http://darwincafesf.com';

    var img_size = '100x100';

    var contentString = $( '#info-template' ).html();

    contentString = contentString.replace( '{{title}}', self.name )
                                 .replace( '{{img_url}}', self.img_url )
                                 .replace( '{{rest_url}}', self.rest_url)
                                 .replace( '{{url}}', self.url )
                                 .replace( '{{content}}', self.description );

    self.infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

};

var ViewModel = function() {
    var self = this;

    self.kickoff = function() {
        self.rest = new Restaurant(restObjArray[0]);
        addMarker(self.rest, map);
    };
};

var viewM = new ViewModel();
ko.applyBindings( viewM );

