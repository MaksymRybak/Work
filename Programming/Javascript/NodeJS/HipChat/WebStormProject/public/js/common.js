function switchNavigation (id) {
  $('#nav-main1').children().each(function () {
    $(this).removeClass('aui-nav-selected-custom');
  });
  $('#nav-main2').children().each(function () {
    $(this).removeClass('aui-nav-selected-custom');
  });
  $(id).addClass('aui-nav-selected-custom');
}
