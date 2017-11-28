import { Meteor } from 'meteor/meteor';
import { Wards } from './wards.js'

Meteor.methods({
  'wards.insert' (name, center, border, color, places) {
    return Wards.insert({
      name: name,
      center: center,
      border: border,
      color: color,
      places: places
    })
  },
  'wards.update' (id, places) {
    return Wards.update(id, {
      $set: {places: places}
    });
  },
  'wards.delete' (_id) {
    return Wards.remove(_id);
  }
});