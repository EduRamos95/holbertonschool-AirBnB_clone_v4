$(document).ready(function () {
  /*** dict has id to filter amenitiess section ***/
  const checkList = [];
  const checkDictAmenities = {};
  //*** catch a element when change status ***/
  $('.amenities .popover li input[type="checkbox"]').change(function () {
    let name = $(this).attr('data-name');
    /* checkDictAmenities[`$name`] */
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
    console.log(Object.keys(checkDictAmenities))
  });
  
  const checkDictStates = {};
  //*** States catch a element when change status ***/
  $('li#state input[type="checkbox"]').change(function () {
    /* let nameS = $(this).attr('data-name'); */
    /* checkDictStates[`$name`] */
    if ($(this).is(':checked')) {
      checkDictStates[$(this).data('id')] = $(this).data('name');
    } else {
      delete checkDictStates[$(this).data('id')];
    }
    let msg = (Object.values(checkDictStates)).join(', ');
    if (msg.length > 28){
      msg = msg.slice(0,28) + '...';
    }
    $('.locations h4').html(msg.length > 0 ? msg : '&nbsp;');
    console.log(Object.keys(checkDictStates))
  });

  const checkDictCities = {};
  //*** City catch a element when change status ***/
  $('li#city input[type="checkbox"]').change(function () {
    /* let nameS = $(this).attr('data-name'); */
    /* checkDictStates[`$name`] */
    if ($(this).is(':checked')) {
      checkDictCities[$(this).data('id')] = $(this).data('name');
    } else {
      delete checkDictCities[$(this).data('id')];
    }
    let msg = (Object.values(checkDictCities)).join(', ');
    if (msg.length > 28){
      msg = msg.slice(0,28) + '...';
    }
    $('.locations h4').html(msg.length > 0 ? msg : '&nbsp;');
    console.log(Object.keys(checkDictCities))
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

 /* reloadApi(); */
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
          <div class="reviews">
            <h2 data-id=${e.id}><p style="display:inline">Reviews</p>&nbsp<span data-id=${e.id}>show</span></h2>
            <ul></ul>
          </div>
        </article>
        `);
      }
      $('span').click(function () {
        // get place id and select elements inside review class
        const placeId = $(this).data('id');
        console.log(placeId);
        const $span = $(this);
        const $ul = $span.parent().siblings('ul');
    
        if ($span.text() === 'show') {
          $span.text('hide');
    
          // get user's reviews from API
          $.get(`http://127.0.0.1:5001/api/v1/places/${placeId}/reviews`, function (reviews) {
            console.log(reviews);
            const countReviews = reviews.length;
            console.log(countReviews + 'hola');
            $(`.reviews h2[data-id="${placeId}"] p`).html(countReviews + ` Review${countReviews !== 1 ? 's' : ''}`);
            console.log($(`.reviews h2[data-id="${placeId}"]`).text());
            // $('.reviews h2').text(countReviews + 'Review');
            for (const review of reviews) {
            // $('.reviews h2').text(countReviews + `Review <span data-id=${place.id}>hide</span>`);
              const date = new Date(Date.parse(review.updated_at));
              const day = date.getDate();
              const month = date.toLocaleString('en-US', { month: 'long' });
              const year = date.getFullYear();
    
              // get user's who made the reviews from API
              $.get(`http://127.0.0.1:5001/api/v1/users/${review.user_id}`, function (user) {
                $ul.append(`
                <li>
                <h3>From ${user.first_name} ${user.last_name} the ${day}th ${month} ${year}</h3>
                <p>${review.text}</p>
                </li>`
                );
              }).fail((error) => { console.err(error); });
            }
          }).fail((err) => { console.err(err); });
        } else {
          $span.text('show');
          $(`h2[data-id="${placeId}"] p`).text('Reviews');
          $ul.empty();
        }
      });
    },
    dataType: 'json'
  }).always(reloadApi());




  $('button').click(function() {
    let ArrayIdAmenities = (Object.keys(checkDictAmenities).length === 0 ? [] : Object.keys(checkDictAmenities));
    let ArrayIdStates = (Object.keys(checkDictStates).length === 0 ? [] : Object.keys(checkDictStates));
    let ArrayIdCities = (Object.keys(checkDictCities).length === 0 ? [] : Object.keys(checkDictCities));
    console.log(ArrayIdStates);
    reloadApi();
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:5001/api/v1/places_search/',
      data: JSON.stringify(
        {
          "states": ArrayIdStates,
          "cities": ArrayIdCities,
          "amenities": ArrayIdAmenities
        }
      ),
      contentType: 'application/json',
      success: function (data) {
        $('section.places').empty();
        console.log('reques hecho');
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
            <div class="reviews">
              <h2 data-id=${e.id}><p style="display:inline">Reviews</p>&nbsp<span data-id=${e.id}>show</span></h2>
              <ul></ul>
            </div>
          </article>`);
        }
        $('span').click(function () {
          // get place id and select elements inside review class
          const placeId = $(this).data('id');
          console.log(placeId);
          const $span = $(this);
          const $ul = $span.parent().siblings('ul');
      
          if ($span.text() === 'show') {
            $span.text('hide');
      
            // get user's reviews from API
            $.get(`http://127.0.0.1:5001/api/v1/places/${placeId}/reviews`, function (reviews) {
              console.log(reviews);
              const countReviews = reviews.length;
              console.log(countReviews + 'hola');
              $(`.reviews h2[data-id="${placeId}"] p`).html(countReviews + ` Review${countReviews !== 1 ? 's' : ''}`);
              console.log($(`.reviews h2[data-id="${placeId}"]`).text());
              // $('.reviews h2').text(countReviews + 'Review');
              for (const review of reviews) {
              // $('.reviews h2').text(countReviews + `Review <span data-id=${place.id}>hide</span>`);
                const date = new Date(Date.parse(review.updated_at));
                const day = date.getDate();
                const month = date.toLocaleString('en-US', { month: 'long' });
                const year = date.getFullYear();
      
                // get user's who made the reviews from API
                $.get(`http://127.0.0.1:5001/api/v1/users/${review.user_id}`, function (user) {
                  $ul.append(`
                  <li>
                  <h3>From ${user.first_name} ${user.last_name} the ${day}th ${month} ${year}</h3>
                  <p>${review.text}</p>
                  </li>`
                  );
                }).fail((error) => { console.err(error); });
              }
            }).fail((err) => { console.err(err); });
          } else {
            $span.text('show');
            $(`h2[data-id="${placeId}"] p`).text('Reviews');
            $ul.empty();
          }
        });
      },
      dataType: 'json'
    });
  });
});