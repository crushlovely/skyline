/**
 * $media jQuery plugin (v.2.1.1)
 *
 * 2012. Created by Oscar Otero (http://oscarotero.com / http://anavallasuiza.com)
 *
 * $media is released under the GNU Affero GPL version 3.
 * More information at http://www.gnu.org/licenses/agpl-3.0.html
 */


(function ($) {
  'use strict';

  //Support detection
  var support = {
    video: document.createElement('video'),
    tests: {},
    check: function (property) {
      if (this.tests[property] === undefined) {
        switch (property) {
          case 'fullscreen':
            this.tests.fullscreen = ((this.video.requestFullScreen || this.video.mozRequestFullScreen || this.video.webkitRequestFullScreen));

          case 'volume':
            this.video.volume = 0.5;
            this.tests.volume = (this.video.volume === 0.5);
            break;

          case 'muted':
          case 'autoplay':
            this.video[property] = true;
            this.tests[property] = (this.video[property] === true);
            break;

          default:
            this.tests[property] = ((property in this.video));
        }
      }

      return this.tests[property];
    }
  };


  //$media constructor
  window.$media = function (element) {
    this.element = element;
    this.$element = $(element);

    if (this.$element.is('video')) {
      this.type = 'video';
    } else if (this.$element.is('audio')) {
      this.type = 'audio';
    }

    //Unify the preload property in all browsers
    if (!this.$element.attr('preload')) {
      this.preload('metadata');
    }
  };

  //Support detection
  window.$media.support = function (property) {
    return support.check(property);
  };



  /**
   * Returns the html audio/video element
   *
   * @return html element
   */
  window.$media.prototype.get = function () {
    return this.element;
  };



  /**
   * Returns the jquery object with the audio/video element
   *
   * @return jQuery object
   */
  window.$media.prototype.$get = function () {
    return this.$element;
  };



  /**
   * Check if the browser can play the source or a specific codec
   * canPlayType();
   * canPlayType('ogg');
   * canPlayType('video/mp4');
   *
   * @param source A specific source to check. If it's not defined, checks the element sources
   *
   * @return false If the browser doesn't support audio/video element
   * @return 0 If the browser supports audio/video element but can't play the sources/specific codec
   * @return 1 If the browser maybe can play
   * @return 2 If the browser probably can play
   */
  window.$media.prototype.canPlayType = function (source) {
    var length, result, r, i;

    if (!(this.element.canPlayType)) {
      return false;
    }

    if (source === undefined) {
      if (this.source()) {
        return this.canPlayType(this.source());
      }

      source = this.source(true);
    }

    if ($.isArray(source)) {
      length = source.length;
      result = 0;

      for (i = 0; i < length; ++i) {
        r = this.canPlayType(source[i]);
        result = (r > result) ? r : result;
      }

      return result;
    }

    if (source.indexOf('.') !== -1) {
      source = (source.substring(source.lastIndexOf('.') + 1)).toLowerCase().split('#', 2)[0];
    }

    if (/^[a-z0-9]+$/i.test(source)) {
      source = this.mimeType(source);
    }

    if (source) {
      switch (this.element.canPlayType(source)) {
        case 'probably':
          return 2;

        case 'maybe':
          return 1;
      }
    }

    return 0;
  };


  /**
   * Alias of readyState(1, fn), execute a function when the media element is ready to start playing
   *
   * @param function fn A function to execute when the media element is ready
   *
   * @return this
   */
  window.$media.prototype.ready = function (fn) {
    return this.readyState(1, fn);
  };



  /**
   * Returns the current readyState property or binds a function when some the readyState becomes
   *
   * @param number state One of the four available states
   * @param function fn A function to bind to the event
   *
   * @return this (for bind event)
   * @return boolean/number (for getters)
   */
  window.$media.prototype.readyState = function (state, fn) {
    if (arguments.length === 0) {
      return this.element.readyState;
    }

    if (arguments.length === 1) {
      return (this.element.readyState >= state) ? true : false;
    }

    if (this.element.readyState >= state) {
      $.proxy(fn, this)();
    } else {
      var that = this;

      setTimeout(function () {
        that.readyState(state, fn);
      }, 100);
    }

    return this;
  };


  /**
   * Returns the current networkState property
   *
   * @param number state One of the three available states
   *
   * @return this (for bind event)
   * @return boolean/number (for getters)
   */
  window.$media.prototype.networkState = function (state) {
    if (arguments.length === 0) {
      return this.element.networkState;
    }

    return (this.element.networkState === state) ? true : false;
  };



  /**
   * Get/set the playback rate or bind a function to ratechange event
   * If the browser doesn't support playbackRate property does nothing
   *
   * playbackRate()
   * playbackRate(0.5)
   * playbackRate(fn)
   *
   * @param float/function fn The new playback rate or the function to bind to ratechange event
   *
   * @return this (for setters)
   * @return float (for getters)
   */
  $media.prototype.playbackRate = function (fn) {
    if (support.check('playbackRate') === false) {
      return (arguments.length === 0) ? 1 : this;
    }

    if ($.isFunction(fn)) {
      return this.on('ratechange', fn);
    }

    if (fn === undefined) {
      return this.element.playbackRate;
    }

    if (this.element.playbackRate !== fn) {
      this.element.playbackRate = fn;

      if (this.element.playbackRate !== fn) {
        support.playbackRate = false;
      } else {
        return this.triggerHandler('ratechange');
      }
    }

    return this;
  }



  /**
   * Gets the source type for a specific extension
   *
   * @param string ext The extension (for example 'ogg', 'mp3', etc)
   *
   * @return string The mimetype of the extension (for example 'video/ogg').
   * @return undefined If the extension is not valid.
   */
  window.$media.prototype.mimeType = function (ext) {
    switch (ext) {
      case 'mp4':
      case 'acc':
        return this.type + '/mp4';

      case 'ogg':
      case 'ogv':
      case 'oga':
        return this.type + '/ogg';

      case 'webm':
        return this.type + '/webm';

      case 'mp3':
        return this.type + '/mpeg';

      case 'wav':
        return this.type + '/wav';
    }
  };


  /**
   * Get/set the sources for the media element
   *
   * source();
   * source('my-video.ogv');
   * source(['my-video.ogv', 'my-video.mp4']);
   * source({src: 'my-video.ogv', type: 'video/ogv'});
   * source([{src: 'my-video.ogv', type: 'video/ogv'}, {src: 'my-video.mp4', type: 'video/mp4'}]);
   *
   * @param string/array/object sources The new sources for the element.
   *
   * @return string/array (for getter)
   * @return this (for setter)
   */
  window.$media.prototype.source = function (sources) {
    var $media = this.$element;

    //Getter
    if (sources === undefined) {
      return this.element.currentSrc;
    }

    if (sources === true) {
      var src = [];

      if ($media.attr('src')) {
        src.push($media.attr('src'));
      }

      $media.find('source').each(function () {
        src.push($(this).attr('src'));
      });

      return src;
    }

    //Setter
    $media.find('source').remove();

    if (typeof sources === 'string') {
      $media.attr('src', sources);
    } else {
      if (!$.isArray(sources)) {
        sources = [sources];
      }

      $media.removeAttr('src');

      var that = this;

      $.each(sources, function (k, source) {
        if (typeof source !== 'object') {
          source = {src: source};
        }

        if (!source.type) {
          var ext = (source.src.substring(source.src.lastIndexOf('.') + 1)).toLowerCase().split('#', 2)[0];
          source.type = that.mimeType(ext);
        }

        $('<source>', source).appendTo($media);
      });
    }

    this.element.load();

    return this;
  };



  /**
   * Get or set loop property.
   *
   * loop();
   * loop(true);
   * loop(false);
   *
   * @param boolean True for activate loop, false for don't
   *
   * @return boolean (for getter)
   * @return this (for setter)
   */
  window.$media.prototype.loop = function (value) {
    if (arguments.length === 0) {
      return this.element.loop;
    }

    this.element.loop = value;

    return this;
  };



  /**
   * Get or set autoplay property.
   *
   * autoplay();
   * autoplay(true);
   * autoplay(false);
   *
   * @param boolean True for activate autoplay, false for don't
   *
   * @return boolean (for getter)
   * @return this (for setter)
   */
  window.$media.prototype.autoplay = function (value) {
    if (support.check('autoplay') === false) {
      return (arguments.length === 0) ? false : this;
    }

    if (arguments.length === 0) {
      return this.element.autoplay;
    }

    this.element.autoplay = value;

    return this;
  };



  /**
   * Get or set controls property.
   *
   * controls();
   * controls(true);
   * controls(false);
   *
   * @param boolean True for activate controls, false for don't
   *
   * @return boolean (for getter)
   * @return this (for setter)
   */
  window.$media.prototype.controls = function (value) {
    if (arguments.length === 0) {
      return this.element.controls;
    }

    this.element.controls = value;

    return this;
  };



  /**
   * Get or set poster attribute.
   *
   * poster();
   * poster('new-poster.jpg');
   * poster('');
   *
   * @param string The new value for poster attribute
   *
   * @return string (for getter)
   * @return this (for setter)
   */
  window.$media.prototype.poster = function (value) {
    if (arguments.length === 0) {
      return this.element.poster;
    }

    this.element.poster = value;

    return this;
  };



  /**
   * Get or set preload attribute.
   *
   * preload();
   * preload('metadata');
   * preload('');
   *
   * @param string The new value for preload attribute
   *
   * @return string (for getter)
   * @return this (for setter)
   */
  window.$media.prototype.preload = function (value) {
    if (arguments.length === 0) {
      return this.element.preload;
    }

    this.element.preload = value;

    return this;
  };



  /**
   * Get or set the width of the media element
   *
   * width();
   * width(true);
   * width(234);
   *
   * @param bool/int videoWidth Set true to return the real width of the video. Set number to change the width of the video
   *
   * @return integer (for getter)
   * @return this (for setter)
   */
  window.$media.prototype.width = function (videoWidth) {
    if (videoWidth === true) {
      return this.element.videoWidth;
    }

    if (arguments.length === 0) {
      return this.$element.width();
    }

    this.$element.width(videoWidth);

    return this;
  };


  /**
   * Get or set the height of the media element
   *
   * height();
   * height(true);
   * height(234);
   *
   * @param bool/int videoHeight Set true to return the real height of the video. Set number to change the height of the video
   *
   * @return integer (for getter)
   * @return this (for setter)
   */
  window.$media.prototype.height = function (videoHeight) {
    if (videoHeight === true) {
      return this.element.videoHeight;
    }

    if (arguments.length === 0) {
      return this.$element.height();
    }

    this.$element.height(videoHeight);

    return this;
  };


  /**
   * Plays the media or adds a play event listener
   *
   * play (fn)
   * play ()
   *
   * @param function fn The function to the event listener
   *
   * @return this
   */
  window.$media.prototype.play = function (fn) {
    if ($.isFunction(fn)) {
      this.on('play', fn);
    } else if (this.element.paused) {
      this.element.play();
    }

    return this;
  };


  /**
   * Return if the media is playing or bind a function to playing event
   *
   * playing (fn)
   * playing ()
   *
   * @param function fn The function to the event listener
   *
   * @return bool True if the media is playing, false if not
   * @return this On bind event
   */
  window.$media.prototype.playing = function (fn) {
    if ($.isFunction(fn)) {
      this.on('playing', fn);

      return this;
    }

    return (this.element.paused || this.element.ended) ? false : true;
  };


  /**
   * Toggles fullscreen mode or binds a function to fullscreen event
   * This method works only in webkit and mozilla platforms
   *
   * function fullScreen (fn)
   * function fullScreen (true)
   * function fullScreen (false)
   * function fullScreen ()
   *
   * @param function/bool fn The function to the event listener. Set true or false to enter or exit of fullscreen
   *
   * @return this
   */
  window.$media.prototype.fullScreen = function (fn) {
    if ($.isFunction(fn)) {
      this.on('fullScreen', fn);
      return this;
    }

    if (fn === false) {
      if ($.isFunction(document.webkitCancelFullScreen)) {
        document.webkitCancelFullScreen();
      } else if ($.isFunction(document.mozCancelFullScreen)) {
        document.mozCancelFullScreen();
      }
    } else if (fn === true) {
      if ($.isFunction(this.element.webkitRequestFullScreen)) {
        this.element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if ($.isFunction(this.element.mozRequestFullScreen)) {
        this.element.mozRequestFullScreen();
      }
    } else {
      if (document.mozFullScreen || document.webkitIsFullScreen) {
        this.fullScreen(false);
      } else {
        this.fullScreen(true);
      }
    }

    return this;
  };



  /**
   * Return if the media is waiting or bind a function to waiting event
   *
   * waiting (fn)
   * waiting ()
   *
   * @param function fn The function to the event listener
   *
   * @return bool True if the media is waiting, false if not
   * @return this On bind event
   */
  window.$media.prototype.waiting = function (fn) {
    if ($.isFunction(fn)) {
      this.on('waiting', fn);

      return this;
    }

    return this.readyState(3) ? false : true;
  };


  /**
   * Pauses the media or adds a play event listener
   *
   * pause (fn)
   * pause ()
   *
   * @param function fn The function to the event listener
   *
   * @return this
   */
  window.$media.prototype.pause = function (fn) {
    if ($.isFunction(fn)) {
      return this.on('pause', fn);
    }

    if (!this.element.paused) {
      this.element.pause();
    }

    return this;
  };


  /**
   * Toggle between play and pause, or bind a function to playPause event
   * playPause event is not the same than play or pause events (separately)
   *
   * function playPause (fn)
   * function playPause ()
   *
   * @param function fn The function to the event listener
   *
   * @return this
   */
  window.$media.prototype.playPause = function (fn) {
    if ($.isFunction(fn)) {
      return this.on('playpause', fn);
    }

    if (this.element.paused) {
      this.play();
    } else {
      this.pause();
    }

    return this.triggerHandler('playpause');
  };


  /**
   * Stops media (pauses, goes to start and stops loading the sources) or bind a function to stop event
   *
   * function stop (fn)
   * function stop ()
   *
   * @param function fn The function to the event listener
   *
   * @return this
   */
  window.$media.prototype.stop = function (fn) {
    if ($.isFunction(fn)) {
      return this.on('stop', fn);
    }

    return this.pause().reload().trigger('stop');
  };


  /**
   * Returns if it has reached the end of media or adds a ended event listener
   *
   * ended (fn)
   * ended ()
   *
   * @param function fn The function to the event listener
   *
   * @return bool True if the media is ended, false if not
   * @return this On bind event
   */
  window.$media.prototype.ended = function (fn) {
    if ($.isFunction(fn)) {
      return this.on('ended', fn);
    }

    return this.element.ended;
  };


  /**
   * Removes the video/audio element or bind a function to remove event
   *
   * remove (fn)
   * remove ()
   *
   * @param function fn The function to the event listener
   *
   * @return this On bind event
   */
  window.$media.prototype.remove = function (fn) {
    if ($.isFunction(fn)) {
      return this.on('remove', fn);
    }

    this.triggerHandler('remove').$element.remove();

    var prop;

    for (prop in this) {
      if (this.hasOwnProperty(prop)) {
        this[prop] = null;
      }
    }
  };


  /**
   * Seek for specific point of media or adds a seek event listener
   *
   * seek (fn)
   * seek (23)
   * seek ('+23')
   * seek ('05:04')
   * seek ('50%')
   * ...
   *
   * @param function/string/int fn The function to the event listener or the point to seek
   *
   * @return this
   */
  window.$media.prototype.seek = function (fn) {
    if ($.isFunction(fn)) {
      return this.on('seeked', fn);
    }

    var time = fn;

    this.readyState(1, function () {
      time = this.time(time);

      if (this.element.currentTime !== time) {
        var element = this.element;
        var fn = function () {
          try {
            element.currentTime = time;
          } catch(err) {
            window.setTimeout(fn, 100);
          }
        };

        fn();
      }
    });

    return this;
  };


  /**
   * Return if the media is seeking or bind a function to seeking event
   *
   * seeking (fn)
   * seeking ()
   *
   * @param function fn The function to the event listener
   *
   * @return bool True if the media is seeking, false if not
   * @return this On bind event
   */
  window.$media.prototype.seeking = function (fn) {
    if ($.isFunction(fn)) {
      this.on('seeking', fn);

      return this;
    }

    return this.element.seeking;
  };


  /**
   * Set/set the volume value of media or bind a function to volume event
   *
   * volume (fn)
   * volume (0.5)
   * volume ()
   *
   * @param function/float fn The function to the event listener or the new volume value (0-1 range)
   *
   * @return float (for getter)
   * @return this (for setter / on bind event)
   */
  window.$media.prototype.volume = function (fn) {
    if (support.check('volume') === false) {
      return (arguments.length === 0) ? 1 : this;
    }

    if (arguments.length === 0) {
      return this.element.volume;
    }

    if ($.isFunction(fn)) {
      return this.on('volumechange', fn);
    }

    if (typeof fn === 'string') {
      if (fn.indexOf('+') === 0) {
        fn = this.element.volume + parseFloat(fn);
      } else if (fn.indexOf('-') === 0) {
        fn = this.element.volume - parseFloat(fn);
      }
    }

    this.element.volume = (fn < 0) ? 0 : ((fn > 1) ? 1 : fn);

    return this;
  };



  /**
   * Get/set mute to the media or bind a function to mute event
   *
   * muted (fn)
   * muted (true)
   * muted (false)
   * muted ()
   *
   * @param function/bool fn The function to the event listener. True to mute, false to unmute and void to toggle
   *
   * @return this
   */
  window.$media.prototype.muted = function (fn) {
    if (support.check('muted') === false) {
      return (arguments.length === 0) ? false : this;
    }

    if (fn === undefined) {
      return this.element.muted;
    }

    if ($.isFunction(fn)) {
      return this.on('muted', fn);
    }

    if (typeof fn === 'boolean' && (this.element.muted !== fn)) {
      this.element.muted = fn;

      return this.triggerHandler('muted');
    }

    return this;
  };



  /**
   * Adds an event listener to media element
   *
   * on('click', fn)
   *
   * @param string event The event name. You can set more than one event space separated
   * @param function fn The function to execute on trigger the event
   *
   * @return this
   */
  window.$media.prototype.on = function (event, fn) {
    var registeredEvents = this.$element.data('events') || {}, events = event.toLowerCase().split(' '), i, length = events.length, that = this;

    fn = $.proxy(fn, this);

    for (i = 0; i < length; i++) {
      switch (events[i]) {
        case 'fullScreen':
          if (!registeredEvents[events[i]]) {
            $(document).on('mozfullscreenchange', function (e) {
              if (document.mozFullScreenElement && that.$element.is(document.mozFullScreenElement)) {
                that.$element.data('fullScreen', true);
              } else if (that.$element.data('fullScreen')) {
                that.$element.data('fullScreen', false);
              } else {
                return;
              }

              that.trigger('fullScreen', [that.$element.data('fullScreen')]);
            });

            this.on('webkitfullscreenchange', function (e) {
              this.trigger('fullScreen', [document.webkitIsFullScreen]);
            });
          }

          this.$element.bind('fullScreen', fn);
          break;

        default:
          this.$element.bind(events[i], fn);
      }
    }

    return this;
  };



  /**
   * Removes one or more event listener to media element
   *
   * off('click', fn)
   * off('click')
   * off()
   *
   * @param string event The event name. You can set more than one event space separated
   * @param function fn The function to delete in the event
   *
   * @return this
   */
  window.$media.prototype.off = function (event, fn) {
    var events = event.toLowerCase().split(' '), i, length = events.length;

    if (fn) {
      fn = $.proxy(fn, this);
    }

    for (i = 0; i < length; i++) {
      switch (events[i]) {
        case 'end':
          this.$element.unbind('ended', fn);
          break;

        case 'seek':
          this.$element.unbind('seeked', fn);
          break;

        default:
          this.$element.unbind(events[i], fn);
      }
    }

    return this;
  };


  /**
   * Trigger an event
   *
   * trigger('click')
   *
   * @param string event The event name to trigger.
   * @param array data Optional arguments to pass to function events
   *
   * @return this
   */
  window.$media.prototype.trigger = function (event, data) {
    switch (event) {
      case 'seek':
        this.$element.trigger('seeked', data);
        break;

      default:
        this.$element.trigger(event, data);
    }

    return this;
  };


  /**
   * Execute all handles attached to the media for an event
   *
   * triggerHandler('click')
   *
   * @param string event The event name to trigger.
   * @param array data Optional arguments to pass to function events
   *
   * @return this
   */
  window.$media.prototype.triggerHandler = function (event, data) {
    switch (event) {
      case 'seek':
        this.$element.triggerHandler('seeked', data);
        break;

      default:
        this.$element.triggerHandler(event, data);
    }

    return this;
  };



  /**
   * Returns the current time of the media or a specific point in seconds or add a listener to timeupdate event
   *
   * time()
   * time('+10')
   * time('10%')
   *
   * @param string time The point of the media you get
   *
   * @return float The time in seconds
   */
  window.$media.prototype.time = function (time) {
    if (arguments.length === 0) {
      return this.element.currentTime.toSeconds();
    }

    if ($.isFunction(time)) {
      this.on('timeupdate', time);
    }

    if (isNaN(parseInt(time, 10))) {
      return 0;
    }

    if (typeof time === 'string') {
      if (time.indexOf('+') === 0) {
        time = this.time() + this.time(time.substr(1));
      } else if (time.indexOf('-') === 0) {
        time = this.time() - this.time(time.substr(1));
      } else if (time.indexOf('%') === -1) {
        time = time.toSeconds();
      } else {
        time = ((this.duration()/100) * parseFloat(time)).toSeconds();
      }
    } else {
      time = time.toSeconds();
    }

    if (time < 0) {
      return 0;
    }

    if (this.element.duration && (time > this.element.duration)) {
      return this.duration();
    }

    return time;
  };


  /**
   * Returns the media duration in seconds or bind a function on the durationchange event
   *
   * duration()
   * duration(fn)
   *
   * @param function fn The function to the event listener
   *
   * @return float The duration of the media
   * @return this On bind event
   */
  window.$media.prototype.duration = function (fn) {
    if ($.isFunction(fn)) {
      return this.on('durationchange', fn);
    }

    return (this.element.duration || 0).toSeconds();
  };


  /**
   * Get/set arbitrary data associated with this element.
   *
   * @param string name Name of the data
   * @param value Value of the data. Set this value to create/edit the data
   *
   * @return this (on set) or mixed (on get)
   */
  window.$media.prototype.data = function (name, value) {
    if (value === undefined) {
      return this.$element.data(name);
    }

    this.$element.data(name, value);

    return this;
  }


  /**
   * Reload the media element (back to inital state)
   *
   * @return this
   */
  window.$media.prototype.reload = function () {
    this.source(this.source());

    return this;
  };


  /**
   * Extends this media instance with other functions and properties
   *
   * extend('myFunction', fn);
   *
   * @param string/object name The name of the property or an object with all new properties
   * @param mixed value The value of the property
   */
  window.$media.prototype.extend = function (name, value) {
    if (typeof name !== 'object') {
      var k = name;
      name = {};
      name[k] = value;
    }

    $.extend(this, name);
  };


  /**
   * Extends the $media prototype with other functions or properties
   *
   * $media.extend('myFunction', fn);
   *
   * @param string/object name The name of the property or an object with all new properties
   * @param mixed value The value of the property
   */
  window.$media.extend = function (name, value) {
    if (typeof name !== 'object') {
      var k = name;
      name = {};
      name[k] = value;
    }

    $.each(name, function (k, v) {
      window.$media.prototype[k] = v;
    });
  };



  /**
   * Creates and returns a new $media object
   *
   * @param string/html/jQuery selector The selector of the media element
   * @param string/object properties The properties of the media element
   *
   * @return The $media intance.
   */
  $.media = function (selector, properties) {
    if (properties) {
      var src;

      if (properties.src) {
        src = properties.src;
        delete(properties.src);
      }

      selector = $(selector, properties);

      var media = new window.$media(selector.get(0));

      if (src) {
        media.source(src);
      }

      return media;
    }

    selector = $(selector);

    if (!selector.is('video, audio')) {
      selector = selector.find('video, audio');
    }

    return new window.$media(selector.get(0));
  };


  /**
   * Creates a new html video element and returns a $media object with it
   *
   * @param string/object The src or an object with all properties of the media element
   *
   * @return The $media instance
   */
  $.mediaVideo = function (properties) {
    if (typeof properties === 'string' || $.isArray(properties)) {
      properties = {src: properties};
    }

    return $.media('<video>', properties);
  };


  /**
   * Creates a new html audio element and returns a $media object with it
   *
   * @param string/object The src or an object with all properties of the media element
   *
   * @return The $media instance
   */
  $.mediaAudio = function (properties) {
    if (typeof properties === 'string' || $.isArray(properties)) {
      properties = {src: properties};
    }

    return $.media('<audio>', properties);
  };

})(window.jQuery);


/**
 * Extends the String object to convert any number to seconds
 *
 * '00:34'.toSeconds(); // 34
 *
 * @return float The value in seconds
 */
String.prototype.toSeconds = function () {
  'use strict';

  var time = this, ms;

  if (/^([0-9]{1,2}:)?[0-9]{1,2}:[0-9]{1,2}(\.[0-9]+)?(,[0-9]+)?$/.test(time)) {
    time = time.split(':', 3);

    if (time.length === 3) {
      ms = time[2].split(',', 2);
      ms[1] = ms[1] || 0;

      return ((((parseInt(time[0], 10) * 3600) + (parseInt(time[1], 10) * 60) + parseFloat(ms[0])) * 1000) + parseInt(ms[1], 10)) / 1000;
    }

    ms = time[1].split(',', 1);
    ms[1] = ms[1] || 0;

    return ((((parseInt(time[0], 10) * 60) + parseFloat(ms[0])) * 1000) + parseInt(ms[1], 10)) / 1000;
  }

  return parseFloat(time).toSeconds();
};



/**
 * Extends the String object to convert any number value to seconds
 *
 * '34'.secondsTo('mm:ss'); // '00:34'
 *
 * @param string outputFormat One of the avaliable output formats ('ms', 'ss', 'mm:ss', 'hh:mm:ss', 'hh:mm:ss.ms')
 *
 * @return string The value in the new format
 */
String.prototype.secondsTo = function (outputFormat) {
  'use strict';

  return this.toSeconds().secondsTo(outputFormat);
};



/**
 * Extends the Number object to convert any number to seconds
 *
 * (23.34345).toSeconds(); // 23.343
 *
 * @return float The value in seconds
 */
Number.prototype.toSeconds = function () {
  'use strict';

  return Math.floor(this * 1000) / 1000;
};


/**
 * Extends the Number object to convert any number value to seconds
 *
 * 34.secondsTo('mm:ss'); // '00:34'
 *
 * @param string outputFormat One of the avaliable output formats ('ms', 'ss', 'mm:ss', 'hh:mm:ss', 'hh:mm:ss.ms')
 *
 * @return string The value in the new format
 */
Number.prototype.secondsTo = function (outputFormat) {
  'use strict';

  var time = this;

  switch (outputFormat) {
    case 'ms':
      return Math.floor(time * 1000);

    case 'ss':
      return Math.floor(time);

    case 'mm:ss':
    case 'hh:mm:ss':
    case 'hh:mm:ss.ms':
      var hh = '';

      if (outputFormat !== 'mm:ss') {
        hh = Math.floor(time / 3600);
        time = time - (hh * 3600);
        hh += ':';
      }

      var mm = Math.floor(time / 60);
      time = time - (mm * 60);
      mm = (mm < 10) ? ("0" + mm) : mm;
      mm += ':';

      var ss = time;

      if (outputFormat.indexOf('.ms') === -1) {
        ss = Math.floor(ss);
      } else {
        ss = Math.floor(ss*1000)/1000;
      }
      ss = (ss < 10) ? ("0" + ss) : ss;

      return hh + mm + ss;
  }

  return time;
};