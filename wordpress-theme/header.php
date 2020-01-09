<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="AMLweb">
    <meta name="robots" content="index, follow">

    <link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="all" />
    <link rel="icon" href="/favicon.png" type="image/png"> 

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <nav class="top-nav" role="navigation">
        <div class="container">
            <div class="nav-icon" type="button" data-toggle="collapse" data-target="top-nav__menu">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </div>
            <?php
            wp_nav_menu( array(
              'theme_location' => 'header-menu',
              'depth' => 0,
              'menu_class' => 'top-nav__menu__list',
              'container_class' => 'top-nav__menu'
            ));
            ?>
        </div>
    </nav>

    <div class="page">