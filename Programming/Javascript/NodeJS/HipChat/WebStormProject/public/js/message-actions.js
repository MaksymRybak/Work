$(function() {

  switchNavigation('#nav-msg-actions');

  function showMessage(message) {
    $('#message-json').text(JSON.stringify(message, undefined, 2));
  }

  if (typeof AP === "undefined") {
    console.log('Message action empty');
  } else {
    AP.register({
      "message.send.to.addon": showMessage,
      "receive-parameters": showMessage
    });
  }

});
