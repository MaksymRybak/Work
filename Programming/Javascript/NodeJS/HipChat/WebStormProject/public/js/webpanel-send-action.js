$(function() {
  function clearStates () {
    [
      '#action-send-result-error'
    ].forEach(function (e) {
      $(e)
        .text('')
        .removeClass('aui-lozenge-success')
        .removeClass('aui-lozenge-error');
    });
  }

  function withToken(callback) {
    if (HipChat.auth) {
      HipChat.auth.withToken(callback);
    } else {
      var token = $('meta[name="token"]').attr('content');
      callback(null, token);
    }
  }

  $('#action-send').click(function() {
    clearStates();
    var actionSpec = $('#action-spec').val();
    AJS.$('#request-spinner').spin();
    withToken(function(err, token) {
      if (err) {
        console.log(err);
        $('#action-send-result-error').text('token error');
        AJS.$('#request-spinner').spinStop();
      } else {
        $.ajax({
          type: 'POST',
          url: '/send/action',
          headers: { 'Authorization': 'JWT ' + token },
          dataType : 'json',
          data: {
              actionSpec: actionSpec
          },
          success: function (data, textStatus, xhr) {
              if (data.hcdata && data.hcdata.body && data.hcdata.body.error) {
                  $('#action-send-result-error').text('error: ' + data.hcdata.body.error.description);
              }
              return onAjaxSuccess(data, textStatus, xhr);
          },
          error: onAjaxError,
          complete: onAjaxComplete
        });
      }
    });
  });

  $('#action-cancel').click(function() {
      HipChat.sidebar.closeView();
  });

  function onAjaxSuccess (data, textStatus, xhr) {
    console.log(data);
    console.log(xhr.status + ' ' + textStatus);
    if (data.body && data.body.error) {
      console.log(data.statusCode + ' ' + data.body.error.type);
      console.log(data.body.error.message);
    } else {
      console.log(data.statusCode + ' ');
    }
    $('#action-spec').val('');
  }

  function onAjaxError (xhr, textStatus, errorThrown) {
    $('#action-send-result-error').text('error: ' + errorThrown);
    console.log(errorThrown);
    console.log("Status: " + textStatus);
    console.log(xhr.status + ' ' + errorThrown);
    console.dir(xhr);
  }

  function onAjaxComplete (xhr, textStatus) {
    AJS.$('#request-spinner').spinStop();
    console.log("Complete: " + textStatus);
  }

});
