import "./admin_navbar.html"

Template.navbar.onRendered( function() {
  $('#dropdown').hide()
});

Template.navbar.events({
  'mouseenter #projectsNav' (event) {
    $('#dropdown').slideDown();
  },
  'mouseleave #projectsNav' (event) {
    $('#dropdown').slideUp();
  }
});