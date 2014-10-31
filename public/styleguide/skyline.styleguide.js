/**

  jQuery.skyline.styleguide.js
--------------------------------------------------------

  This generates a styleguide based on comments in
  your CSS

  This is in-progress.  We still need to...

  1. Turn this into a jQuery function so we can do
     something like
     $("body").styleguide();

  2. Add the <style> tag with content from the styles
     located at the bottom of this file

  3. Eliminate the need for any markup in the target
     HTML file, this js should generate everything and
     be the only thing you need to create a styleguide

     <section class="sg container">

      <header class="sg-header">
        <nav class="sg-nav">
          <h1 class="sg-title">Styleguide</h1>
          <p class="sg-subtitle">Styleguide to show to use the skyline resources and to show how everything looks in this app</p>
          <ul class="sg-nav nav--list">
            <!-- filled with js -->
          </ul>
        </nav>
      </header>


        <main class="sg-main">
          <!-- filled with js -->
        </main>

    </section>

    <!-- Styleguide specific stylesheet -->
    <%= stylesheet_link_tag "styleguide" %>
    <!-- Styleguide js for prettyprint -->
    <script src="https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js"></script>

-----------------------------------------------------  */





$(function(){

  // If styleguide page NOTE: this would be better if this was a jquery plugin and this js could
  // be called on the body

  if($(".sg").length > 0) {

    $(".site-header").remove();


    /* @parse-stylesheet
    --------------------------------------------------------
      Get the stylesheet and create the styleguide
      markup
    ------------------------------------------------------ */

    var file_path = "../stylesheets/",
        file_name = "screen.css";


    $.get(file_path+file_name, null, function(data) {

      // Find all comments in css
      var comments = data.match(/\/\*[\s\S]*?\*\//g);

      // Empty out the target div
      $(".sg-main").empty();

      // For each comment
      $.each(comments, function(c){

        // Reset lineFlags
        var flag_class                = false,
            flag_category             = false,
            flag_item                 = false,
            flag_example              = false,
            flag_usage                = false,
            flag_description          = false,
            flag_class_partial        = false,
            flag_category_partial     = false,
            flag_paragraph            = "",
            processed_line            = "";


        // Reset markup
        var markup = "";

        // Reset description
        var description = "";

        // Reset example
        var example = "";

        // Reset usage
        var usage = "";


        // Split comment into lines
        commentLines = comments[c].split("\n");

        // For each line in this commment
        $.each(commentLines, function(l){

          var line = commentLines[l];


          // console.log(line);


          // Class
          // -------------------------------------------
          // detect class
          if ( line == "/***") {
            flag_class = true;
            markup = "<div class='sg-section--class'><h1 class='sg-class'";
            // add markup to main
            $(".sg-main").append(markup);
          }
          // while class is true
          if (flag_class == true){

            // if this line is empty
            if(line.length < 1 ) { line = ""; }

            // and if we come to a @waypoint title which are on the 3rd line
            if (line.substring(0, 3) == "  @" && l == 2) {
              // complete class h1 markup
              markup = markup+" id='"+line.substr(3)+"'>"+line.substr(3)+"</h1>";
              // add markup to main
              $(".sg-main").append(markup);
              // add to nav
              $(".sg-nav__links").append("<li class='sg-nav__title'>"+line.substr(3)+"<li>");
            }

            // begin description
            if(line.substr(0, 4) == "----" ) {
              flag_description = true;
            }

            // close out the class and end description
            if(line.substr(0, -2) == "*/") {
              flag_class = false;
              markup = "</div>";
              // add markup to main
              $(".sg-main").append(markup);
            }

          } // end creating a class



          // Categories
          // -------------------------------------------
          // detect category
          if ( line == "/**") {
            flag_category = true;
          }
          // while category is true
          if (flag_category == true) {
            // get rid of empty line
            if (line.length < 1) { line = ""; }
            // and if we come to a @waypoint title which are on the 3rd line
            if (line.substring(0, 3) == "  @" && l == 2) {
              // define h2 markup
              markup = markup + "<div class='sg-section--category'><h2 class='sg-section__title l-"+l+"'>"+line.substr(3)+"<a class='sg-category__anchor' id='"+line.substr(3)+"'></a></h2>";
              // add markup to main
              $(".sg-main").append(markup);
              // add to sub nav
              $(".sg-nav__links").append("<li><a href='#"+line.substr(3)+"'>"+line.substr(3)+"</a><li>");
            }

            // If making a partial
            if ( l == 4 && line.substr(0, 3) == "  _") {
              $(".sg-main").append("<span class='sg-partial sg-partial--class'>"+line+"</span>");
            }

            // begin description
            if(line.substr(0, 4) == "----" && l == 5) {
              flag_description = true;
            }

            // close out the category and end description
            if(line.substr(0, -2) == "*/") {
              flag_category = false;
              markup = "</div>";
              // add markup to main
              $(".sg-main").append(markup);
            }

          } // end if creating category


          // Partial Logic
          // -------------------------------------------


          // Item logic
          // -------------------------------------------
          // reset flag item because these are only one line
          if ( line.substring(0, 4) == "/* @") {
            // Remove those characters and create heading
            markup = "<h3 class='sg-subsection__title' id='"+line.substr(4)+"'>"+line.substr(4)+"</h3>";
            $(".sg-main").append(markup);
            markup = "";
            flag_item = true;
          }
          // while in item
          if(flag_item == true) {
            // begin description
            if(line.substr(0, 4) == "----") {
              flag_description = true;
            }

            // close out the item and end description
            if(line.substr(0, -2) == "*/") {
              flag_item = false;
              markup = "</div>";
              // add markup to main
              $(".sg-main").append(markup);
            }
          }


          // While in description
          // -------------------------------------------
          if(flag_description == true) {

            // console.log("DESC ORIG", line);

            // Paragraphs
            // -----------------------------------------
            // If line is a separator
            if (line.substr(0, 4) == "----") {
              line = "";
              // console.log('line was separator');
              if(flag_paragraph == "open") {
                // console.log('separator: p was open');
                line = line + "</div>";
                flag_paragraph = "closed";
                // close out description
                flag_description = false;

              } else {
                // console.log('separator: p was not open');
                line = line + "";
                flag_paragraph = "closed";
                // console.log('separator: p is now closed');
              }
            }
            // If line is empty
            if (line.length < 1) {
              // console.log('empty line', 'pflag is', flag_paragraph);
              // if paragraph is open, close it
              if (flag_paragraph == "open") {
                // console.log('p was open');
                line = "</div><div class='sg-desc was-open'>"+line;
              }
              // paragrph is closed, open it
              if (flag_paragraph == "closed") {
                // console.log('p was closed');
                line = line+"<div class='sg-desc was-closed'>";
                flag_paragraph = "open";
                // console.log('p now open');
              }
              // if we're making an example, close example, add to examples
              if ( flag_example == true ) {
                // close example article and subsection
                example = example+"</article>";
                flag_example = false;
                // console.log('EXAMPLE', example.substr(0, 70));
                $(".sg-main").append(example);
              }
              // if we're making a usage, close usage, add to usages
              if ( flag_usage == true ) {
                // close usage pre
                usage = usage+"</pre>";
                flag_usage = false;
                // console.log('EXAMPLE', example.substr(0, 70));
                $(".sg-main").append(usage);
              }

            }

            // If line is not empty
            else {
              // If separator
              if(line.substr(4) == "----") {
                line = "";
              }

              // Example logic
              // -------------------------------------------
              if ( line.substr(0, 10) == "  Example:") {
                example = "";
                flag_example = true;
              }

              // if making an example and we're coding
              if ( flag_example == true ) {
                 if (line.substr(0, 10) == "  Example:") {
                    example = example+"<article class='sg-example' title='"+line+"'>";
                 } else {
                   example = example + line+"\n";
                 }
              }

              // Usage logic
              // -------------------------------------------
              if ( line.substr(0, 8) == "  Usage:") {
                usage = "";
                flag_usage = true;
              }

              // if making an example and we're coding
              if ( flag_usage == true ) {
                 if ( line.substr(0, 8) == "  Usage:") {
                    usage = "<b>"+line+"</b>"+usage+"<pre class='sg-usage'>";
                 } else {
                   usage = usage + line+"\n";
                 }
              }

            } // end if description line is not empty

            // append description if not example or usage
            // -------------------------------------------
            if( flag_example == false && flag_usage == false) {
              // Process the line
              processed_line = "";
              var line_is_note = false;
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

              $(".sg-main").append(processed_line);
            }
          } // end while in description






        }); // each line in comment

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

    }, 500);



 } // end if .sg element exisist


}); // jquery on ready