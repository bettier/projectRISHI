import {Meteor} from 'meteor/meteor';
import {Projects} from './projects.js';

Meteor.methods({
  'projects.insert' (title, picture, caption, body) {
    return Projects.insert({
      title: title,
      picture: picture,
      caption: caption,
      body: body,
    });
  },
  'projects.update' (id, title, picture, caption, body) {
    return Projects.update(id, {
      $set: {
        title: title,
        picture: picture,
        caption: caption,
        body: body
      }
    });
  },
  'projects.delete' (_id) {
    return Projects.remove(_id);
  }
});