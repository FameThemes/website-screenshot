<?php
/*
Plugin Name: Website screenshot blocks for Gutenberg
Plugin URL: https://pressmaximum.com/websit-screenshot
Description:
Version: 1.0.1
Author: PressMaximum
Author URI: https://pressmaximum.com
Text Domain: wordpress-seo
Domain Path: /languages/
Contributors: shrimp2t
*/
namespace WS\Blocks;

define( 'API_KEY', '9h4ztd0utlkvqa34304f1x4d8wq0jy2m' );
define( 'API_SECRET', '2a982jefztlq9pzn9b8mol2mwhmvh3f4' );


//  Exit if accessed directly.
defined('ABSPATH') || exit;

/**
 * Gets this plugin's absolute directory path.
 *
 * @since  2.1.0
 * @ignore
 * @access private
 *
 * @return string
 */
function _get_plugin_directory() {
	return __DIR__;
}

/**
 * Gets this plugin's URL.
 *
 * @since  2.1.0
 * @ignore
 * @access private
 *
 * @return string
 */
function _get_plugin_url() {
	static $plugin_url;

	if ( empty( $plugin_url ) ) {
		$plugin_url = plugins_url( null, __FILE__ );
	}

	return $plugin_url;
}

// Enqueue JS and CSS
include __DIR__ . '/lib/enqueue-scripts.php';
include __DIR__ . '/blocks/website-screenshot/index.php';
