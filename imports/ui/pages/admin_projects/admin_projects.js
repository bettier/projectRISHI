import './admin_projects.html'

import { Images } from '/imports/api/images/images.js'
import { Projects } from '/imports/api/projects/projects.js'

Template.App_admin_projects.onCreated(function(){
  Meteor.subscribe("images.all");
  Meteor.subscribe("projects");
});

Template.App_admin_projects.onRendered(function(){
  $('.captionInput').hide();
});

Template.App_admin_projects.events({
  'click #adminProjectsSave' (event) {
    event.preventDefault();

    let title = $(".titleInput").val();
    let body = $(".contentInput").val();
    let caption = $(".captionInput").val();

    // get image
    let photoInput = $('#adminProjectsPhotoInput').prop("files");
    let photoFile = photoInput[0];

    let photoPromise = new Promise((resolve, reject) => {
      if(!photoFile) {
        resolve("");
      } else {
        Images.insert(photoFile, function (err, file){
          if (file) {
            resolve(file._id);
          }
          reject("Error: " + err);
        });
      }
    });

    // once photo is uploaded
    photoPromise.then(function(pictureID){
      Meteor.call('projects.insert',
        title,
        pictureID,
        caption,
        body);
    });
  },
  'change #adminProjectsPhotoInput' (event) {
    let file = event.originalEvent.srcElement.files[0];
    let reader = new FileReader();
    let img = document.createElement("img");

    reader.onloadend = function(){
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    $('.adminHeader').after(img);
    $(img).css('width', '100%');

    $('.captionInput').show();
  },
  'click .adminAddPhoto' (event) {
    event.preventDefault();
    $("#adminProjectsPhotoInput").click();
  }
});