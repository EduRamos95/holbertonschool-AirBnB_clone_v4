$(document).ready(function () {
  /*** dict has id to filter amenitiess section ***/
  const checkList = [];
  const checkDict = {};
  //*** catch a element when change status ***/
  $('.popover li input[type="checkbox"]').change(function () {
    let name = $(this).attr('data-name');
    checkDict[`$name`] 
    if ($(this).is(':checked')) {
      checkList.push(name);
      checkDict[$(this).data('id')] = $(this).data('name');
    } else {
      checkList.splice(checkList.indexOf(name), 1);
      delete checkDict[$(this).data('id')];
    }
    let msg = checkList.join(', ');
    if (msg.length > 28){
      msg = msg.slice(0,28) + '...';
    }
    $('.amenities h4').html(msg.length > 0 ? msg : '&nbsp;');
  });

  const reloadApi = function () {
    /*** Request to API ***/
    $.getJSON('http://127.0.0.1:5001/api/v1/status/')
    .done(function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        console.log('error code: ' + data.status);
        $('#api_status').removeClass('available');
      }
    })
    .fail(function () {
      console.log('Not detect service API');
      $('#api_status').removeClass('available');
    });
  }

  reloadApi();
  /*** ReloadApi without refresh page ***/
  $('DIV#api_status').click(function() {
    reloadApi();
  })

});