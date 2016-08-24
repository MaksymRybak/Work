$(function() {

  function clearStates () {
    [
      '#ajax-status',
      '#glance-update-result'
    ].forEach(function (e) {
      $(e)
        .text('none')
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

  $('#glance-update').click(function() {
    clearStates();
    AJS.$('#request-spinner').spin();
    withToken(function(err, token) {
      if (err) {
        console.log(err);
        $('#ajax-status').text('token error').addClass('aui-lozenge-error');
        AJS.$('#request-spinner').spinStop();
      } else {
        $.ajax({
          type: 'POST',
          url: '/glance/update',
          headers: { 'Authorization': 'JWT ' + token },
          dataType : 'json',
          data: {
            type: 'json',
            glance: $('#glance-json').val()
          },
          success: function (data, textStatus, xhr) {
            return onAjaxSuccess(data, textStatus, xhr, '#glance-update');
          },
          error: onAjaxError,
          complete: onAjaxComplete
        });
      }
    });
  });

  $('#glance-create').click(function() {
    var glanceKey = $('#glance-key').val();
    var glanceName = $('#glance-name').val();
    withToken(function(err, token) {
      if (err) {
        console.log(err);
        $('#ajax-status').text('token error').addClass('aui-lozenge-error');
      } else {
        $.ajax({
          type: 'POST',
          url: '/glance/create',
          headers: { 'Authorization': 'JWT ' + token },
          dataType : 'json',
          data: {
            key: glanceKey,
            name: glanceName
          },
          success: function (data, textStatus, xhr) {
            return onAjaxSuccess(data, textStatus, xhr, '#glance-update');
          },
          error: onAjaxError,
          complete: onAjaxComplete
        });
      }
    });
  });

  $('#glance-delete').click(function() {
    var glanceKey = $('#glance-key').val();
    withToken(function(err, token) {
      if (err) {
        console.log(err);
        $('#ajax-status').text('token error').addClass('aui-lozenge-error');
      } else {
        $.ajax({
          type: 'POST',
          url: '/glance/delete',
          headers: { 'Authorization': 'JWT ' + token },
          dataType : 'json',
          data: {
            key: glanceKey
          },
          success: function (data, textStatus, xhr) {
            return onAjaxSuccess(data, textStatus, xhr, '#glance-update');
          },
          error: onAjaxError,
          complete: onAjaxComplete
        });
      }
    });
  });

  function onAjaxSuccess (data, textStatus, xhr, buttonId) {
    console.log(data);
    $('#ajax-status')
      .text(xhr.status + ' ' + textStatus)
      .addClass('aui-lozenge-success');
    if (data.body && data.body.error) {
      $(buttonId + '-result')
        .text(data.statusCode + ' ' + data.body.error.type)
        .addClass('aui-lozenge-error');
      $(buttonId + '-result-error')
        .text(data.body.error.message);
    } else {
      $(buttonId + '-result')
        .text(data.statusCode + ' ')
        .addClass('aui-lozenge-success');
    }
  }

  function onAjaxError (xhr, textStatus, errorThrown) {
    console.log(errorThrown);
    console.log("Status: " + textStatus);
    $('#ajax-status')
      .text(xhr.status + ' ' + errorThrown)
      .addClass('aui-lozenge-error');
    console.dir(xhr);
  }

  function onAjaxComplete (xhr, textStatus) {
    AJS.$('#request-spinner').spinStop();
    console.log("Complete: " + textStatus);
  }

  switchNavigation('#nav-glances');

});
