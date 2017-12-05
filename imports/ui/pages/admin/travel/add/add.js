import './add.html'

import {Images} from '/imports/api/images/images.js';
import {Travel} from '/imports/api/travel/travel.js';

let id = new ReactiveVar("");
let prevPhoto = undefined;

function initializePage() {
  id.set(FlowRouter.current().params.id);

  if(!id.get()){
    return;
  }

  let r = $("<span id=\"delete_button\" class=\"btn btn-default adminCancelSave\" >delete</span>");
  $('.centered').append(r);
  $('.adminCancelSave').css('width', '27%');

  let travel = Travel.findOne(id.get());

  $(".titleInput").val(travel.title);

  // get rid of <br/>
  $(".contentInput").val(travel.body.split('<br/>').join('\n'));

  // show image
  $('#addTravelPhoto').attr('src', "/cfs/files/images/" + travel.picture).show();
  $('.captionInput').show().val(travel.caption);

  prevPhoto = travel.picture;
}

Template.App_admin_travel_add.onCreated(function () {
  Meteor.subscribe("travel", function () {
    initializePage();
  });
  Meteor.subscribe("images.all");
});

Template.App_admin_travel_add.onRendered(function () {
  $('#addTravelPhoto').hide();
});

Template.App_admin_travel_add.events({
  'click #adminTravelCancel' (event) {
    FlowRouter.go("/admin/travel");
  },"click #delete_button"(event) {
    if(confirm("Are you sure you want to delete this travel item?")){
      console.log("deleting: " + id.get());
      Meteor.call("travel.delete", id.get());
      FlowRouter.go('/admin/travel');
    }
  },
  'click #adminTravelSave'(event) {
    event.preventDefault();

    // add <br/> for html
    let body = $(".contentInput").val().replace(/\n/g, '<br/>');

    let title = $(".titleInput").val();
    let caption = $(".captionInput").val();

    // get image
    let photoInput = $('#adminTravelPhotoInput').prop("files");
    let photoFile = photoInput[0];

    let photoPromise = new Promise((resolve, reject) => {
      if (!photoFile) {
        resolve("");
      } else {
        Images.insert(photoFile, function (err, file) {
          if (file) {
            resolve(file._id);
          }
          reject("Error: " + err);
        });
      }
    });

    // once photo is uploaded
    photoPromise.then(function (pictureID) {
      if(prevPhoto) {
        pictureID = prevPhoto;
      }

      if (id.get()) {
        Meteor.call('travel.update', id.get(),
          title,
          pictureID,
          caption,
          body);
      } else {
        Meteor.call('travel.insert',
          title,
          pictureID,
          caption,
          body);
      }
      FlowRouter.go("/admin/travel");
    });
  },
  'change #adminTravelPhotoInput'(event) {
    let file = event.originalEvent.srcElement.files[0];
    let reader = new FileReader();

    reader.onloadend = function () {
      $('#addTravelPhoto').attr('src', reader.result).show();
      prevPhoto = undefined;
    };
    reader.readAsDataURL(file);
  },
  'click .adminAddPhoto'(event) {
    event.preventDefault();
    $("#adminTravelPhotoInput").click();
  }
});