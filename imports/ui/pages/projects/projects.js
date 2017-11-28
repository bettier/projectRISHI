import './projects.html'

import { Projects } from '/imports/api/projects/projects';

Template.App_projects.helpers({
  projects(){
    return Projects.find();
  }
});

Template.App_projects.onCreated(function() {
  Meteor.subscribe('projects');
});