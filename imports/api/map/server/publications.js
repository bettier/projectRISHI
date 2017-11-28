import { Meteor } from 'meteor/meteor'
import { Wards } from '../wards.js'

Meteor.publish('wards', function() {
  return Wards.find();
});