checkScroll();

$(window).scroll(function() {
  checkScroll();
});

function checkScroll() {
  if ($('body').scrollTop() > 0) {
    $('header nav').addClass('scroll');
  } else {
    $('header nav').removeClass('scroll');
  }
}

$('.photos').isotope({
  itemSelector: '.insta-photo',
  layoutMode: 'masonry',
  percentPosition: true,
  masonry: {
    // use element for option
    columnWidth: '.grid-sizer'
  }
});

$('.control').hover(function() {
  $(this).next().addClass('active');
}, function() {
  $(this).next().removeClass('active');
});
