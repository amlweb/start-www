(function() {
  "use strict";

  var MENU;

  MENU = {
    $menuItem: $('.nav__item'),

    init: function() {
      this.initMenuClick();
      this.initHamburgerMenu();
      this.initMenuFreez();
    },

    initMenuClick: function() {
      var _this = this;
      
      $('.nav__item').on({
        click: function() {
          _this.showSection( $(this).data('section') );

          if ( $('.nav__list').hasClass('nav--opened') ) {
            $('.nav__list').removeClass('nav--opened')
          }
        }
      })
    },

    initHamburgerMenu: function() {
      if ( $('body').outerWidth() > 1080 ) {
        return;
      }

      $('.nav__icon').on({
        click: function() {
          $('.nav__list').toggleClass('nav--opened');
          $(this).toggleClass('icon--close');
        }
      })
    },
    
    showSection: function( section ) {
      
      if ( typeof section === 'number') {
        section = $('.section').eq(section);
      }
      else if ( typeof section === 'string') {
        section = $('.' + section);
      }
      else {
        console.log('none');
      }

      $('body,html').animate({ scrollTop: section.offset().top }, 500 );
    },

    initMenuFreez: function() {
      var $window = $(window);

      $window.bind('scroll', function () {
          if ($window.scrollTop() > 150 && $window.width() > 1080 ) {
              console.log('add');
              $('.nav').addClass('nav--fixed');
          } else {
              console.log('remove');
              $('.nav').removeClass('nav--fixed');
          }
      });
    }
  };

  $(MENU.init.bind(MENU));

  window.MENU = MENU;
})();