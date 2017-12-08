import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Meteor } from 'meteor/meteor';

// layout templates
import '../../ui/layout/body/body.js';
import '../../ui/layout/admin/admin_layout.js'

// page templates
import '../../ui/pages/home/home.js';
import '../../ui/pages/map/map.js';
import '../../ui/pages/travel/travel.js';
import '../../ui/pages/projects/projects.js';
import '../../ui/pages/admin/projects/edit/add.js';
import '../../ui/pages/admin/projects/projects.js';
import '../../ui/pages/admin/login/login.js';
import '../../ui/pages/admin/signup/signup.js';
import '../../ui/pages/admin/travel/travel.js';
import '../../ui/pages/admin/travel/edit/add.js';
import '../../ui/pages/admin/map/map.js';
import '../../ui/pages/admin/map/edit/add.js'

// components
import '../../ui/components/navbar/navbar.js'
import '../../ui/components/admin_navbar/admin_navbar.js'
import '../../ui/components/map/map.js'

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
    BlazeLayout.render('App_admin_layout', { main: 'App_admin_projects' });
  },
});

FlowRouter.route('/admin/projects/edit', {
  name: 'App.add',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn())
      redirect('/admin/login');
  }],
  action() {
    BlazeLayout.render('App_admin_layout', { main: 'App_admin_projects_add' });
  },
});

FlowRouter.route('/admin/projects/edit/:id', {
  name: 'App.add',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn())
      redirect('/admin/login');
  }],
  action() {
    BlazeLayout.render('App_admin_layout', { main: 'App_admin_projects_add' });
  },
});

FlowRouter.route('/admin', {
  name: 'App.admin',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn()) {
      redirect('/admin/login');
    } else {
      redirect('/admin/travel');
    }
  }],
});

FlowRouter.route('/admin/login', {
  name: 'App.login',
  triggersEnter: [function(context, redirect) {
    if (Meteor.user() || Meteor.loggingIn())
      redirect('/admin/projects');
  }],
  action() {
    BlazeLayout.render('App_login');
  },
});

FlowRouter.route('/admin/signup', {
  name: 'App.signup',
  triggersEnter: [function(context, redirect) {
    if (Meteor.user() || Meteor.loggingIn())
      redirect('/admin/projects');
  }],
  action() {
    BlazeLayout.render('App_signup');
  },
});

FlowRouter.route('/admin/travel/edit', {
  name: 'App.add',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn())
      redirect('/admin/login');
  }],
  action() {
    BlazeLayout.render('App_admin_layout', { main: 'App_admin_travel_add' });
  },
});

FlowRouter.route('/admin/travel/edit/:id', {
  name: 'App.add',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn())
      redirect('/admin/login');
  }],
  action() {
    BlazeLayout.render('App_admin_layout', { main: 'App_admin_travel_add' });
  },
});

FlowRouter.route('/admin/travel', {
  name: 'App.travel',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn())
      redirect('/admin/login');
  }],
  action() {
    BlazeLayout.render('App_admin_layout', { main: 'App_admin_travel' });
  },
});

FlowRouter.route('/admin/map', {
  name: 'App.map',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn())
      redirect('/admin/login');
  }],
  action() {
    BlazeLayout.render('App_admin_layout', { main: 'App_admin_map' });
  },
});

FlowRouter.route('/admin/map/edit', {
  name: 'App.map',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn())
      redirect('/admin/login');
  }],
  action() {
    BlazeLayout.render('App_admin_layout', { main: 'App_admin_map_add' });
  },
});

FlowRouter.route('/admin/map/edit/:id', {
  name: 'App.map',
  triggersEnter: [function(context, redirect) {
    if (!Meteor.user() && !Meteor.loggingIn())
      redirect('/admin/login');
  }],
  action() {
    BlazeLayout.render('App_admin_layout', { main: 'App_admin_map_add' });
  },
});