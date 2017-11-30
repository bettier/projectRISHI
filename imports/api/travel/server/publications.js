import { Meteor } from 'meteor/meteor'
import { Travel } from '../travel.js'

Meteor.publish('travel', function(){
  return Travel.find();
});