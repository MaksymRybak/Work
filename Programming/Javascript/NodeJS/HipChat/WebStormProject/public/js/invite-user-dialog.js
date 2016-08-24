$(function () {
  $('#show-message').click(function(e) {
    e.preventDefault();
    AP.require('room', function(room){
        console.log('room?', room);
      var users = $("#invite-users").val().split(',');
      room.invite(users);
    });
  });
});
