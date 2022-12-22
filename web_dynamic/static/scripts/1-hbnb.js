$(document).ready(function () {
  const checkList = [];
  $('.popover li input[type="checkbox"]').change(function () {
    let name = $(this).attr('data-name'); 
    if ($(this).is(':checked')) {
      checkList.push(name);
    } else {
      checkList.splice(checkList.indexOf(name), 1);
    }
    let msg = checkList.join(', ');
    if (msg.length > 28){
      msg = msg.slice(0,28) + '...';
    }
    $('.amenities h4').html(msg.length > 0 ? msg : '&nbsp;');
  });
});