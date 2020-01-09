import $ from 'jquery';
import 'jquery.cookie';

class Cookies {
    constructor() {
        this.dom = {
            $cookie: $('.cookies'),
            $cookieClose: $('.js-cookie--close'),
            $cookieMore: $('.js-cookie--show_more'),
            $cookieMoreContent: $('.cookies__more')
        };

        this.init();
    }

    init() {
        if ($.cookie('CookiePolicyAccepted') == null) {
            this.dom.$cookie.show();
        }

        this.events();
    }

    events() {
        this.dom.$cookieClose.on('click', (e) => {
            e.preventDefault();
            $.cookie('CookiePolicyAccepted', 'true', { expires: 9999, path: '/' });
            this.dom.$cookie.hide();
            return false;
        });

        this.dom.$cookieMore.on('click', (e) => {
            let $target = $(e.currentTarget),
                text = $target.text(),
                text2 = $target.data('text');

            this.dom.$cookieMoreContent.toggleClass('cookies__more--visible');

            $target.text(text2);
            $target.data('text', text);
        });
    }
}
export default Cookies;
