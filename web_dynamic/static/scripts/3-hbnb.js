$(document).ready(function () {
  /*** dict has id to filter amenitiess section ***/
  const checkList = [];
  const checkDictAmenities = {};
  //*** catch a element when change status ***/
  $('.popover li input[type="checkbox"]').change(function () {
    let name = $(this).attr('data-name');
    checkDictAmenities[`$name`]
    if ($(this).is(':checked')) {
      checkList.push(name);
      checkDictAmenities[$(this).data('id')] = $(this).data('name');
    } else {
      checkList.splice(checkList.indexOf(name), 1);
      delete checkDictAmenities[$(this).data('id')];
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
  });
  /*** post filter boton witouht refresh page ***/

  /*const sendDict = {
    '':[],
    '':[],
    '': Object.keys(checkDictAmenities),
  };*/

  $.post({
    type: 'POST',
    url: 'http://127.0.0.1:5001/api/v1/places_search/',
    data: '{}',
    contentType: 'application/json',
    success: function (data) {
      for (const e of data) {
        $('section.places').append(`
        <article>
          <div class="title_box">
            <h2>${e.name}</h2>
            <div class="price_by_night">$${e.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${e.max_guest} Guest${e.max_guest !== 1 ? 's' : ''}</div>
            <div class="number_rooms">${e.number_rooms} Bedroom${e.number_rooms !== 1 ? 's' : ''}</div>
            <div class="number_bathrooms">${e.number_bathrooms} Bathroom${e.number_bathrooms !== 1 ? 's' : ''}</div>
          </div>
          <div class="user">
            <b>Owner:</b> ${e.userFname} ${e.userLname}
          </div>
          <div class="description">
            ${e.description}
          </div>
        </article>`);
      }
    },
    dataType: 'json'
  }).always(reloadApi());
});
