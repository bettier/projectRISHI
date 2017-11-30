import {Meteor} from 'meteor/meteor';
import {Travel} from './travel.js';

Meteor.methods({
  'travel.insert' (title, picture, caption, body) {
    return Travel.insert({
      title: title,
      picture: picture,
      caption: caption,
      body: body,
    });
  },
  'travel.update' (id, title, picture, caption, body) {
    return Travel.update(id, {
      $set: {
        title: title,
        picture: picture,
        caption: caption,
        body: body
      }
    });
  },
  'travel.delete' (_id) {
    return Travel.remove(_id);
  }
});