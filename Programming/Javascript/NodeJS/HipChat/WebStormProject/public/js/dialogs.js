$(function() {

  switchNavigation('#nav-dialogs');

  function openDialog(key) {
    AP.require('dialog', function(dialog) {
      dialog.open({
        key: key
      });
    });
  }

  function parseJSONInput(id) {
    var json = null,
      errorId = id + '-error',
      rawText = $(id).val();
    try {
      json = JSON.parse(rawText);
      $(errorId).text('');
    } catch (e) {
      $(errorId).text('Invalid JSON: ' + e.message);
    }
    return json;
  }

  $('#open-dialog').click(function() {
    openDialog('hctester.sidebar.message-actions');
  });

  $('#open-dialog-simple').click(function() {
    openDialog('hctester.dialog.simple');
  });

  $('#open-dialog-complex').click(function() {
    openDialog('hctester.dialog.complex');
  });

  $('#open-dialog-warning').click(function() {
    openDialog('hctester.dialog.warning');
  });

  $('#open-dialog-custom').click(function(e) {
    e.preventDefault();
    AP.require('dialog', function(dialog) {
      var dialogSpec = parseJSONInput('#dialog-json');
      var initParams = parseJSONInput('#dialog-params');
      if (dialogSpec && initParams) {
        dialog.open({
          key: 'hctester.dialog.simple',
          options: dialogSpec,
          parameters: initParams
        });
      }
    });
  });

});
