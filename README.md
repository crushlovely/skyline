# Skyline Starter Files
## Basic Skyline Starter HTML and SCSS


### Introduction

Skyline helps you create a design system for your website.  It encourages a well thought-out CSS architecture, and enables you to develop a reusable and maintainable codebase.

This starter kit includes the style files you will use on your site. In most cases, you will copy the contents of the `stylesheets` folder into your own project. Each SCSS partial is self-documented and includes markup examples in the comments. The kit also contains HTML files as examples to illustrate how you will write out your markup.

Skyline is a minimal scaffolding, it does not impose a visual style.  It contains many layout and structural helpers, utilities, and basic element and module styles that you will build upon. It is really a starting point, an organized set of files that allow you to create your own custom framework.

### Starter Files
The starter files contain as little code as possible.  The structure consists of:

```
├── fonts
|   ├──  (open source icon font here)
|
├── images
|   ├── (placeholder images are here)
|
├── javascripts
|   ├── app
|   |   ├── application.js
|   ├── vendor
|   |   ├── (lots of front-end jquery plugins)
|   |   ├── jquery.skyline.gridguide.js
|   |   ├── jquery.skyline.smartresize.js
|   |   ├── jquery.skyline.styleguide.js
|   ├── utility
|   |   ├── ios-orientationchange-fix.js
|   |   ├── modernizr.js (you will usually create your own custom build)
|   |   ├── respond.js (use if supporting IE8)
|   |   ├── selectivizr.js (use if supporting IE8)
|
├── stylesheets
|   ├── base
|   |   ├── variables, resets, mixins, functions, etc.
|   ├── elements
|   |   ├── styles for base elements (p, ul, img, form, input, etc.)
|   ├── layout
|   |   ├── grids, widths, utilities, etc.
|   ├── modules
|   |   ├── styles for objects/modules you create (.site-header, .hero, .page, .bio, .site-footer, etc.)
|   ├── vendor
|   |   ├── styles related to plugins

```

### Usage
These starter files are not a working app. Most likely, you'll add these resources into your applications.

If you want a simple route, you can view the index.html page in a browser and it'll work just fine, but you'll need to process the scss yourself once you start making style changes. You can run sass --watch on the stylesheets folder if you have sass installed on your machine, or use something like CodeKit.


### Documentation
Extensive docs are in the works, but not yet released. But Skyline makes it easy by adding detailed documentation in the comments of the scss partials themselves. Descriptions are right next to the actual code, making it simple to learn how it works.

