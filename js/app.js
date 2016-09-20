var map = {};
var marker = {};
var infoWindow = {}

window.initMap = function() {
    var myLatLng = {lat: 37.769115, lng: -122.435745};

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: myLatLng
    });

}

var foursquareUrl = 'https://api.foursquare.com/v2/venues/';
var foursquareParams = $.param({
    'client_id': '5IEZ35JU3I1RNEMKSQXLVQ1RWMTHZHSGNQO4U0E4SPBAQC1V',
    'client_secret': 'DHD0LK5VUJWKD4SUYSL4BUKX0XQ32WU03LMXVNHH04SIBRU4',
    'v': '20130815'
});

// Lookup if ID isn't listed in url.
// https://api.foursquare.com/v2/venues/search?query=conamsf&intent=global&client_id=5IEZ35JU3I1RNEMKSQXLVQ1RWMTHZHSGNQO4U0E4SPBAQC1V&client_secret=DHD0LK5VUJWKD4SUYSL4BUKX0XQ32WU03LMXVNHH04SIBRU4&v=20130815

// My list of baseline restaurant objects.  "ID" is the key for the Foursquare
// API call.  Name is tracked for my own convenience.
// I also input the neighborhood data.
var restObjArray = [
    {
        'name': 'Darwin Cafe',
        'id': '4c4e30871b8e1b8dd9d3c426',
        'notes': 'One of our favorite spots, by proxy of being located about 10 feet from our building.  The charcuterie, salads, and sandwiches are delicious and satisfying.',
        'neighborhood': 'SOMA'
    },

    {
        'name': 'Yummy Yummy',
        'id': '443fde11f964a5203a321fe3',
        'notes': 'Possibly the best pho in the city. Certainly a contested title, but the prices, portions, flavor, and options are amazing.  And holy crap, do I love pho.  A good run to brunch spot!',
        'neighborhood': 'Inner Sunset'
    },

    {
        'name': 'Brickhouse Cafe',
        'id': '440db456f964a52097301fe3',
        'notes': 'A surprisingly underestimated bar / cafe with delicious burgers, pot pies, and kickass brunch.  Pancake batter covered bacon?  Absolutely.',
        'neighborhood': 'SOMA'
    },

    {
        'name': 'Neighbor Bakehouse',
        'id': '5272781811d2ce55eb5981df',
        'notes': 'Another obscured gem in the Dogpatch district, Neighbor Bakehouse has some of the best pull-apart bread to be found in the bay area.  So far, every pastry we\'ve purchased has been incredibly satisfying.  It\'s always a struggle not to purchase something when we run past.',
        'neighborhood': 'Dogpatch'
    },

    {
        'name': 'Loló',
        'id': '52eb109611d2f169d2d80599',
        'notes': 'We wandered into this place by chance, and fell in love with the ceviche.  Every dish so far has been excellent - tacos, avocado toast, egg scrambles - but the ceviche really stands out.',
        'neighborhood': 'Mission District'
    },

    {
        'name': 'Co Nam',
        'id': '505a8cfde4b08096cab53875',
        'notes': 'Randomly chose this place after a long run, and discovered a fantastic Vietnamese fusion place.  The chicken liver skewers were delicious, and the pho was phenomenal.  Of course, for $14, it damn well better be.',
        'neighborhood': 'Nob Hill'
    },

    {
        'name': 'Smokestack',
        'id': '541e02fd498e5af2958c8b1b',
        'notes': 'We first tried the "meat stick" at a food fair in Dogpatch, and immediately resolved to actually visit the location.  The brisket melts in your mouth.  It is glorious.  All else is secondary.',
        'neighborhood': 'Dogpatch'
    },

    {
        'name': 'Park Chow',
        'id': '3fd66200f964a52026f11ee3',
        'notes': '"Comfort food" sums this up nicely.  Classic brunch fare, done right for the big city.',
        'neighborhood': 'Inner Sunset'
    }
];

var Neighborhood = function ( neighborhood ) {
    self = this;
    self.districtName = neighborhood;
    self.visible = ko.observable( true );
}

var Restaurant = function( restObj, venue_data ) {
    self = this;
    self.id = restObj.id;
    self.name = restObj.name;
    self.description = restObj.notes;
    self.neighborhood = restObj.neighborhood;
    self.is_visible = false;

    self.coordinates = {};
    self.img_url = '';
    self.url = '';
    self.rest_url = '';

    var img_size = '100x100';
    var contentString = $( '#info-template' ).html();

    // Populating restaurant object values with Foursquare API data.
    self.coordinates.lat = parseFloat(venue_data.location.lat);
    self.coordinates.lng = parseFloat(venue_data.location.lng);
    self.img_url = venue_data.bestPhoto.prefix + img_size + venue_data.bestPhoto.suffix;
    self.url = venue_data.canonicalUrl;
    self.rest_url = venue_data.url;

    // Modifying template with rest obj values.
    contentString = contentString.replace( '{{title}}', self.name )
                                 .replace( '{{img_url}}', self.img_url )
                                 .replace( '{{rest_url}}', self.rest_url)
                                 .replace( '{{url}}', self.url )
                                 .replace( '{{content}}', self.description );

    self.marker = new google.maps.Marker({
        position: self.coordinates,
        title: self.name,
    });

    self.infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

};

var ViewModel = function() {
    var self = this;
    var prevWindow = null;
    self.windowOpen = ko.observable( false );
    self.restList = ko.observableArray( [] );
    self.neighborhoodList = ko.observableArray( [] );

    var reducedList = restObjArray.reduce(function ( outList, rest ){
        if (outList.indexOf(rest.neighborhood) === -1) {
            outList.push( rest.neighborhood );
        }
       return outList
    }, []);

    reducedList.forEach(function ( name ) {
        self.neighborhoodList.push( new Neighborhood( name ) );
    });

    self.neighborhoodDict = ko.computed(function(){
        var dictObj = {};
        self.neighborhoodList().forEach(function ( neighborhood ){
            dictObj[neighborhood.districtName] = neighborhood.visible();
        });

        return dictObj
    });

    restObjArray.forEach(function ( restObj ){
        var api_url = foursquareUrl + restObj.id + '?' + foursquareParams;

        $.ajax({
            url: api_url,
            data: {format: 'json'},
            dataType: 'json'
        }).done(function(data){

            var venue_data = data.response.venue;
            self.restList.push( new Restaurant( restObj, venue_data ) );

        }).fail(function(){
            console.log( 'Foursquare API failed for ' + restObj.name );
        });

    });

    // Check (and closes) if another window was previously called.
    self.closeWindows = function() {
        if ( prevWindow ) {
            prevWindow.close();
            prevWindow = null;
            self.windowOpen( false );
        }
    }

    self.selectMarker = function( rest ) {
        self.closeWindows();
        rest.marker.setAnimation( 4 );
        prevWindow = rest.infoWindow;
        rest.infoWindow.open( map, rest.marker );
        self.windowOpen( true );
    };

    self.getMarkers = ko.computed(function() {
        return self.restList().filter(function ( rest ) {
            self.closeWindows();

            if ( self.neighborhoodDict()[rest.neighborhood] ) {
                if ( rest.is_visible == false ) {
                    rest.marker.setMap( map );

                    rest.marker.setAnimation( google.maps.Animation.DROP );

                    rest.marker.addListener( 'click', function(){
                        self.selectMarker( rest );
                    });

                    map.addListener( 'click', function(){
                        self.closeWindows();
                    });
                }

                rest.is_visible = true;

                return true;

            } else {
                rest.marker.setMap( null );
                rest.is_visible = false;

                return false;
            }
        });

    }, self);

    self.filterToggle = function( neighborhood ) {
        neighborhood.visible( !neighborhood.visible() );
    };

    self.allToggle = function() {
        var anyVisible = self.neighborhoodList().reduce(function ( bool, neighborhood ){
            bool = bool || neighborhood.visible();
            return bool;
        }, false);

        if (anyVisible) {
            self.clearAll();
        } else {
            self.selectAll();
        }
    };

    self.clearAll = function() {
        self.neighborhoodList().forEach(function ( neighborhood ) {
            neighborhood.visible( false );
        });
    };

    self.selectAll = function() {
        self.neighborhoodList().forEach(function ( neighborhood ) {
            neighborhood.visible( true );
        });
    };

};

var viewM = new ViewModel();
ko.applyBindings( viewM );

