$(function() {

  function withToken(callback) {
    if (HipChat.auth) {
      HipChat.auth.withToken(callback);
    } else {
      var token = $('meta[name="token"]').attr('content');
      callback(null, token);
    }
  }

  function onAjaxSuccess (data, textStatus, xhr) {
    console.log(data);
    console.log(xhr.status + ' ' + textStatus);
    if (data.body && data.body.error) {
      console.log(data.statusCode + ' ' + data.body.error.type);
      console.log(data.body.error.message);
    } else {
      console.log(data.statusCode + ' ');
    }
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

  function readAction(actionId, actionSpec) {
        withToken(function(err, token) {
            if (err) {
                console.log(err);
            } else {
                AJS.$('#request-spinner').spin();
                $.ajax({
                    type: 'POST',
                    url: '/read/action',
                    headers: { 'Authorization': 'JWT ' + token },
                    dataType : 'json',
                    data: {
                        actionId: actionId,
                        actionSpec: actionSpec
                    },
                    success: function (data, textStatus, xhr) {
                        AJS.$('#request-spinner').spinStop();
                        return onAjaxSuccess(data, textStatus, xhr, buttonId);
                    },
                    error: onAjaxError,
                    complete: onAjaxComplete
                });
            }
        });
  }

  function doneAction(actionId, actionSpec) {
        withToken(function(err, token) {
            if (err) {
                console.log(err);
            } else {
                AJS.$('#request-spinner').spin();
                $.ajax({
                    type: 'POST',
                    url: '/done/action',
                    headers: { 'Authorization': 'JWT ' + token },
                    dataType : 'json',
                    data: {
                        actionId: actionId,
                        actionSpec: actionSpec
                    },
                    success: function (data, textStatus, xhr) {
                        // TODO: togliere il timeout, problema di recupero action quando non e' ancora stato salvato il messaggio DONE
                        setTimeout(function () {
                            AJS.$('#request-spinner').spinStop();
                            loadActions()
                        }, 2000);

                        return onAjaxSuccess(data, textStatus, xhr, buttonId);
                    },
                    error: onAjaxError,
                    complete: onAjaxComplete
                });
            }
        });
  }

  function loadActions() {
      withToken(function (err, token) {
          $('#actionlist').empty();
          if (err) {
              console.log(err);
              AJS.$('#request-spinner').spinStop();
              $('#request-loading').hide();
          } else {
              AJS.$('#request-spinner').spin();
              $('#request-loading').show();

              $.ajax({
                  type: 'GET',
                  url: '/get/actions',
                  headers: {'Authorization': 'JWT ' + token, 'Content-Type': 'application/json'},
                  success: function (data, textStatus, xhr) {
                      AJS.$('#request-spinner').spinStop();
                      $('#request-loading').hide();

                      if (data.actions) {
                          var actions = data.actions;
                          _.forEach(actions, function (a) {
                              var actionDesc = JSON.parse(a.card).description;
                              var actionText = actionDesc.value ? actionDesc.value : '';
                              $('#actionlist').append(
                                  '<li style="clear: both"><div>' + actionText + '</div>' +
                                  '<div>' +
                                  '<div class="left">' +
                                  '<div class="app-read-action">' +
                                  '<div class="left icon"><img width="14" height="14" src="https://d902d511.ngrok.io/img/read.png" /></div>' +
                                  '<div class="left"><a id="read' + a.id + '" class="label"><strong>read</strong></a></div>' +
                                  '</div>' +
                                  '</div>' +
                                  '<div class="left">&nbsp;&nbsp;&nbsp;</div>' +
                                  '<div class="left">' +
                                  '<div class="app-done-action">' +
                                  '<div class="left icon"><img width="14" height="14" src="https://d902d511.ngrok.io/img/done.png"></div>' +
                                  '<div class="left"><a id="done' + a.id + '"  class="label"><strong>done</strong></a></div>' +
                                  '</div>' +
                                  '</div>' +
                                  '</div>' +
                                  '</li>'
                              );
                              $('#read' + a.id).click(function () {
                                  readAction(a.id, actionText);
                              });
                              $('#done' + a.id).click(function () {
                                  doneAction(a.id, actionText);
                              });
                          });
                      }
                      return onAjaxSuccess(data, textStatus, xhr);
                  },
                  error: onAjaxError,
                  complete: onAjaxComplete
              });
          }
      });
  }

  loadActions();
});
