# Skyline Starter Files
## Basic Skyline Starter HTML and SCSS


### Introduction

Skyline helps you create a design system for your website.  It encourages a well thought-out CSS architecture, and enables you to develop a reusable and maintainable codebase.

This starter kit includes the style files you will use on your site. In most cases, you will copy the contents of the `stylesheets` folder into your own project. Each SCSS partial is self-documented and includes markup examples in the comments. These comments are used in concert with the Skyline Styleguide to generate a living styleguide/pattern library available at [yoursite.com]/styleguide.  The kit also contains HTML files as examples to illustrate how you will write out your markup.

Skyline is minimal, it does not impose a visual style.  It contains many layout and structural helpers, utilities, and basic element and module styles that you will build upon. It is really a starting point, an organized set of files that allow you to create your own custom framework.

### Starter Colophon
The starter files contain as little code as possible.  The structure consists of:

```html
[]fonts
  (open source icon font here)

[]javascripts
  []app
    application.js
  []vendor
    (lots of front-end jquery plugins)
    jquery.skyline.gridguide.js
    jquery.skyline.smartresize.js
    jquery.skyline.styleguide.js
  []utility
    ios-orientationchange-fix.js
    modernizr.js (you will usually create your own custom build)
    respond.js (use if supporting IE8)
    selectivizr.js (use if supporting IE8)

[]stylesheets
  []screen
    []base
      resets, mixins, functions, etc.
    []composition
      grids, widths, utilities, etc.
    []elements
      styles for base elements (p, ul, img, form, input, etc.)
    []modules
      styles for objects/modules you create (.site-header, .hero, .page, .bio, .site-footer, etc.)
```

