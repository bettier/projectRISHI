import "./admin_navbar.html"

Template.admin_navbar.events({
  'click .logoutButton' (event) {
    if(!confirm("Are you sure you want to logout?")){
      return;
    }
    Meteor.logout(function () {
      FlowRouter.go('/admin/login');
    });
  }
});