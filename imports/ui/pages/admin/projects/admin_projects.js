import './admin_projects.html';

import {Projects} from '/imports/api/projects/projects.js';

Template.App_admin_projects.onCreated(function () {
  Meteor.subscribe('projects');
});

Template.App_admin_projects.helpers({
  projects() {
    return Projects.find({});
  }
});
