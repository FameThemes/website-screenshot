<?php

namespace WS\Blocks\Website_Screenshot;

add_action( 'wp_ajax_website_screenshot_fetch', __NAMESPACE__ . '\ajax_fetch' );

/**
 * Ajax to load image
 */
function ajax_fetch() {

	$content = trim(file_get_contents("php://input"));
	$decoded = json_decode($content, true);
	$post_data =  wp_parse_args( $decoded, array(
		'blockAlignment' => '',
		'imgAlt' => '',
		'imgID' => '',
		'imgURL' => '',
		'textAlignment' => '',
		'title' => '',
		'websiteUrl' => '',
		'_nonce' => '',

		'viewportWidth' =>  null,
		'viewportHeight' =>  null,
		'delay' =>  null,
		'full' =>  false,
	) );
	$nonce = $post_data['_nonce'];

	$default = array(
		'id' => null,
		'alt' => null,
		'url' => null,
	);

	if ( ! wp_verify_nonce( $nonce, 'website-screenshot-fetch' ) ) {
		wp_send_json( $default );
		die();
	}

	if( ! filter_var( $post_data['websiteUrl'], FILTER_VALIDATE_URL))
	{
		wp_send_json( $default );
		die();
	}

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

	if( $api_args['format'] != 'jpeg' ){
		$api_args['format'] = 'png';
	}

	$url = get_screenshot_url( $post_data['websiteUrl'], $post_data, $api_args );

	$post_data['title'] = sanitize_file_name( $post_data['title'] );

	$file_name = $post_data['title']  ? $post_data['title'] : sanitize_file_name( $post_data['websiteUrl'] );

	Download_File::get_instance()->set_file_title( $post_data['title'] );
	$id = Download_File::get_instance()->download_file( $url, $file_name.'.'.$api_args['format'] );

	if ( $id ) {
		// Don't forget to stop execution afterward.
		wp_send_json( array(
			'id' => $id,
			'alt' => get_the_title( $id ),
			'url' => wp_get_attachment_url( $id ),
		) );
		wp_die();
	}

	wp_send_json( $default );
	die();

}

/**
 *  Get Screenshot from screenshotbin
 *
 * @param $url
 * @param array $args
 * @param array $api_args
 *
 * @return bool
 */
function get_screenshot_url( $url, $args = array(), $api_args = array() ){
	// We'll use PHP curl, but other http clients will work!
	$api_url = "https://api.screenshotbin.com/v1/screenshot";
	$data = array(
		"url" => $url,
		'format' => 'png',
		'viewportWidth' =>  null,
		'viewportHeight' =>  null,
		'delay' =>  null,
		'full' =>  false,
	);

	unset( $api_args['url'] );
	foreach ( $api_args as $k => $v ) {
		if ( $v && is_numeric( $v ) ) {
			$api_args[ $k ] = intval( $v );
		} elseif ( $v == 'true' ) {
			$api_args[ $k ] = true;
		} elseif ( ! $v ) {
			unset( $api_args[ $k ] );
		}
	}

	$data = array_merge( $data, $api_args );

	if ( $args['viewportWidth'] ) {
		$data['viewportWidth'] = absint( $args['viewportWidth'] );
	}

	if ( $args['viewportHeight'] ) {
		$data['viewportHeight'] = absint( $args['viewportHeight'] );
	}

	if ( $args['delay'] ) {
		$data['delay'] = absint( $args['delay'] );
	}

	if ( $args['full'] ) {
		$data['full'] = $args['full'];
	}

	$data_string = json_encode($data);
	$secret_api_key = get_option( 'website_screenshot_api_secret' );
	if ( ! $secret_api_key ) {
		return false;
	}

	$curl = curl_init($api_url);
	curl_setopt($curl, CURLOPT_POST, true);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);
	curl_setopt($curl, CURLOPT_USERPWD, $secret_api_key . ":");
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPHEADER, array(
		"Content-Type: application/json",
		"Content-Length: " . strlen($data_string)
	));
	$response = curl_exec($curl);
	curl_close($curl);
	$response = json_decode($response, true);
	return $response['url'];
}


/**
 * Class Download_File
 *
 * @package WS\Blocks\Website_Screenshot
 */
class Download_File {

	static private $_instance = null;

	private $title = null;

	static function get_instance(){
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	/**
	 * Set Image Title
	 *
	 * @param $title
	 */
	function set_file_title( $title ){
		$this->title = $title;
	}

	/**
	 * Handles a side-loaded file in the same way as an uploaded file is handled by media_handle_upload().
	 *
	 * @since 2.6.0
	 *
	 * @param array  $file_array Array similar to a `$_FILES` upload array.
	 * @param int    $post_id    The post ID the media is associated with.
	 * @param string $desc       Optional. Description of the side-loaded file. Default null.
	 * @param array  $post_data  Optional. Post data to override. Default empty array.
	 * @return int|object The ID of the attachment or a WP_Error on failure.
	 */
	 private function media_handle_sideload( $file_array, $post_id, $desc = null, $post_data = array(), $save_attachment = true ) {
		$overrides = array(
			'test_form'=>false,
			'test_type'=>false
		);

		$time = current_time( 'mysql' );

		$file = wp_handle_sideload( $file_array, $overrides, $time );

		if ( isset($file['error']) )
			return new WP_Error( 'upload_error', $file['error'] );

		$url = $file['url'];
		$file = $file['file'];

		if ( $this->title  ) {
			$title = $this->title;
		} else {
			$title = preg_replace('/\.[^.]+$/', '', basename($file));
		}

		$content = '';

		 $filetype = wp_check_filetype( basename( $file ), null );

		if ( $save_attachment ) {
			if (isset($desc)) {
				$title = $desc;
			}

			// Construct the attachment array.
			$attachment = array_merge(array(
				'post_mime_type' => $filetype['type'],
				'guid' => $url,
				'post_parent' => $post_id,
				'post_title' => $title,
				'post_content' => $content,
			), $post_data);

			// This should never be set as it would then overwrite an existing attachment.
			unset($attachment['ID']);

			// Save the attachment metadata
			$id = wp_insert_attachment($attachment, $file, $post_id);
			if ( ! is_wp_error( $id ) ) {
				// Make sure that this file is included, as wp_generate_attachment_metadata() depends on it.
				require_once( ABSPATH . 'wp-admin/includes/image.php' );

				// Generate the metadata for the attachment, and update the database record.
				$attach_data = wp_generate_attachment_metadata( $id, $file );
				wp_update_attachment_metadata( $id, $attach_data );
			}

			return $id;
		} else {
			return $file;
		}
	}

	/**
	 * Download image form url
	 *
	 * @return bool
	 */
	function download_file( $url, $name = '', $save_attachment = true ){
		if ( ! $url || empty ( $url ) ) {
			return false;
		}
		// These files need to be included as dependencies when on the front end.
		require_once (ABSPATH . 'wp-admin/includes/image.php');
		require_once (ABSPATH . 'wp-admin/includes/file.php');
		require_once (ABSPATH . 'wp-admin/includes/media.php');
		$file_array = array();
		// Download file to temp location.
		$file_array['tmp_name'] = download_url( $url );

		// If error storing temporarily, return the error.
		if ( empty( $file_array['tmp_name'] ) || is_wp_error( $file_array['tmp_name'] ) ) {
			return false;
		}

		if ( $name ) {
			$file_array['name'] = $name;
		} else {
			$file_array['name'] = basename( $url );
		}
		// Do the validation and storage stuff.
		$file_path_or_id = $this->media_handle_sideload( $file_array, 0, null, array(), $save_attachment );

		// If error storing permanently, unlink.
		if ( is_wp_error( $file_path_or_id ) ) {
			@unlink( $file_array['tmp_name'] );
			return false;
		}
		return $file_path_or_id;
	}
}
