<?php
if ( ! function_exists( 'profilter_setup' ) ) :

function profilter_setup() {
    add_theme_support( 'title-tag' );

    add_theme_support( 'post-thumbnails' );
    set_post_thumbnail_size( 825, 510, true );

    add_filter('jpeg_quality', create_function( '', 'return 85;' ) );

    add_theme_support('html5',
        array('comment-list', 'comment-form', 'search-form', 'gallery', 'caption', 'widgets')
    );

    add_post_type_support('page', 'excerpt');

    register_nav_menus(array(
       'header-menu' => __( 'Menu gorne' ),
    ));

    add_theme_support( 'custom-logo', array(
        'height'      => 248,
        'width'       => 248,
        'flex-height' => true,
    ));

    add_theme_support( 'custom-background' );
}
endif; 
add_action( 'after_setup_theme', 'profilter_setup' );


function clean_wp_setup () {
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'start_post_rel_link');
    remove_action('wp_head', 'index_rel_link');
    remove_action('wp_head', 'feed_links_extra', 3);
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10);

    add_filter( 'the_generator', '__return_false');
    add_filter( 'show_admin_bar','__return_false');
    
    remove_action( 'set_comment_cookies', 'wp_set_comment_cookies');

    // REMOVE EMOJI ICONS
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
}
add_action('after_setup_theme', 'clean_wp_setup');


function custom_scripts() {
    if ( !is_admin() ) {
        // inline comment reply
        if ( is_single() && comments_open() ) {
            wp_enqueue_script( 'comment-reply' );
        }
    }
}
add_action( 'wp_enqueue_scripts', 'custom_scripts' );


function custom_loginlogo_url($url) {
	return get_site_url();
}
add_filter( 'login_headerurl', 'custom_loginlogo_url' );

?>