![Skyline](http://skyline.is/avatar-7aab8b54.png)

# Skyline
Evolving CSS Architecture

### Introduction
Skyline is a starting point for building custom CSS frameworks. The starter kit provides a solid CSS architecture that acts as a scaffolding to support your unique design system. It promotes object-oriented CSS, written in SCSS using BEM notation.

Learn more at http://skyline.is

Take a look at the example pages, with the initial starter styles at [http://crushlovely.github.io/skyline](http://crushlovely.github.io/skyline)

### Credits
Developed by the [Crush & Lovely](http://crushlovely.com) Engineering Team
* Jeff Schram / [@jeffschram](http://twitter.com/jeffschram) / [jeffschram.com](http://jeffschram.com)
* with Adam Becker, Jacob Fentress, & Ryan Buttrey

Feel free to contact Jeff on twitter [@jeffschram](http://twitter.com/jeffschram) with questions, comments, etc. And issues and pull requests are always welcome.


### Setup
We wanted to keep the starter files as lean as possible. This isn't a self-contained app, it has demo images, example HTML, and the Skyline SCSS files in the CSS folder. You'll likely copy the SCSS files into your own app, and use the example HTML files as guides to mark up your own pages.

```
├── css
|   ├── base
|       ├── variables, resets, mixins, global assets like fonts
|   ├── elements
|       ├── styles for base elements (p, ul, img, form, etc.)
|   ├── layout
|       ├── grids, widths, utilities, etc.
|   ├── modules
|       ├── styles for objects/modules you create (.site-header, .hero, .page, .bio, .site-footer, etc.)
|   ├── README.md (credits and info about Skyline SCSS)
|
|   ├── screen.scss (the manifest file that pulls in all the partials and compiles into screen.css)
|
├── images
|   ├── (placeholder images are here for example pages)
|
├── example-forms.html
|
├── example-grids.html
|
├── example-modules.html
|
├── index.html
|
├── README.md

```

### Skyline's architecture is composed of 4 layers.
Base contains global settings, variables, resets, and mixins. These make up the foundation of your CSS.

Elements contains all the global styling for basic stand-alone elements; such as links, quotes, tables, and text.

Layout contains structural helper classes like .container, which restricts content to a consistent max-width, and a responsive grid system as well.

Modules are custom-made components that are used throughout your site. These include global modules like the site header and footer, and other reusable modules like alerts and heroes.

### See it in action
You can view the example pages in a browser, make sure you're compiling the SCSS if you want to see any changes you've made to the Skyline files reflected in the examples.

### Documentation
Extensive docs are in the works, but not yet released. However, Skyline makes it easy by adding detailed documentation in the comments of the scss partials themselves. Descriptions are right next to the actual code, making it simple to learn how it works.

## Copyright
Copyright (c) 2014 Jeff Schram (Crush & Lovely). See LICENSE for further details.
