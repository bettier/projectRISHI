import './map.html'

import {Wards} from '/imports/api/map/map.js';
import {MapSettings} from "../../../../api/map/map";

let mapListener = undefined;

let currentZoom = undefined;
let currentCenter = undefined;

let settings = undefined;

let newLat = undefined;
let newLong = undefined;

Template.App_admin_map.onCreated(function () {
  Meteor.subscribe('mapSettings');
  Meteor.subscribe('wards');
});

Template.App_admin_map.helpers({
  wards() {
    return Wards.find({});
  }
});

Template.App_admin_map.events({
  'click #adminMapButton'(event) {
    settings = MapSettings.find({}).fetch()[0];
    currentCenter = settings.coordinates;
    currentZoom = settings.zoom;

    $("#adminZoomInput").val(settings.zoom);

    openMapOverlay();

    // create coordinates listener
    mapListener = google.maps.event.addListener($.goMap.map, "click", function (event) {
      newLat = event.latLng.lat();
      newLong = event.latLng.lng();

      currentCenter = [newLat, newLong];

      changeBounds();
      changeCoorDesc(true);
    });
  },
  'click #adminMapCancel'(event) {
    exitOverlay();
  },
  'click #adminMapSave'(event) {
    Meteor.call('mapSettings.insert',
      currentCenter,
      currentZoom
    );
    exitOverlay();
  },
  'change #adminZoomInput'(event) {
    console.log("hi");
    currentZoom = parseFloat($("#adminZoomInput").val());
    $.goMap.map.setZoom(currentZoom);
  }
});

function exitOverlay() {
  $('.adminMapOverlay').fadeOut(function () {
    $('#adminCoorDesc').text("Click on Map to choose new starting center");
  });

  if (mapListener) {
    mapListener.remove();
  }
}

function changeCoorDesc(updated) {
  let latText = (currentCenter[0] + "").substring(0, 8);
  let longText = (currentCenter[1] + "").substring(0, 8);
  let first = undefined;
  if (updated) {
    first = "New";
  } else {
    first = "Current";
  }

  let text = first + " Map Center: (Lat: " + latText + " Long: " + longText + ")";
  $("#adminCoorDesc").text(text);
}

function changeBounds() {
  let bounds = new google.maps.LatLngBounds();
  bounds.extend(new google.maps.LatLng(currentCenter[0], currentCenter[1]));
  map.fitBounds(bounds);
  map.setZoom(currentZoom);
}

function openMapOverlay() {
  $('.adminMapOverlay').fadeIn(function () {
    google.maps.event.trigger($.goMap.map, 'resize');
    changeBounds(settings.coordinates[0], settings.coordinates[1]);
  });
}