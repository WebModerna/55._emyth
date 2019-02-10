<?php // Url relativas
add_action( 'template_redirect', 'relative_url', -1 );
function relative_url()
{
	$filters = array(
	'bloginfo_url',
	'the_permalink',
	'wp_list_pages',
	'wp_list_categories',
	'the_content_more_link',
	'the_tags',
	'the_author_posts_link',
	'post_link',
	'post_type_link',
	'page_link',
	'attachment_link',
	'get_shortlink',
	'post_type_archive_link',
	'get_pagenum_link',
	'get_comments_pagenum_link',
	'term_link',
	'search_link',
	'day_link',
	'month_link',
	'year_link',

	// site location
	// 'option_siteurl',
	'blog_option_siteurl',
	// 'option_home',
	// 'admin_url',
	// 'get_admin_url',
	'get_site_url',
	'network_admin_url',
	// 'home_url',
	'includes_url',
	// 'site_url',
	'site_option_siteurl',
	'network_home_url',
	'network_site_url',

	// debug only filters
	'get_the_author_url',
	'get_comment_link',
	'wp_get_attachment_image_src',
	'wp_get_attachment_thumb_url',
	'wp_get_attachment_url',
	'wp_login_url',
	'wp_logout_url',
	'wp_lostpassword_url',
	'get_stylesheet_uri',
	'get_stylesheet_directory_uri', // Comentados
	'plugins_url', // Comentados
	'plugin_dir_url', // Comentados
	'stylesheet_directory_uri', // Comentados
	'get_template_directory_uri', // Comentados
	'template_directory_uri', // Comentados
	'get_locale_stylesheet_uri',
	'script_loader_src', // plugin scripts url
	'style_loader_src', // plugin styles url
	'get_theme_root_uri',
  );

	// Thanks to https://wordpress.org/support/topic/request-only-replace-local-urls
	$home_url = home_url();
	$filter_fn = function( $link ) use ( $home_url )
	{
		if ( !is_array($link) && strpos( $link, $home_url ) === 0 )
		{
			return wp_make_link_relative( $link );
		} else {
			return $link;
		}
	};

	foreach ( $filters as $filter )
	{
		add_filter( $filter, $filter_fn );
	}
};
?>