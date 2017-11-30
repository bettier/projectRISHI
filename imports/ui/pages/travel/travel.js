import './travel.html'


import { Travel } from '/imports/api/travel/travel';

Template.App_travel.helpers({
  travel_stories(){
    return Travel.find();
  }
});

Template.App_travel.onCreated(function() {
  Meteor.subscribe('travel');
  Meteor.subscribe('images.all');
});