(function(window) {
  'use strict';
  function extend(a, b) {
    for(var key in b) { 
      if(b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }
  function each(collection, callback) {
    for (var i = 0; i < collection.length; i++) {
      var item = collection[i];
      callback(item);
    }
  }
  function Menu(options) {
    this.options = extend({}, this.options);
    extend(this.options, options);
    this._init();
  }
  Menu.prototype.options = {
    top: '#top-wrap',
    wrapper: '#site-wrap',          // The content wrapper
    type: 'push-left',             // The menu type
    menuOpenerClass: '.c-button',   // The menu opener class names (i.e. the buttons)
    maskId: '#c-mask'               // The ID of the mask
  };
  Menu.prototype._init = function() {
    this.body = document.body;
    this.top = document.querySelector('#top-wrap');
    this.wrapper = document.querySelector('#site-wrap');
    this.mask = document.querySelector('#c-mask');
    this.menu = document.querySelector('#c-menu--push-left');

    this.menuOpeners = document.querySelectorAll('.c-button');
    this._initEvents();
  };
  Menu.prototype._initEvents = function() {
    this.mask.addEventListener('click', function(e) {
      e.preventDefault();
      this.close();
    }.bind(this));
  };
  Menu.prototype.open = function() {
    $('.c-menu').click();
    this.body.classList.add('has-active-menu');
    this.top.classList.add('has-' + this.options.type);
    this.wrapper.classList.add('has-' + this.options.type);
    this.menu.classList.add('is-active');
    this.mask.classList.add('is-active');
    this.disableMenuOpeners();
  };
  Menu.prototype.close = function() {
    this.body.classList.remove('has-active-menu');
    this.top.classList.remove('has-' + this.options.type);
    this.wrapper.classList.remove('has-' + this.options.type);
    this.menu.classList.remove('is-active');
    this.mask.classList.remove('is-active');
    this.enableMenuOpeners();
  };
  Menu.prototype.disableMenuOpeners = function() {
    each(this.menuOpeners, function(item) {
      item.disabled = true;
    });
  };
  Menu.prototype.enableMenuOpeners = function() {
    each(this.menuOpeners, function(item) {
      item.disabled = false;
    });
  };
  window.Menu = Menu;
})(window);

function clearOverflow(){
  document.body.classList.remove('has-active-menu');
}