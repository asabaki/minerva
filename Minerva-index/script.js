
  $(document).scroll(function() {
  var y = $(this).scrollTop();
  console.log(y);
  if (y > 50) {
    $('.nav-logo').height('6.8rem');
    $('.nav-logo').css("margin-top","1.5rem");
    $('.nav').css("transition", ".2s all");
    $('.nav-logo').css("transition", ".2s all");
  }
  else {
    $('.nav-logo').height('16rem');
    $('.nav-logo').css("margin-top","10rem");
    $('.nav').css("transition", ".2s all");
    $('.nav-logo').css("transition", ".2s all");
  }
  if (y > 625) {
    $('.nav').css("transition", ".2s all");
    $('.nav').css("box-shadow", "var(--shadow-med)");
  }
  else {
    $('.nav').css("border-bottom", "none");
    $('.nav').css("transition", ".2s all");
    $('.nav').css("box-shadow", "none");
  }
  });


  $( document ).ready(function() {
    console.log( "ready!" );
  });



  // $('select#feature').change(function() {
  //   console.log("selected");
  // });

  $( "select" )
    .change(function () {
      console.log('asdfdsf');
    })
    .change();
