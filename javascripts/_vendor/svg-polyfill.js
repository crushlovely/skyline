  // SVG Polyfill
  // ----------------------------------
  if (!Modernizr.svg) {
    $("img[src$=svg]").each(function() {
      var img = $(this);
      var svgEnding = /.svg$/;
      img.attr("src", img.attr("src").replace(svgEnding, ".png"));
    });
  }