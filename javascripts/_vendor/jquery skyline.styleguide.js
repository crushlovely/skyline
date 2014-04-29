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
          <p class="sg-subtitle">Styleguide to show to use the Manhattan resources and to show how everything looks in this app</p>
          <ul class="sg-nav nav--list">
            <!-- filled with js -->
          </ul>
        </nav>
      </header>


        <main class="sg-main">
          <!-- filled with js -->
        </main>

    </section>


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

    var file_path = "/css/",
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
            flag_description          = false,
            flag_class_partial        = false,
            flag_category_partial     = false,
            flag_paragraph            = "",
            processed_line            = "";


        // Reset markup
        var markup = "";

        // reset description
        var description = "";

        // reset example
        var example = "";


        // Split comment into lines
        // commentLines = comments[c].match(/[^\r\n]+/g);
        commentLines = comments[c].split("\n");

        // For each line in this commment
        $.each(commentLines, function(l){

          var line = commentLines[l];


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

            } // end if description line is not empty

            // append description if not example
            // -------------------------------------------
            if( flag_example == false) {
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




    /* @prettyprint
    --------------------------------------------------------
      Make the code examples purdy
    ------------------------------------------------------ */

    $(".prettyprint").each(function(){
      $this = $(this);
      $this.html( $this.html().replace(/</g,'&lt;') );
      $this.html( $this.html().replace(/>/g,'&gt;') );
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
        $sgShowCodeControl = $("<a href='#' class='sg-show-code__control'></a>");
        $sgShowCodeContent = $("<pre class='prettyprint sg-show-code__content'>"+$sgShowCodeEncoded+"</pre>");
        $this.append($sgShowCodeControl).append($sgShowCodeContent);
      });
      $(".sg-show-code__control").click(function(){
        $(this).toggleClass("active").next('.sg-show-code__content').toggleClass("active");
      });
    }, 500);



 } // end if .sg element exisist


}); // jquery on ready




/**

  Use these styles in this thang
--------------------------------------------------------

 STYLEGUIDE

 .sg is used to namespace styleguide

// Header & Nav
// @header
.sg-header {
  background: #f6f6f6;
  width: 15rem;
  position: fixed;
  overflow-y: scroll;
  top: 0;
  bottom: 0;
  left: 0;
}
.sg-title {
  font-size: 1rem;
  font-weight: 500;
  color: #363636;
  margin: 0;
  padding: 2rem 2rem 0 2rem;
}
.sg-subtitle {
  font-size: .8rem;
  color: #363636;
  margin: 0 0 1rem 0;
  padding: 0 2rem 1rem;
  line-height: 1.5;
}

.sg-nav {
  margin: 1rem 0 0 0;
  padding: 0;
}
.sg-nav ul {
  padding: 0 0 2rem 0;
}

.sg-nav__title {
  font-size: .8rem;
  font-weight: 100;
  color: #363636;
  margin: 0;
  padding: 0 2rem .25rem;
  text-transform: uppercase;
}
.sg-nav li a {
  font-size: .8rem;
  display: block;
  font-size: 1rem;
  font-weight: 500;
  padding: .25rem 0 .25rem 2rem;
  color: #363636;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  &:active {
    background: rgba(0,0,0,.02);
  }
  &:hover,
  &.active {
    opacity: 1;
    background: rgba(0,0,0,.03);
    text-decoration: none;
    border-bottom: 1px solid transparent;
  }
  &.active {
    background: rgba(0,0,0,.05);
  }
}


// Styleguide Main Content
// @main
.sg-main {
  position: fixed;
  overflow-y: scroll;
  top: 0;
  bottom: 0;
  right: 0;
  left: 15rem;
  background: white;
  padding: 0 4rem;
}

// Styleguide Classes
// @sg-class
  .sg-class {
    font-size: 3rem;
    text-transform: capitalize;
    margin: 2rem 0;
    border-bottom: 3px solid black;
  }


// Styleguide Sections
// @sections
.sg-section {
  margin-bottom: 4rem;
  padding-top: 2rem;
  max-width: 70rem;
}
.sg-section__title {
  margin-bottom: 2rem;
  font-size: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #363636;
  font-weight: 500;
  color: #363636;
}


// Styleguide entries
// @entries
.sg-subsection {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
}
.sg-subsection__title {
  font-size: 1.5rem;
  line-height: 1.35;
  font-weight: 500;
  color: #363636;
  border-left: 1.75rem solid #d3d3d3;
  padding-left: .5rem;
  margin: 2em 0 .5em;
}


// Styleguide things
.sg-note {
  color: #b9b9b9;
  font-style: italic;
  font-family: georgia, serif;
}


// Styleguide example
.sg-example {
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 4rem 3rem 0 3rem;
  margin: 1rem 0 2rem;
  position: relative;
  &:after {
    content: attr(title);
    display: inline-block;
    color: #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-bottom-right-radius: 3px;
    font-size: .5rem;
    text-transform: uppercase;
    position: absolute;
    padding: .5rem;
    top: 0;
    left: 0;
    font-weight: 800;
  }
  pre.prettyprint {
    margin-left: -3rem;
    margin-right: -3rem;
    margin-bottom: 0;
    border-radius: 0;
    border-bottom: none !important;
    border-right: none !important;
    border-left: none !important;
  }
}

// Example generated code
.sg-show-code__control {
  position: relative;
  bottom: -2.5rem; // to cover border of the element below it.
  float: right;
  color: #ddd;
  font-size: .5rem;
  text-transform: uppercase;
  margin-right: -2.5rem;
  padding: .5rem;
  font-weight: 800;
  text-decoration: none;
  &:hover {
    color: #666;
  }
  &:active {
    color: #eee;
  }
  &:before {
    content: "Show Code + ";
  }
  &.active:before {
    content: "Hide Code -";
  }
}
pre.prettyprint.sg-show-code__content {
  height: 0;
  overflow: hidden;
  padding-top: 3rem !important;
  &.active {
    height: auto;
    padding: 3rem !important
  }
}


// Inline code in a sg-section
.sg-section p code {
  display: inline-block;
  background-color: #f6f6f6;
  padding: .1rem .5rem;
  border: 1px solid #ddd;
  font-size: .7em;
  border-radius: .25rem;
  vertical-align: middle;
}


// Prettified Code --------------------------- //

// desert scheme ported from vim to google prettify
pre.prettyprint { font-size: .7em !important; display: block; background-color: #f6f6f6; padding: 1rem 1.25rem 0 !important; border: 1px solid #ddd !important; font-size: 1rem; border-radius: .25rem; margin: 0 0 2rem 0; }
pre .nocode { background-color: none; color: #000 }
pre .str { color: rgb(6, 133, 145); } // string
pre .kwd { color: #666; }
pre .com { color: #999 } // comment
pre .typ { color: #98fb98 } // type
pre .lit { color: #cd5c5c } // literal
pre .pun { color: #666 }    // punctuation
pre .pln { color: #666 }    // plaintext
pre .tag { color: #666; font-weight: bold } // html/xml tag
pre .atn { color: #666; font-weight: bold } // attribute name
pre .atv { color: #666 } // attribute value
pre .dec { color: #98fb98 } // decimal

// Specify class=linenums on a pre to get line numbering
ol.linenums { margin-top: 0; margin-bottom: 0; color: #AEAEAE } /* IE indents via margin-left
li.L0,li.L1,li.L2,li.L3,li.L5,li.L6,li.L7,li.L8 { list-style-type: none }
// Alternate shading for lines
li.L1,li.L3,li.L5,li.L7,li.L9 { }

@media print {
  pre.prettyprint { background-color: none }
  pre .str, code .str { color: #060 }
  pre .kwd, code .kwd { color: #006; font-weight: bold }
  pre .com, code .com { color: #600; font-style: italic }
  pre .typ, code .typ { color: #404; font-weight: bold }
  pre .lit, code .lit { color: #044 }
  pre .pun, code .pun { color: #999 }
  pre .pln, code .pln { color: #000 }
  pre .tag, code .tag { color: #006; font-weight: bold }
  pre .atn, code .atn { color: #404 }
  pre .atv, code .atv { color: #060 }
}

-----------------------------------------------------  */


