import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';


// templates
import '../../ui/layout/body/body.js';
import '../../ui/pages/home/home.js';

// components
import '../../ui/components/navbar/navbar.js'

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});