$(function () {
  $('#show-message').click(function(e) {
    e.preventDefault();
    var type = $("#message-type").val(),
    title = $("#message-title").val(),
    body = $("#message-body").val();
    HipChat.message[type](title, body);
  });
});