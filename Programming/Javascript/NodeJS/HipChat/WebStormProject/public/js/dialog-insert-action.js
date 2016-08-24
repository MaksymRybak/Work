$(function () {
    var currentUserName = null;

    function receiveParameters(event) {
        HipChat.user.getCurrentUser(function(err, user) {
            if (err) {
                // error
            } else {
                // success
                currentUserName = user.name;
            }
        });
    }

    function buttonClicked(event, closeDialog) {
        console.log("buttonClicked event: " + event);
        if (event.action === 'company.dialog.insert.action.yes') {    // TODO: test
            sendActionMessageToRoom();
        }
        closeDialog(true);
    }

    function withToken(callback) {
        if (HipChat.auth) {
            HipChat.auth.withToken(callback);
        } else {
            var token = $('meta[name="token"]').attr('content');
            callback(null, token);
        }
    }

    function sendActionMessageToRoom() {
        var msg = $('#action-msg').val();
        withToken(function(err, token) {
            if (err) {
                console.log(err);
                $('#ajax-status').text('token error').addClass('aui-lozenge-error');
            } else {
                $.ajax({
                    type: 'POST',
                    url: '/dialog/message/action',
                    headers: { 'Authorization': 'JWT ' + token },
                    dataType : 'json',
                    data: {
                        username: currentUserName,
                        message: msg
                    },
                    success: function (data, textStatus, xhr) {
                        return onAjaxSuccess(data, textStatus, xhr);
                    },
                    error: onAjaxError,
                    complete: onAjaxComplete
                });
            }
        });
    }

    function onAjaxSuccess (data, textStatus, xhr) {
        console.log(data);
        $('#ajax-status')
            .text(xhr.status + ' ' + textStatus)
            .addClass('aui-lozenge-success');
        if (data.body && data.body.error) {
            console.log(data.statusCode + ' ' + data.body.error.type);
            console.log(data.body.error.message);
        } else {
            console.log(data.statusCode + ' ');
        }
    }

    function onAjaxError (xhr, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log("Status: " + textStatus);
        console.log(xhr.status + ' ' + errorThrown);
        console.dir(xhr);
    }

    function onAjaxComplete (xhr, textStatus) {
        console.log("Complete: " + textStatus);
    }

    AP.register({
        "receive-parameters": receiveParameters,
        "company.action.input.insert.action": receiveParameters,
        "dialog-button-click": buttonClicked
    });

});
