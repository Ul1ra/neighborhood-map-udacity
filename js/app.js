

var Restaurant = function() {
    self = this;
    self.coordinates = {lat: 37.769115, lng: -122.435745};
    self.name = 'Yelp';
    self.img_url = 'http://s3-media3.fl.yelpcdn.com/bphoto/nQK-6_vZMt5n88zsAS94ew/ms.jpg';
    self.rating_img_url = 'http://s3-media4.fl.yelpcdn.com/assets/2/www/img/c7fb9aff59f9/ico/stars/v1/stars_2_half.png';
    self.url = 'http://www.yelp.com/biz/yelp-san-francisco';
    self.description = 'Yelp is actually a place. <br><br> There\'s things and stuff.';

    var contentString = $('#info-template').html();

    contentString = contentString.replace('{{title}}', self.name)
                                 .replace('{{img_url}}', self.img_url)
                                 .replace('{{rating_img_url}}', self.rating_img_url)
                                 .replace('{{content}}', self.description);

    self.infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

};

var ViewModel = function() {
    var self = this;

    self.kickoff = function() {
        self.rest = new Restaurant();
        addMarker(self.rest, map);
    };
};

var viewM = new ViewModel();
ko.applyBindings( viewM );

