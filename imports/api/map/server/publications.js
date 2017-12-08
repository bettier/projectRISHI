import {Meteor} from 'meteor/meteor'
import {Wards, MapZoom, MapCenter} from '../map.js'
import {MapSettings} from "../map";

Meteor.publish('wards', function () {
  return Wards.find();
});

Meteor.publish('mapSettings', function() {
  return MapSettings.find();
});