/* Change nav on scroll */

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


/* Isotope */

$('.photos').isotope({
  itemSelector: '.insta-photo',
  layoutMode: 'masonry',
  percentPosition: true,
  masonry: {
    // use element for option
    columnWidth: '.grid-sizer'
  }
});

var $projects = $('#work .projects').isotope({
  itemSelector: '.project'
});

// layout Isotope after each image loads
$projects.imagesLoaded({ background: true }).progress( function() {
  $projects.isotope('layout');
  console.log('layout');
});

// filter items on button click
$('.project-categories').on('click', 'li', function() {
  $(this).siblings().removeClass('active');
  $(this).addClass('active');

  var filterValue = $(this).attr('data-filter');
  $projects.isotope({ filter: filterValue });
});


/* Hero controls */

$('.control').hover(function() {
  $(this).next().addClass('active');
}, function() {
  $(this).next().removeClass('active');
});


/* Arrow key navigation for projects */

$("body").on('keydown', function(e) {
  if (e.which == 37) { // left key
    window.location.href = $('.control-left').parent().attr('href');
  }
  else if (e.which == 39) { // right key
    window.location.href = $('.control-right').parent().attr('href');
  }
});
