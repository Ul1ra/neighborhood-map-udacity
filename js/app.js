

var Restaurant = function() {
    self = this;
    self.marker = {};
    self.coordinates = {lat: 37.769115, lng: -122.435745};
};

var ViewModel = function() {
    var self = this;

    // initMap();
    // this.dropMarker = function() {
    //     addMarker({lat: 37.769115, lng: -122.435745}, map);
    // }.bind(this);

    // this.rest = ko.observable( new Restaurant() );
    // this.rest.createMarker();
    self.kickoff = function() {
        this.rest = new Restaurant();
        addMarker(this.rest, map);
    };

    // this.rest.addMarker(map);
};

// ko.applyBindings( new ViewModel() );

var viewM = new ViewModel();
ko.applyBindings( viewM );

