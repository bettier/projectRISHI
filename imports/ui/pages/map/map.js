import {mapStyles} from './mapObjects.js'
import {wards} from './mapObjects.js'
import './mapLabel.js'
import './map.html'

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

  console.log(mapStyles);
}

/**
 * Add marker to map
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
  }
  else {
    marker = new google.maps.Marker({
      position: place.coordinates,
      map: map,
      title: place.name,
      animation: google.maps.Animation.DROP
    });
  }

  // this is where we add the description
  marker.content = '<h1>' + marker.getTitle() + '</h1>' +
    '<center><img width=150 src="../icons/temp.png"/></img><p>' +
    place.description + '</center>';

  var infoWindow = new google.maps.InfoWindow();

  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(this.content);
    infoWindow.open(this.getMap(), this);
  });

  return marker;
}

/**
 * Variable names to represent the logos
 */
var logo = 'logo_small',
  cart = 'cart_small',
  health = 'health_small',
  education = 'education_small',
  water = 'water_small',
  agriculture = 'agriculture',
  womens = 'womens_empowerment',
  poi = 'points_of_interest';

var places = {
  ward1: [
    ['RISHI Liason', [30.575122, 77.502520], logo],
    ['Temple #1', [30.575864, 77.501478], poi],
    ['Temple #2', [30.575679, 77.501371], poi],
    ['Terrace Farm', [30.574922, 77.516484], agriculture],
    ['Primary School Ward', [30.577421, 77.504928], education],
    ['Purli Primary School (Ward 1)', [30.577132, 77.505167], education]
  ],
  ward2: [
    ['Greenhouse', [30.560902, 77.510453], water]
  ],
  ward3: [
    ['Anganwadi Ward 3', [30.560207, 77.510739], education],
    ['Computer Lab/Ayurvedic Center', [30.559006, 77.516603], education],
    ['Mahila Mandal', [30.559570, 77.516531], poi],
    ['Secondary School', [30.559061, 77.517062], education],
    ['PHC', [30.560069, 77.513733], health],
    ['Convenience Stores', [30.560246, 77.511274], cart]
  ],
  ward4: [
    ['Anganwadi Ward 4', [30.561139, 77.523469], education],
    ['Primary School Ward 4', [30.560544, 77.525855], education]
  ],
  ward5: [
    ['Anganwadi Ward 5', [30.555780, 77.536152], education]
  ]
};

/**
 * Variables to represent the list of markers
 */
var listofmarkers = ['Education', 'Women\'s Empowerment', 'Health', 'Agriculture', 'Points of Interest'];

/**
 * Variables to represent the filters for the wards
 */
var filters = [['Reset Map'],
  ['Ward 1', places['ward1']],
  ["Ward 2", places['ward2']],
  ['Ward 3', places['ward3']],
  ['Ward 4', places['ward4']],
  ['Ward 5', places['ward5']]];

var currWard = -1;
var highlighted_filters = [true, false, false, false, false];

google.maps.Polygon.prototype.getBounds = function () {
  var bounds = new google.maps.LatLngBounds()
  this.getPath().forEach(function (element, index) {
    bounds.extend(element)
  })
  return bounds;
};

/**
 * Ward coordinates
 */

// ward4Coords.splice(251, 12);
// ward5Coords.splice(180, 7);

/**
 * Creates each ward with their filters
 */
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

function initWards() {
  for (let i = 0; i < wards.length; i++) {
    let current = wards[i];
    console.log(wards);
    makeWard(current.border, current.color, map);
  }
}

function initWardFilters() {
  // create reset map button
  wards.unshift({
    name: 'Reset Map',
    color: 'reset',
    center: ['30.565075', '77.516132']
  });

  // each filter has a height ~75
  $('#filters').height(75 * (wards.length));

  /*
   * Creates the "Ward __" labels for the menu buttons
   */
  var filterRow = '<tr><td class="filter"><img width=15 src="/icons/IMAGE.png"/> SPLICE</td>  </tr>';


  /**
   * We're creating the filters in the UI
   */
  for (let i = 0; i < wards.length; i++) {
    (function (i) {
      // get current ward
      let currWard = wards[i];

      // create button in HTML
      let row = filterRow.replace('SPLICE', currWard.name);
      let currFilter = $.parseHTML(row.replace('IMAGE', currWard.color));
      $('#filters').append(currFilter);

      /**
       * move map to where the ward that is clicked is
       */
      $(currFilter).click(function () {
        let cco = currWard.center;
        console.log(currWard);

        var bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(cco[0], cco[1]));
        map.fitBounds(bounds);

        // reset map unzooms but everything else zooms in
        if (currWard.name == 'Reset Map') {
          map.setZoom(14)
        } else {
          map.setZoom(15);
        }
      });
    })(i);
  }
}

function initFilterMarkers() {
  let filterMarkers = [];
  for (let w = 0; w < wards.length; w++) {
    let currentWard = wards[w];
    filterMarkers.push([]);

    // get places in current ward
    let places = currentWard.places;

    if (!places) {
      continue;
    }

    // create the wards and put them into the array
    for (let p = 0; p < places.length; p++) {
      let marker = markerGenerator(places[p]);
      marker.setMap(map);
      filterMarkers[w].push(marker);
    }
  }


  $('#tester').height(75 * listofmarkers.length);

  var icons = ['education_small', 'womens_empowerment', 'health_small', 'agriculture', 'points_of_interest'];
  var filterRow2 = '<tr><td class="subfilter"><img width=15 src="/icons/IMAGE.png"/>SPLICE</td></tr>';

  for (var i = 0; i < listofmarkers.length; i++) {
    (function (i) {

      var row2 = filterRow2.replace('SPLICE', listofmarkers[i]);
      var currFilter2 = $.parseHTML(row2.replace('IMAGE', icons[i]));

      $('#tester').append(currFilter2);

      $(currFilter2).click(function () {
        if (currWard == 0 || currWard == -1) {
          return;
        }

        for (var a = 0; a < filterMarkers.length; a++) {
          for (var b = 0; b < filterMarkers[a].length; b++) {
            if (filterMarkers[a][b].getIcon() == ("/icons/" + icons[i] + ".png")) {
              if (google.maps.geometry.poly.containsLocation(filterMarkers[a][b].getPosition(), wards[currWard - 1])) {
                filterMarkers[a][b].setMap(map);

              } else {
                filterMarkers[a][b].setMap(null);
              }

            } else {
              filterMarkers[a][b].setMap(null);
            }
          }
        }
      });
    })(i);
  }
}

Template.App_map.onRendered(function () {
  initMap();
  initWards();
  initWardFilters();
  initFilterMarkers();

  /**
   * Adding labels to map (Ward #'s')
   */
  var mapLabel1 = new MapLabel({
    text: 'Ward 1',
    position: new google.maps.LatLng('30.581746', '77.505023'),
    map: map,
    fontSize: 20
  });

  var mapLabel2 = new MapLabel({
    text: 'Ward 2',
    position: new google.maps.LatLng('30.558858', '77.499994'),
    map: map,
    fontSize: 20
  });

  var mapLabel3 = new MapLabel({
    text: 'Ward 3',
    position: new google.maps.LatLng('30.563089', '77.518964'),
    map: map,
    fontSize: 18
  });

  var mapLabel4 = new MapLabel({
    text: 'Ward 4',
    position: new google.maps.LatLng('30.561011', '77.529445'),
    map: map,
    fontSize: 17
  });

  var mapLabel5 = new MapLabel({
    text: 'Ward 5',
    position: new google.maps.LatLng('30.553073', '77.544900'),
    map: map,
    fontSize: 20
  });

});
