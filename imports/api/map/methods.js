import {Meteor} from 'meteor/meteor';
import {Wards, MapZoom, MapCenter, MapSettings} from './map.js'

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
  'mapSettings.insert'(center, zoom) {
    // there can only be 1!
    MapSettings.remove({});
    return MapSettings.insert({
      coordinates: center,
      zoom: zoom
    })
  },
});