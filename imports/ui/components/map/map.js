import {mapStyles} from './mapObjects.js'
import {initialWards} from './mapObjects.js'
import {Wards} from '/imports/api/map/wards.js'
import './mapLabel.js'
import './map.html'

// wards on the map
let wards = undefined;

// Variables to represent the list of markers
let listofmarkers = ['Education', 'Women\'s Empowerment', 'Health', 'Agriculture', 'Points of Interest'];

/**
 * Set up map default view
 */
function initMap() {
  map = new google.maps.Map(document.getElementsByClassName('map')[0], {
    zoom: 14,
    minZoom: 13,
    disableDefaultUI: true,
    center: new google.maps.LatLng(30.565075, 77.516132),
    mapTypeId: 'roadmap',
    styles: mapStyles,
  });
}

function initWard(ward) {
  makeWard(ward.border, ward.color, map);

  // label on map saying 'Ward x'
  let label = new MapLabel({
    text: ward.name,
    position: new google.maps.LatLng(ward.center[0], ward.center[1]),
    map: map,
    fontSize: 20,
  });

  createMarkers(ward.places);

  createWardFilter(ward.name, ward.color, ward.center);
}

function createWardFilter(name, color, center) {
  /*
   * Creates the "Ward __" labels for the menu buttons
   */
  let filterRow = '<tr><td class="filter"><img width=15 src="/icons/IMAGE.png"/> SPLICE</td>  </tr>';

  // create button in HTML
  let row = filterRow.replace('SPLICE', name);
  let currFilter = $.parseHTML(row.replace('IMAGE', color));
  $('#filters').append(currFilter);

  /**
   * move map to where the ward that is clicked is
   */
  $(currFilter).click(function () {
    let cco = center;

    var bounds = new google.maps.LatLngBounds();
    bounds.extend(new google.maps.LatLng(cco[0], cco[1]));
    map.fitBounds(bounds);

    // reset map unzooms but everything else zooms in
    if (name == 'Reset Map') {
      map.setZoom(14)
    } else {
      map.setZoom(15);
    }
  });
}

var makeWard = function (coords, color, map) {
  return new google.maps.Polygon({
    paths: coords,
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 0.7,
    fillColor: color,
    fillOpacity: .3,
    map: map
  });
};

function markerGenerator(place) {
  let marker;
  let position = new google.maps.LatLng(place.coordinates[0], place.coordinates[1]);
  if (place.logo) {
    marker = new google.maps.Marker({
      position: position,
      map: map,
      title: place.name,
      //info:
      animation: google.maps.Animation.DROP,
      icon: '../icons/' + place.logo + '.png'
    });
  } else {
    marker = new google.maps.Marker({
      position: place.coordinates,
      map: map,
      title: place.name,
      animation: google.maps.Animation.DROP
    });
  }

  // this is where we add the description
  marker.content = '<h1>' + marker.getTitle() + '</h1>' +
    '<center><img width=150 src="../icons/temp.png"/></img><travel>' +
    place.description + '</center>';

  var infoWindow = new google.maps.InfoWindow();

  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(this.content);
    infoWindow.open(this.getMap(), this);
  });
  return marker;
}

function initWards() {
  for (let i = 0; i < wards.length; i++) {
    initWard(wards[i]);
  }
}

function createMarkers(places) {
  if (places) {
    return;
  }

  for (let i = 0; i < places.length; i++) {
    markerGenerator(places[p]).setMap();
  }
}

function initPage() {
  // get wards from server
  wards = Wards.find({}).fetch();

  setFilterHeight();

  // create reset map button
  createWardFilter('Reset Map', 'reset', ['30.565075', '77.516132']);

  // make UI
  initMap();
  initWards();
  initMarkerFilterBar();
}

function setFilterHeight() {
  // each filter has a height ~75

  // + 1 for reset
  $('#filters').height(75 * (wards.length + 1));
  $('#tester').height(75 * listofmarkers.length);
}

function initMarkerFilterBar() {
  var icons = ['education_small', 'womens_empowerment', 'health_small', 'agriculture', 'points_of_interest'];
  var filterRow2 = '<tr><td class="subfilter"><img width=15 src="/icons/IMAGE.png"/>SPLICE</td></tr>';

  for (var i = 0; i < listofmarkers.length; i++) {
    (function (i) {

      var row2 = filterRow2.replace('SPLICE', listofmarkers[i]);
      var currFilter2 = $.parseHTML(row2.replace('IMAGE', icons[i]));

      $('#tester').append(currFilter2);
    })(i);
  }
}


/**
 * Put in the wards into the DB to test the DB.
 */
function initDB() {
  for (let i = 0; i < initialWards.length; i++) {
    let ward = initialWards[i];
    Meteor.call('wards.insert',
      ward.name,
      ward.center,
      ward.border,
      ward.color,
      ward.places
    );
  }
}

Template.component_map.onCreated(function () {
  // initDB();
  Meteor.subscribe("wards", function () {
    initPage();
  })
});
