import './home.html';

Template.App_home.onCreated(function () {
  $('#first').css('opacity', '0.0');
  $('#second').css('opacity', '0.0');
  $('.index_smallQuote').css('opacity', '0.0');

  $('#first').delay(500).fadeTo(2000, 1);
  $('#second').delay(2000).fadeTo(2000, 1);
  $('.index_smallQuote').delay(3500).fadeTo(2000, 0.5);
});
