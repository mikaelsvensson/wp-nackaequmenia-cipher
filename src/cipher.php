<?php
/*
    Plugin Name: Chiffer
    Description: Made for Nacka Equmenia
    Version: 0.0.1
    Author: Mikael Svensson
    Author URI: http://www.nackasmu.se
*/

const SLUG = 'nackaequmenia-cipher';

// CAESAR

function cipher_caesar_enqueue_script()
{
    wp_enqueue_script(SLUG . '-caesar', plugins_url('cipher-caesar.js', __FILE__), ['jquery'], false, true);
}

function cipher_caesar_register_shortcode($atts)
{
    add_action('get_footer', 'cipher_caesar_enqueue_script');
    ob_start();
    require 'cipher-caesar.php';
    return ob_get_clean();
}

add_shortcode('caesar', 'cipher_caesar_register_shortcode');

// MORSE

function cipher_morse_enqueue_script()
{
    wp_enqueue_script(SLUG . '-morse', plugins_url('cipher-morse.js', __FILE__), ['jquery'], false, true);
}

function cipher_morse_register_shortcode($atts)
{
    add_action('get_footer', 'cipher_morse_enqueue_script');
    ob_start();
    require 'cipher-morse.php';
    return ob_get_clean();
}

add_shortcode('morse', 'cipher_morse_register_shortcode');

// PIGPEN

function cipher_pigpen_enqueue_script()
{
    wp_enqueue_script(SLUG . '-pigpen', plugins_url('cipher-pigpen.js', __FILE__), ['jquery'], false, true);
}

function cipher_pigpen_register_shortcode($atts)
{
    add_action('get_footer', 'cipher_pigpen_enqueue_script');
    ob_start();
    require 'cipher-pigpen.php';
    return ob_get_clean();
}

add_shortcode('pigpen', 'cipher_pigpen_register_shortcode');

// POLYBIUS SQUARE

function cipher_polybiussquare_enqueue_script()
{
    wp_enqueue_script(SLUG . '-polybiussquare', plugins_url('cipher-polybiussquare.js', __FILE__), ['jquery'], false, true);
}

function cipher_polybiussquare_register_shortcode($atts)
{
    add_action('get_footer', 'cipher_polybiussquare_enqueue_script');
    ob_start();
    require 'cipher-polybiussquare.php';
    return ob_get_clean();
}

add_shortcode('polybiussquare', 'cipher_polybiussquare_register_shortcode');

// GRILLE

function cipher_grille_enqueue_script()
{
    wp_enqueue_script(SLUG . '-grille', plugins_url('cipher-grille.js', __FILE__), ['jquery'], false, true);
}

function cipher_grille_register_shortcode($atts)
{
    add_action('get_footer', 'cipher_grille_enqueue_script');
    ob_start();
    require 'cipher-grille.php';
    return ob_get_clean();
}

function cipher_grille_theme_style()
{
    wp_enqueue_style(SLUG . '-grille-theme', plugins_url('cipher.css', __FILE__));
}

add_action('wp_enqueue_scripts', 'cipher_grille_theme_style');

add_shortcode('grille', 'cipher_grille_register_shortcode');
