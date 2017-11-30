import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Meteor } from 'meteor/meteor';

// templates
import '../../ui/layout/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/map/map.js';
import '../../ui/pages/travel/travel.js';
import '../../ui/pages/projects/projects.js';
import '../../ui/pages/admin/projects_add/admin_projects_add.js';
import '../../ui/pages/admin/projects/admin_projects.js';
import '../../ui/pages/admin/login/login.js';
import '../../ui/pages/admin/signup/signup.js';

// components
import '../../ui/components/navbar/navbar.js'
import '../../ui/components/admin_navbar/admin_navbar'

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

FlowRouter.route('/map', {
  name: 'App.map',
  action() {
    BlazeLayout.render('App_body', { main: 'App_map' });
  },
});

FlowRouter.route('/travel', {
  name: 'App.travel',
  action() {
    BlazeLayout.render('App_body', { main: 'App_travel' });
  },
});

FlowRouter.route('/projects', {
  name: 'App.projects',
  action() {
    BlazeLayout.render('App_body', { main: 'App_projects' });
  },
});

FlowRouter.route('/admin/projects', {
  name: 'App.projects',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn())
      redirect('/admin/login');
  }],
  action() {
    BlazeLayout.render('App_body', { main: 'App_admin_projects' });
  },
});

FlowRouter.route('/admin/projects/edit', {
  name: 'App.projects_add',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn())
      redirect('/admin/login');
  }],
  action() {
    BlazeLayout.render('App_body', { main: 'App_admin_projects_add' });
  },
});

FlowRouter.route('/admin/projects/edit/:id', {
  name: 'App.projects_add',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn())
      redirect('/admin/login');
  }],
  action() {
    BlazeLayout.render('App_body', { main: 'App_admin_projects_add' });
  },
});

FlowRouter.route('/admin', {
  name: 'App.projects_add',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn()) {
      redirect('/admin/projects');
    } else {
      redirect('/admin/login');
    }
  }],
});

FlowRouter.route('/admin/login', {
  name: 'App.login',
  action() {
    BlazeLayout.render('App_body', { main: 'App_login' });
  },
});

FlowRouter.route('/admin/signup', {
  name: 'App.signup',
  action() {
    BlazeLayout.render('App_body', { main: 'App_signup' });
  },
});