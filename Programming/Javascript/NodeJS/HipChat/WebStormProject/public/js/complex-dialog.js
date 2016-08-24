$(function () {

  function receiveParameters(event) {
    $("#init-params").val(JSON.stringify(event));
  }

  function filterChanged(event) {
    $("#filter-string").val(event.value);
  }

  function buttonClicked(event, closeDialog) {
    console.log(event);
    closeDialog(true);
  }

  AP.register({
    "receive-parameters": receiveParameters,
    "input.open.dialog.complex": receiveParameters,
    "dialog-filter-changed": filterChanged,
    "dialog-button-click": buttonClicked
  });

  // ----------------------------------------------------

  function changePrimaryAction() {
    AP.require('dialog', function(dialog) {
      var enabled = $('#button-enabled').prop('checked');
      var label = $('#button-label').val();
      dialog.updatePrimaryAction({
        name: label,
        enabled: enabled
      })
    })
  }

  function updateDialog(options) {
    AP.require('dialog', function(dialog) {
      dialog.update({
        options: options
      })
    })
  }

  $('#button-enabled').change(function() {
    changePrimaryAction();
  });

  $('#button-label').change(function() {
    changePrimaryAction();
  });

  $('#button-width').change(function() {
    var width = $('#button-width').val();
    updateDialog({
      size: {
        width: width
      }
    })
  });

  $('#button-height').change(function() {
    var height = $('#button-height').val();
    updateDialog({
      size: {
        height: height
      }
    })
  });

  $('#open-sidebar').click(function(e) {
    e.preventDefault();
    AP.require('sidebar', function(sidebar) {
      sidebar.openView({
        key: 'hctester.sidebar.message-actions',
        parameters: {
          greetings: 'from dialog'
        }
      });
    })
  });

  $('#close-sidebar').click(function(e) {
    e.preventDefault();
    AP.require('sidebar', function(sidebar) {
      sidebar.closeView();
    })
  });

  $('#close-dialog').click(function(e) {
    e.preventDefault();
    AP.require('dialog', function(dialog) {
      dialog.close();
    })
  });

});
