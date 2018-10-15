<?php

namespace WS\Blocks;

add_action( 'admin_menu',  __NAMESPACE__ . '\admin_menu' );

function admin_menu() {
	add_options_page(
		__( 'Website Screenshot', 'website-screenshot' ),
		__( 'Website Screenshot', 'website-screenshot' ),
		'manage_options',
		'website-screenshot',
		__NAMESPACE__ . '\settings_page'
	);
}

function settings_page(){

    if ( isset( $_POST['website_screenshot_api_secret'] ) ) {
        check_admin_referer( 'website-screenshot-settings' );
        update_option( 'website_screenshot_api_secret',  wp_unslash( $_POST['website_screenshot_api_secret'] ) );
        update_option( 'website_screenshot_api_args',  wp_unslash( $_POST['website_screenshot_api_args'] ) );
        ?>
        <div class="notice notice-success is-dismissible"><p><?php _e( 'Your settings saved', 'website-screenshot' ) ?></p></div>
        <?php
    }

	$api_secret =  get_option( 'website_screenshot_api_secret' );
	$api_args =  get_option( 'website_screenshot_api_args' );
	if( ! array( $api_args ) ) {
		$api_args = array();
    }

	$api_args = wp_parse_args( $api_args, array(
        'format' => 'png',
        'imgWidth' => null,
        'viewportWidth' => null,
        'viewportHeight' => null,
        'deviceScaleFactor' => null,
        'delay' => null,
        'waitUntilEvent' => null,
        'full' => null,
        'timeout' => null,
        'fresh' => null,
    ) );

	?>
	<div class="wrap">
        <h1><?php _e( 'Website Screenshot Settings', 'website-screenshot' ); ?></h1>
		<form method="POST" action="">
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="website_screenshot_api_secret"><?php _e( 'Screenshotbin API Secret', 'website-screenshot' ); ?></label></th>
                    <td>
                        <input name="website_screenshot_api_secret" type="text" id="website_screenshot_api_secret" value="<?php echo esc_attr( $api_secret ); ?>" class="regular-text">
                        <p class="description">
                            <?php _e( 'You can get API secret key <a target="_blank" href="https://www.screenshotbin.com/account">here</a>', 'website-screenshot' ); ?>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label><?php _e( 'Format', 'website-screenshot' ); ?></label></th>
                    <td>
                        <input name="website_screenshot_api_args[format]" type="text" value="<?php echo esc_attr( $api_args['format'] ); ?>" class="regular-text">
                        <p class="description">
				            <?php _e( 'Image file format. Supported types are png or jpeg.', 'website-screenshot' ); ?>
                        </p>
                    </td>
                </tr>

                <tr>
                    <th scope="row"><label><?php _e( 'Image Width', 'website-screenshot' ); ?></label></th>
                    <td>
                        <input name="website_screenshot_api_args[imgWidth]" type="number" placeholder="<?php esc_attr_e( 'Defaults to same as viewport width', 'website-screenshot' ); ?>" value="<?php echo esc_attr( $api_args['imgWidth'] ); ?>" class="regular-text">
                        <p class="description">
				            <?php _e( 'Width in pixels of the final image, useful for creating thumbnails. The image height will be determined automatically based on aspect ratio of the original screenshot, which is configurable through', 'website-screenshot' ); ?>
                        </p>
                    </td>
                </tr>

                <tr>
                    <th scope="row"><label><?php _e( 'Viewport Width', 'website-screenshot' ); ?></label></th>
                    <td>
                        <input name="website_screenshot_api_args[viewportWidth]" type="number" placeholder="1440" value="<?php echo esc_attr( $api_args['viewportWidth'] ); ?>" class="regular-text">
                        <p class="description">
				            <?php _e( 'Width in pixels of the viewport when taking the screenshot. Using lower values like 460 can help emulate what the page looks like on mobile devices.', 'website-screenshot' ); ?>
                        </p>
                    </td>
                </tr>

                <tr>
                    <th scope="row"><label><?php _e( 'Viewport Height', 'website-screenshot' ); ?></label></th>
                    <td>
                        <input name="website_screenshot_api_args[viewportHeight]" type="number" placeholder="900" value="<?php echo esc_attr( $api_args['viewportHeight'] ); ?>" class="regular-text">
                        <p class="description">
				            <?php _e( 'Width in pixels of the viewport when taking the screenshot. Using lower values like 460 can help emulate what the page looks like on mobile devices.', 'website-screenshot' ); ?>
                        </p>
                    </td>
                </tr>

                <tr>
                    <th scope="row"><label><?php _e( 'Device ScaleFactor', 'website-screenshot' ); ?></label></th>
                    <td>
                        <input name="website_screenshot_api_args[deviceScaleFactor]"  type="number" placeholder="1" value="<?php echo esc_attr( $api_args['deviceScaleFactor'] ); ?>" class="regular-text">
                        <p class="description">
				            <?php _e( 'Sets device scale factor (basically dpr) to emulate high-res/retina displays. Number from 1 to 4. Default: 1', 'website-screenshot' ); ?>
                        </p>
                    </td>
                </tr>

                <tr>
                    <th scope="row"><label><?php _e( 'Delay', 'website-screenshot' ); ?></label></th>
                    <td>
                        <input name="website_screenshot_api_args[delay]" type="number" value="<?php echo esc_attr( $api_args['delay'] ); ?>" class="regular-text">
                        <p class="description">
				            <?php _e( 'If set, we\'ll wait for the specified number of milliseconds after the page load event before taking a screenshot.', 'website-screenshot' ); ?>
                        </p>
                    </td>
                </tr>

                <tr>
                    <th scope="row"><label><?php _e( 'Wait Until Event', 'website-screenshot' ); ?></label></th>
                    <td>
                        <input name="website_screenshot_api_args[waitUntilEvent]" type="text" placeholder="load" value="<?php echo esc_attr( $api_args['waitUntilEvent'] ); ?>" class="regular-text">
                        <p class="description">
				            <?php _e( 'Controls when the screenshot is taken as the page loads. Supported events include:<br/>
load - window load event fired (default)<br/>
domcontentloaded - DOMContentLoaded event fired.<br/>
networkidle0 - wait until there are zero network connections for at least 500ms.<br/>
networkidle2 - wait until there are no more than 2 network connections for at least 500ms.<br/>
domcontentloaded is the fastest but riskiest option–many images and other asynchronous resources may not have loaded yet. networkidle0 is the safest but slowest option. load is a nice middle ground.
<br/>Default: load.', 'website-screenshot' ); ?>
                        </p>
                    </td>
                </tr>

                <tr>
                    <th scope="row"><label><?php _e( 'Wait Until Selector', 'website-screenshot' ); ?></label></th>
                    <td>
                        <input name="website_screenshot_api_args[waitUntilSelector]" type="text" placeholder="<?php esc_attr_e( '.ready-for-screenshot', 'website-screenshot' ); ?>" value="<?php echo esc_attr( $api_args['waitUntilSelector'] ); ?>" class="regular-text">
                        <p class="description">
				            <?php _e( 'If set, we\'ll wait for the element specified by this selector to become present before taking a screenshot', 'website-screenshot' ); ?>
                        </p>
                    </td>
                </tr>


                <tr>
                    <th scope="row"><label><?php _e( 'Timeout', 'website-screenshot' ); ?></label></th>
                    <td>
                        <input name="website_screenshot_api_args[timeout]" placeholder="10000" type="number" value="<?php echo esc_attr( $api_args['timeout'] ); ?>" class="regular-text">
                        <p class="description">
				            <?php _e( 'The number of milliseconds to wait for a page load event before taking a screenshot or failing (controlled by failOnTimeout). Defaults: 10000 (10 seconds)', 'website-screenshot' ); ?>
                        </p>
                    </td>
                </tr>

                <tr>
                    <th scope="row"><label><?php _e( 'Ignore Cache', 'website-screenshot' ); ?></label></th>
                    <td>
                        <p class="description">
                            <label>
                                <input name="website_screenshot_api_args[fresh]"  type="checkbox" <?php checked( $api_args['fresh'], 'true' ); ?> value="true" class="regular-text">
                                <span class="">
				            <?php _e( 'The number of milliseconds to wait for a page load event before taking a screenshot or failing (controlled by failOnTimeout). Defaults: 10000 (10 seconds)', 'website-screenshot' ); ?>
                            </span>
                            </label>
                        </p>

                    </td>
                </tr>

            </table>
			<?php
			submit_button();
			wp_nonce_field( 'website-screenshot-settings' );
			?>
		</form>
	</div>
	<?php
}