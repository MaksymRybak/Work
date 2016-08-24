$(function() {

  var spinning = false;

  function clearStates () {
    [
      '#ajax-status',
      '#send-card-random-result',
      '#send-card-image-result',
      '#send-card-link-result',
      '#send-card-media-result',
      '#send-card-application-result',
      '#send-card-activity-result',
      '#send-card-custom-very-result'
    ].forEach(function (e) {
      $(e)
        .text('none')
        .removeClass('aui-lozenge-success')
        .removeClass('aui-lozenge-error');
    });
    $('#send-card-result-error').text('');
  }

  function withToken(callback) {
    // compatibility check until all native clients have the new API
    if (HipChat.auth) {
      HipChat.auth.withToken(callback);
    } else {
      var token = $('meta[name="token"]').attr('content');
      callback(null, token);
    }
  }

  function doAjax (buttonId, data) {
    clearStates();
    AJS.$('#request-spinner').spin();
    withToken(function(err, token) {
      if (err) {
        console.log(err);
        $('#send-card-result-error').text(err.message).addClass('aui-lozenge-error');
        AJS.$('#request-spinner').spinStop();
      } else {
        $.ajax({
          type: 'POST',
          url: '/sendcard',
          headers: { 'Authorization': 'JWT ' + token },
          dataType : 'json',
          data: data,
          success: function (data, textStatus, xhr) {
            return onAjaxSuccess(data, textStatus, xhr, buttonId);
          },
          error: onAjaxError,
          complete: onAjaxComplete
        });
      }
    });
  }

  function onAjaxSuccess (data, textStatus, xhr, buttonId) {
    console.log(data);
    $('#ajax-status')
      .text(xhr.status + ' ' + textStatus)
      .addClass('aui-lozenge-success');
    $('#card-json').val(JSON.stringify(data.card, undefined, 2));
    if (data.hcdata.body && data.hcdata.body.error) {
      $(buttonId + '-result')
        .text(data.hcdata.statusCode + ' ' + data.hcdata.body.error.type)
        .addClass('aui-lozenge-error');
      $('#send-card-result-error')
        .text(data.hcdata.body.error.message);
    } else {
      $(buttonId + '-result')
        .text(data.hcdata.statusCode + ' ')
        .addClass('aui-lozenge-success');
    }
  }

  function onAjaxError (xhr, textStatus, errorThrown) {
    console.log(errorThrown);
    console.log("Status: " + textStatus);
    $('#ajax-status')
      .text(xhr.status + ' ' + errorThrown)
      .addClass('aui-lozenge-error');
    $('#send-card-result-error')
        .text(xhr.responseText);
    console.dir(xhr);
  }

  function onAjaxComplete (xhr, textStatus) {
    AJS.$('#request-spinner').spinStop();
    console.log("Complete: " + textStatus);
  }

  switchNavigation('#nav-cards');

  $('#send-card-random').click(function() {
    doAjax('#send-card-random',
      {
        type: 'random',
        card: ''
      }
    );
  });

  $('#send-card-image').click(function() {
    doAjax('#send-card-image',
      {
        type: 'image',
        card: ''
      }
    );
  });

  $('#send-card-link').click(function() {
    doAjax('#send-card-link',
      {
        type: 'link',
        card: ''
      }
    );
  });

  $('#send-card-media').click(function() {
    doAjax('#send-card-media',
      {
        type: 'media',
        card: ''
      }
    );
  });

  $('#send-card-application').click(function() {
    doAjax('#send-card-application',
      {
        type: 'application',
        card: ''
      }
    );
  });

  $('#send-card-activity').click(function() {
    doAjax('#send-card-activity',
      {
        type: 'activity',
        card: ''
      }
    );
  });

  $('#send-card-custom-very').click(function() {
    doAjax('#send-card-custom-very',
      {
        type: 'json',
        card: $('#card-json').val()
      }
    );
  });

});
