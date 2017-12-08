import './add.html'
import {Wards} from '/imports/api/map/map.js';

// parameters of a ward
let center, border, color;
let id = new ReactiveVar();
let name = new ReactiveVar();
let places = new ReactiveVar();

function initPage() {
  id.set(FlowRouter.current().params.id);
  let ward = Wards.findOne(id.get());

  if(!id.get()) {
    return;
  }

  name.set(ward.name);
  center = ward.center;
  border = ward.border;
  color = ward.color;
  places.set(ward.places);
}

Template.App_admin_map_add.onCreated(function() {
  Meteor.subscribe("wards", function() {
    initPage();
  })
});

Template.App_admin_map_add.helpers({
  places() {
    return places.get();
  },
  name() {
    return name.get();
  }
});