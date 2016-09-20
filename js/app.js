var map = {};
var marker = {};
var infoWindow = {}

window.initMap = function() {
    var myLatLng = {lat: 37.769115, lng: -122.435745};

    // detects if @media CSS responsive styles have been triggered
    // If so, assumes user is on mobile, changes zoom to be more user friendly.

    var zoom = viewM.isMobile() ? 12 : 13;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: myLatLng
    });

    map.addListener( 'click', function(){
        viewM.closeWindows();
    });

}


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
    var foursquareUrl = 'https://api.foursquare.com/v2/venues/';
    var foursquareParams = $.param({
        'client_id': '5IEZ35JU3I1RNEMKSQXLVQ1RWMTHZHSGNQO4U0E4SPBAQC1V',
        'client_secret': 'DHD0LK5VUJWKD4SUYSL4BUKX0XQ32WU03LMXVNHH04SIBRU4',
        'v': '20130815'
    });

    self.windowOpen = ko.observable( false );
    self.hasFiltered = ko.observable( false );
    self.restList = ko.observableArray( [] );
    self.neighborhoodList = ko.observableArray( [] );

    self.isMobile = function (){
        var navSize = $('.navbar-nav').css('width');
        return navSize === "200px" ? true : false;
    };

    var sidebarOpen = ko.computed(function(){
        var isOpen = $('.navbar-nav').css('left') === "20px" ? true : false;
        return isOpen;
    })

    // Unique list of neighborhoods from the basic input data.
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

    // Run AJAX calls for each venue in the restObjArray
    // Builds the Restaurant and Neighborhood models
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
            self.errorMessage( 'Foursquare', 'Failed request for ' + restObj.name )
        });

    });

    // Check (and closes) if another window was previously called.
    self.closeWindows = function() {
        if ( self.windowOpen() ) {
            self.windowOpen().close();
            self.windowOpen( false );
        }
    }

    self.toggleMarker = function( rest ) {
        if (self.windowOpen() !== rest.infoWindow) {
            self.closeWindows();
            rest.marker.setAnimation( 4 );
            rest.infoWindow.open( map, rest.marker );
            self.windowOpen( rest.infoWindow );
        } else {
            self.closeWindows();
        }
    };

    self.getMarkers = ko.computed(function() {
        return self.restList().filter(function ( rest ) {
            // self.closeWindows();

            if ( self.neighborhoodDict()[rest.neighborhood] ) {
                if ( rest.is_visible == false ) {
                    rest.marker.setMap( map );

                    rest.marker.setAnimation( google.maps.Animation.DROP );

                    // prevents constant stacking of event listeners.
                    google.maps.event.clearInstanceListeners(rest.marker);

                    rest.marker.addListener( 'click', function(){
                        self.toggleMarker( rest );
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

    self.selectNeighborhood = function( neighborhood ) {
        self.closeWindows();
        self.clearAll();
        neighborhood.visible( true );
    }

    self.clearAll = function() {
        self.neighborhoodList().forEach(function ( neighborhood ) {
            neighborhood.visible( false );
        });

        self.hasFiltered( true );
    };

    self.selectAll = function() {
        self.neighborhoodList().forEach(function ( neighborhood ) {
            neighborhood.visible( true );
        });

        self.hasFiltered( false );
    };

    self.toggleNavbar = function() {
        $('.navbar-nav').toggleClass('slide-in');
        $('.side-body').toggleClass('body-slide-in');
    };

    self.closeNavbar = function() {
        $('.navbar-nav').removeClass('slide-in');
        $('.side-body').removeClass('body-slide-in');
    };


    self.errorMessage = function ( source, additionalInfo ) {
        additionalInfo = additionalInfo || ''
        var errorMessage = $('#error-template').html();
        errorMessage = errorMessage.replace( '{{apiSource}}', source )
                                   .replace( '{{additionalInfo}}', additionalInfo);
        $('.side-body').prepend(errorMessage);
    };

};

var viewM = new ViewModel();
ko.applyBindings( viewM );