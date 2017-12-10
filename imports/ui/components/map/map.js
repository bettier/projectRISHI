import {mapStyles} from './mapObjects.js'
import {initialWards} from './mapObjects.js'
import {Wards, MapSettings} from '/imports/api/map/map.js'
import './mapLabel.js'
import './map.html'

// wards on the map
let wards = undefined;
let mapCenterCoor = undefined;
let mapZoom = undefined;

// Variables to represent the list of markers
let listofmarkers = ['Education', 'Women\'s Empowerment', 'Health', 'Agriculture', 'Points of Interest'];

/**
 * Set up map default view
 */
function initMap() {
  console.log(typeof(mapZoom));
  $('.map').goMap({
    zoom: mapZoom,
    minZoom: 12,
    disableDefaultUI: true,
    center: new google.maps.LatLng(mapCenterCoor[0], mapCenterCoor[1]),
    mapTypeId: 'roadmap',
    styles: mapStyles,
  });
  map = $.goMap.map;
}

/**
 * Puts the ward on the map
 * @param ward the ward we're putting on the map
 */
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

/**
 * Creates the ward filter (left)
 * @param name the name of the ward (Ward 1, Ward 2...)
 * @param color the color of the ward
 * @param center the center of the ward. this is where the map zooms and where the name will be placed
 */
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
      console.log(mapZoom + 'aldjfladsflkajhdsfsa');
      map.setZoom(mapZoom);
    } else {
      map.setZoom(15);
    }
  });
}

/**
 * Draws the border and fills in the middle of the ward on the map
 * @param coords the border of the ward
 * @param color the color of the ward
 */
function makeWard(coords, color) {
  new google.maps.Polygon({
    paths: coords,
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 0.7,
    fillColor: color,
    fillOpacity: .3,
    map: map
  });
}

/**
 * Generates the icon on the map for the specific place
 * @param place the places we're putting on the map
 */
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

  // this is where we edit the description
  marker.content = '<h1>' + marker.getTitle() + '</h1>' +
    '<center><img width=150 src="../icons/temp.png"/></img><travel>' +
    place.description + '</center>';

  var infoWindow = new google.maps.InfoWindow();

  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(this.content);
    infoWindow.open(this.getMap(), this);
  });

  marker.setMap(map);
}

/**
 * Initializes all of the wards in the databbase
 */
function initWards() {
  for (let i = 0; i < wards.length; i++) {
    initWard(wards[i]);
  }
}

/**
 * Uses markerGenerator() to put the places on the map
 * @param places the places we want to mark on the map
 */
function createMarkers(places) {
  if (!places) {
    return;
  }

  for (let i = 0; i < places.length; i++) {
    markerGenerator(places[i]);
  }
}

/**
 * Creates all of the elements on the maps component
 */
function initComp() {
  // get wards from server
  wards = Wards.find({}).fetch();

  setFilterHeight();

  // create reset map button
  createWardFilter('Reset Map', 'reset', mapCenterCoor);

  // make UI
  initMap();
  initWards();
  initMarkerFilterBar();
}

/**
 * Sets the height of the filters according to how many there is
 */
function setFilterHeight() {
  // each filter has a height ~75

  // + 1 for reset
  $('#filters').height(75 * (wards.length + 1));
  $('#tester').height(75 * listofmarkers.length);
}

/**
 * Initializes the right filter bar
 */
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
  Meteor.call('mapSettings.insert',
    [30.565075, 77.516132],
    14
  );

  for (let i = 0; i < initialWards.length; i++) {
    let ward = initialWards[i];
    Meteor.call('wards.insert',
      ward.name,
      ward.center,
      ward.border,
      ward.color,
      // ward.places
    );
  }
}

Template.component_map.onCreated(function () {
  Meteor.subscribe("mapSettings", function () {
    Meteor.subscribe("wards", function () {
      // initDB();

      let mapSettings = MapSettings.find({}).fetch()[0];
      mapCenterCoor = mapSettings.coordinates;
      mapZoom = mapSettings.zoom;
      initComp();
    })
  });
});
