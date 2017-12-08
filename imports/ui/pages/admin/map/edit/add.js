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

  let r = $("<span id=\"delete_button\" class=\"btn btn-default adminCancelSave\" >delete</span>");
  $('.centered').append(r);
  $('.adminCancelSave').css('width', '27%');

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

Template.App_admin_map_add.events({
  'click #adminMapCancel' (event) {
    FlowRouter.go("/admin/map");
  },
  "click #delete_button"(event) {
    if(confirm("Are you sure you want to delete this ward?")){
      console.log("deleting: " + id.get());
      Meteor.call("wards.delete", id.get());
      FlowRouter.go('/admin/map');
    }
  },
  "click #adminMapSave" (event) {
    event.preventDefault();
    alert("Well you can't edit anything, so IDK what you're doing");
  }
});