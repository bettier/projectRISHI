import {mapStyles} from './mapObjects.js'
import {initialWards} from './mapObjects.js'
import {Wards} from '/imports/api/map/wards.js'
import './mapLabel.js'
import './map.html'

// wards on the map
let wards = undefined;

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

/**
 * Variables to represent the list of markers
 */
var listofmarkers = ['Education', 'Women\'s Empowerment', 'Health', 'Agriculture', 'Points of Interest'];

var currWard = -1;

google.maps.Polygon.prototype.getBounds = function () {
  var bounds = new google.maps.LatLngBounds()
  this.getPath().forEach(function (element, index) {
    bounds.extend(element)
  })
  return bounds;
};

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

function initMapLabels() {
  for (let i = 0; i < wards.length; i++) {
    let ward = wards[i];
    if (ward.name == "Reset Map") {
      continue;
    }

    let label = new MapLabel({
      text: ward.name,
      position: new google.maps.LatLng(ward.center[0], ward.center[1]),
      map: map,
      fontSize: 20,
    });
  }
}

function initPage() {
  // get wards from server
  wards = Wards.find({}).fetch();

  // make UI
  initMap();
  initWards();
  initWardFilters();
  initFilterMarkers();
  initMapLabels();
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

Template.App_map.onCreated(function () {
  // initDB();
  Meteor.subscribe("wards", function () {
    initPage();
  })
});
