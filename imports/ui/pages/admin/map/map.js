import './map.html'

import {Wards} from '/imports/api/map/wards.js';

Template.App_admin_map.onCreated(function () {
  Meteor.subscribe('wards');
});

Template.App_admin_map.helpers({
  wards() {
    return Wards.find({});
  }
});

Template.App_admin_map.events({
  'click #adminMapButton'(event) {
    console.log("lmao");
    let mapDisplay = $(".adminMapDisplay");
    let mapButton = $("#adminMapButton");
    if (mapDisplay.is(":visible")) {
      mapDisplay.slideUp();
      console.log("it's not working");
      mapButton.text("Show Map");
    } else {
      mapDisplay.slideDown();
      mapButton.text("Hide Map");
    }
  }
});