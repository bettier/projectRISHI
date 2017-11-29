import './admin_projects_add.html'

import {Images} from '/imports/api/images/images.js'
import {Projects} from '/imports/api/projects/projects.js'

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

  let project = Projects.findOne(id.get());

  $(".titleInput").val(project.title);

  // get rid of <br/>
  $(".contentInput").val(project.body.split('<br/>').join('\n'));

  // show image
  $('#addProjectsPhoto').attr('src', "/cfs/files/images/" + project.picture).show();
  $('.captionInput').show().val(project.caption);

  prevPhoto = project.picture;
}

Template.App_admin_projects_add.onCreated(function () {
  Meteor.subscribe("projects", function () {
    initializePage();
  });
  Meteor.subscribe("images.all");
});

Template.App_admin_projects_add.onRendered(function () {
  $('#addProjectsPhoto').hide();
  $('.captionInput').hide();
});

Template.App_admin_projects_add.events({
  'click #adminProjectsCancel' (event) {
    FlowRouter.go("/admin/projects");
  },"click #delete_button"(event) {
    if(confirm("Are you sure you want to delete this project?")){
      console.log("deleting: " + id.get());
      Meteor.call("projects.delete", id.get());
      FlowRouter.go('/');
    }
  },
  'click #adminProjectsSave'(event) {
    event.preventDefault();

    // add <br/> for html
    let body = $(".contentInput").val().replace(/\n/g, '<br/>');

    let title = $(".titleInput").val();
    let caption = $(".captionInput").val();

    // get image
    let photoInput = $('#adminProjectsPhotoInput').prop("files");
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
        Meteor.call('projects.update', id.get(),
          title,
          pictureID,
          caption,
          body);
      } else {
        Meteor.call('projects.insert',
          title,
          pictureID,
          caption,
          body);
      }
      FlowRouter.go("/admin/projects");
    });
  },
  'change #adminProjectsPhotoInput'(event) {
    let file = event.originalEvent.srcElement.files[0];
    let reader = new FileReader();

    reader.onloadend = function () {
      $('#addProjectsPhoto').attr('src', reader.result).show();
      prevPhoto = undefined;
    };
    reader.readAsDataURL(file);
    $('.captionInput').show();
  },
  'click .adminAddPhoto'(event) {
    event.preventDefault();
    $("#adminProjectsPhotoInput").click();
  }
});