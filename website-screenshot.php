<?php
/*
Plugin Name: Website screenshot blocks for Gutenberg
Plugin URL: https://pressmaximum.com/websit-screenshot
Description: Website screenshot using screenshotbin API
Version: 1.0.0
Author: PressMaximum
Author URI: https://pressmaximum.com
Text Domain: website-screenshot
Domain Path: /languages/
Contributors: shrimp2t
*/
namespace WS\Blocks;


//  Exit if accessed directly.
defined('ABSPATH') || exit;

/**
 * Gets this plugin's absolute directory path.
 *
 * @since  1.0.0
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
 * @since   1.0.0
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
include __DIR__ . '/lib/settings.php';
include __DIR__ . '/blocks/website-screenshot/index.php';
