/**

  jQuery.skyline.styleguide.js
--------------------------------------------------------

  This generates a styleguide based on comments in
  your CSS

  This is in-progress.  We still need to...

  1. Turn this into a jQuery function so we can do
     something like
     $("body").skylineStyleguide();

  2. Add the <style> tag with content from the styles
     located at the bottom of this file

  3. Specify the nav element and main element in the function

  4. Specify the css file in the function

-----------------------------------------------------  */





$(function(){

  // If styleguide page NOTE: this would be better if this was a jquery plugin and this js could
  // be called on the body

  if($(".sg").length > 0) {


    /* @parse-stylesheet
    --------------------------------------------------------
      Get the stylesheet and create the styleguide
      markup
    ------------------------------------------------------ */

    var file_path = "/stylesheets/",
        file_name = "screen.css";

    var sg_main = $(".sg-main"),
        sg_nav  = $(".sg-nav");

    $.get(file_path+file_name, null, function(data) {

      // Find all comments in css
      var comments = data.match(/\/\*[\s\S]*?\*\//g);

      // For each comment
      $.each(comments, function(c){

        var comment_type = "",
            current_class = "",
            current_category = "",
            markup = "";

        // If Item
        if(comments[c].substr(0, 4) == "/* @") { comment_type = "item"; }

        // If Category
        if(comments[c].substr(0, 3) == "/**") { comment_type = "category";  }

        // If Class
        if(comments[c].substr(0, 4) == "/***") { comment_type = "class"; }

        // If Intro
        if(comments[c].substr(0, 5) == "/****") { comment_type = "intro"; }


        // Process Class
        // -------------------------------------------
        if(comment_type == "class") {
          resetVars();
          commentLines = comments[c].split("\n");
          // For each line in this commment
          $.each(commentLines, function(l){
            var line = commentLines[l];
            // Open
            if (l == 2) {
              curr_name = line.substr(3);
              curr_class = curr_name.replace(/\s+/g, '-').toLowerCase();
              markup += "<section class='sg-class' data-sg='"+curr_class+"'>";
              markup += "<h1 class='sg-class__title'>" + curr_name + "</h1>";
            }
            // Process Lines
            if (l  > 2) {
              markup += "<p>"+l+" "+curr_name+"</p>";
            }
            // Close
            if (l == commentLines.length - 1) {
              markup += "</section>";
              sg_main.append(markup);
            }
          });
        }


        // Process Category
        // -------------------------------------------
        if(comment_type == "category") {
          resetVars();
          commentLines = comments[c].split("\n");
          // For each line in this commment
          $.each(commentLines, function(l){
            var line = commentLines[l];
            // Open
            if (l == 2) {
              curr_name = line.substr(3);
              curr_category = curr_name.replace(/\s+/g, '-').toLowerCase();
              markup += "<article class='sg-category' data-sg='"+curr_class+" "+curr_category+"'>";
              markup += "<h2 class='sg-category__title'>" + curr_name + "</h2>";
            }
            // Process Lines
            if (l > 2) {
              markup += "<p>"+l+"</p>";
            }
            // Close
            if (l == commentLines.length - 1) {
              markup += "</article>";
              sg_main.append(markup);
            }
          });

        }


        // Process Item
        // -------------------------------------------
        if(comment_type == "item") {
          resetVars();
          commentLines = comments[c].split("\n");
          // For each line in this commment
          $.each(commentLines, function(l){
            var line = commentLines[l];
            // Open
            if (l == 0) {
              curr_name = line.substr(4);
              curr_item = curr_name.replace(/\s+/g, '-').toLowerCase();
              markup += "<div class='sg-item' data-sg='"+curr_class+" "+curr_category+" "+curr_item+" '>";
              markup += "<h3 class='sg-item__title'>" + curr_name + "</h3>";
            }
            // Process Lines
            if (l > 0) {
              processLine(line);
            }
            // Close
            if (l == commentLines.length - 1) {
              markup += "</div>";
              sg_main.append(markup);
            }
          });
        }

        // Add markup
        if (c == comments.length - 1) {
          sg_main.append(markup);
        }


        // Process Lines
        function processLine(line) {
          // If line is -----
          if(line == "") {
            markup += "<br/>Empty<br/>";
          }
          else {
            var processed_line = "";
            lines = line.split(" ");
            lines.forEach(function( word ){
              // wrap code
              if( word.substr(0,1) == ".") { word = "<code class='classname'>"+word+"</code>"; }
              if( word.substr(0,1) == "$") { word = "<code class='variable'>"+word+"</code>"; }
              if( word.substr(0,1) == "%") { word = "<code class='silent-classname'>"+word+"</code>"; }
              if( word.substr(0,4) == "http") { word = "<a href='"+word+"'>"+word+"</a>"; }
              if( word.substr(0,5) == "Note:") { word = "<b>"+word+"</b>"; }
              processed_line = processed_line + " " + word;
            });
            markup += processed_line;
          }
        }

        // Reset vars
        function resetVars() {
          // Reset lineFlags
          var flag_example        = false,
              flag_usage          = false,
              flag_description    = false,
              flag_paragraph      = "",
              processed_line      = "",
              description         = "",
              example             = "",
              usage               = "";
        }

      }); // each comment

    });  // get stylesheet






     /* @styleguide hash
    --------------------------------------------------------
      Jump to hash if in url
    ------------------------------------------------------ */
    setTimeout(function(){
      if( location.hash ) {
        var desiredLocation = location.hash;
        location.hash = "";
        location.hash = desiredLocation;
        $("a[href="+desiredLocation+"]").addClass("active");
      }
    }, 500);


    /* @styleguide nav
    --------------------------------------------------------
      UI/Behavior for styleguide nav
    ------------------------------------------------------ */

    $("body").delegate(".sg-nav__links a", "click", function(){
      $(".sg-nav a.active").removeClass("active");
      $(this).addClass("active");
    });



    /* @examples
    --------------------------------------------------------
      UI/Behavior for examples
    ------------------------------------------------------ */

    setTimeout(function(){
      $(".sg-example").each(function(){
        $this = $(this);
        $sgShowCodeEncoded = $this.html().replace(/>/g,'&gt;');
        $sgShowCodeEncoded = $sgShowCodeEncoded.replace(/</g,'&lt;');
        $sgShowCodeContent = $("<article class='sg-show-code'><a href='#' class='sg-show-code__control'></a><pre class='language-html sg-show-code__content'>"+$sgShowCodeEncoded+"</pre></article>");
        $this.append($sgShowCodeContent);
      });
      $(".sg-show-code__control").click(function(){
        $(this).toggleClass("is-active").next('.sg-show-code__content').toggleClass("is-active");
      });

      // Prism.highlightAll();

    }, 500);



 } // end if .sg element exisist


}); // jquery on ready