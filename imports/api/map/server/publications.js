import {Meteor} from 'meteor/meteor'
import {Wards} from '../map.js'
import {MapCenter} from '../map.js'

Meteor.publish('wards', function () {
  return Wards.find();
});

Meteor.publish('mapCenter', function () {
  return MapCenter.find();
});