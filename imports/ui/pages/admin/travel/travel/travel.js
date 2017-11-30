import './travel.html';

import {Travel} from '/imports/api/travel/travel';

Template.App_admin_travel.onCreated(function () {
  Meteor.subscribe('travel');
});

Template.App_admin_travel.helpers({
  travel() {
    return Travel.find({});
  }
});
