import {Meteor} from 'meteor/meteor';
import {Wards} from './map.js'
import {MapCenter} from './map.js'

Meteor.methods({
  'wards.insert'(name, center, border, color, places) {
    return Wards.insert({
      name: name,
      center: center,
      border: border,
      color: color,
      places: places
    })
  },
  'wards.update'(id, name, center, border, color, places) {
    return Wards.update(id, {
      $set: {
        name: name,
        center: center,
        border: border,
        color: color,
        places: places
      }
    });
  },
  'wards.delete'(_id) {
    return Wards.remove(_id);
  },
  'mapCenter.insert'(coordinates) {
    MapCenter.remove();
    return MapCenter.insert({
      coordinates: coordinates
    })
  }
});