import './map.html'

import {Wards} from '/imports/api/map/map.js';
import {MapCenter} from "../../../../api/map/map";

let firstTimeClickMapButton = true;
let mapCenterCoor = undefined;

Template.App_admin_map.onCreated(function () {
  Meteor.subscribe('mapCenter', function () {
    Meteor.subscribe('wards');
    mapCenterCoor = MapCenter.find({}).fetch()[0].coordinates;
  });
});

Template.App_admin_map.helpers({
  wards() {
    return Wards.find({});
  }
});

Template.App_admin_map.events({
  'click #adminMapButton'(event) {
    $('.adminMapOverlay').fadeIn(function () {
      google.maps.event.trigger($.goMap.map, 'resize');
      google.maps.event.addListener($.goMap.map, "click", function (event) {
        let latitude = event.latLng.lat();
        let longitude = event.latLng.lng();
        console.log(latitude + ', ' + longitude);
      });

      if (firstTimeClickMapButton) {
        let bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(mapCenterCoor[0], mapCenterCoor[1]));
        map.fitBounds(bounds);
        map.setZoom(14);
        firstTimeClickMapButton = false;
      }
    });
  },
  'click .adminMapExit'(event) {
    $('.adminMapOverlay').fadeOut();
  }
});