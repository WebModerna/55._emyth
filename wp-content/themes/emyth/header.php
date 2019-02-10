<?php
/**
* header.php
* @package WordPress
* @subpackage emyth
* @since emyth 2.0
* Text Domain: emyth
*/

// Variables útiles
$meta_keywords = of_get_option('meta_keywords2', '');
$emyth_meta_keywords = rwmb_meta('emyth_meta_keywords', '');
$emyth_meta_descripcion = rwmb_meta('emyth_meta_descripcion', '');
$meta_paginas_meta_descripcion = rwmb_meta('meta_paginas_meta_descripcion', '');
$meta_paginas_meta_keywords = rwmb_meta('meta_paginas_meta_keywords', '');
$facebook_contact = of_get_option('facebook_contact', '');
$twitter_contact  = of_get_option('twitter_contact', '');


?>
<!DOCTYPE html>
<html <?php language_attributes();?>>
<head>
	<meta charset="<?php bloginfo('charset');?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=2, user-scalable=yes" />
<?php if( is_home() || is_search() ) { ?>
	<title><?php bloginfo('name');?> - <?php bloginfo('description');?></title>
	<meta name="description" content="<?php bloginfo('description');?>" />
	<?php if ( $meta_keywords ) {
		echo '<meta name="keywords" content="' . $meta_keywords . '" />';
	}
} elseif( is_404() ) { ?>
	<title>Error 404 - <?php bloginfo('description');?></title>
	<meta name="description" content="<?php bloginfo('description');?>" />
	<?php if ( $meta_keywords ) {
		echo '<meta name="keywords" content="' . $meta_keywords . '" />';
	}
} elseif( is_category() || is_tax() || is_tag() ) { ?>
	<title><?php printf( __( '%s', 'emyth' ), single_cat_title( '', false ) ); ?> - <?php bloginfo('description');?></title>
	<meta name="description" content="<?php bloginfo('description');?>" />
	<?php if ( $meta_keywords ) {
		echo '<meta name="keywords" content="' . $meta_keywords . '" />';
	}
} elseif ( is_page() ) { ?>
	<title><?php the_title();?> - <?php bloginfo('name');?></title>
	<?php if ( $meta_paginas_meta_descripcion ) {
		echo '<meta name="description" content="' . $meta_paginas_meta_descripcion . '" />';
	} else {
		echo '<meta name="description" content="' . get_bloginfo('description') . '" />';
	}
	if ( $meta_paginas_meta_keywords ) {
		echo '<meta name="keywords" content="' . $meta_paginas_meta_keywords . '" />';
	} else {
		echo '<meta name="keywords" content="' . $meta_keywords . '" />';
	}
} elseif ( is_single() ) { ?>
	<title><?php the_title();?> - <?php bloginfo('name');?></title>
	<?php if ( $emyth_meta_descripcion )
	{
		echo '<meta name="description" content="' . $emyth_meta_descripcion . '" />';
	}
	else
	{ ?>
	<meta name="description" content="<?php bloginfo("description");?>" />
<?php	}
	if ( $emyth_meta_keywords )
	{
		echo '<meta name="keywords" content="' . $emyth_meta_keywords . '" />';
	}
	else
	{
		echo '<meta name="keywords" content="' . $meta_keywords . '" />';
	}
};?>
	<meta name="author" content="<?php _e('WebModerna | el futuro de la web', 'emyth') ?>">

<!--[if IE 8]>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory');?>/js/modernizr-2.8.3.min.js"></script>
<![endif]-->
	<link href="//fonts.googleapis.com/css?family=Lora:400,400i,700,700i" rel="stylesheet" />
	<link rel="stylesheet" type="text/css" href="<?php bloginfo('stylesheet_directory');?>/css/style.min.css" media="all" />
	<link rel="shortcut icon" type="image/x-icon" href="<?php bloginfo('stylesheet_directory');?>/favicon.ico" />

<?php if ( wpmd_is_notdevice() ) { ?>
<!--[if gte IE 9]><style type="text/css">.gradient { filter: none !important; }</style><![endif]-->

<!--[if IE 9]>
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory');?>/css/styleIE9.css" />
<![endif]-->

<!--[if IE 8]>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory');?>/js/selectivizr-min.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory');?>/js/html5.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory');?>/js/css3-mediaqueries.js"></script>
	<link type="text/css" rel="stylesheet" href="<?php bloginfo('stylesheet_directory');?>/css/styleIE8.css" media="all" />
<![endif]-->
<?php };
wp_head();?>
</head>
<body>
<!--[if lt IE 8]>
	<p class="browserupgrade">Estás usando un <strong>navegador viejo</strong>. Por favor <a target="_blank" href="http://browsehappy.com/">actualizá tu navegador</a> para mejorar tu experiencia en la web.</p>
	<hr />
	<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
<![endif]-->
<?php if ( is_home() or is_front_page() )
{
	echo '<div class="wrapper wrapper--home">';
} else {
	echo '<div class="wrapper">';
};?>

	<header class="header">
		<div class="logotipo">
			<h1 class="logotipo--header">
				<?php $logotipo = of_get_option('logo_uploader','');
				if( $logotipo ) { ?>
				<a href="<?php echo get_home_url();?>" title="<?php bloginfo('name');?>">
					<img class="logotipo--logo" src="<?php echo $logotipo;?>" alt="<?php bloginfo('name');?>" />
				</a>
				<?php } else { ?>
				<a href="<?php echo get_home_url();?>" title="<?php bloginfo('name');?>">
					<img class="logotipo--logo" src="<?php echo get_stylesheet_directory_uri();?>/img/emyth-web.png" alt="<?php bloginfo('name');?>" />
				</a>
				<?php };?>
			</h1>
		</div>

		<div class="boton_menu">
			<div class="menu">
				<a href="#" id="menu">
					<span></span>
					<span></span>
					<span></span>
				</a>
			</div>
		</div>

		<?php if ( !is_user_logged_in() )
		{
			echo '<div class="boton_registro">';
			echo '<a class="boton_registro--boton" href="' . wp_registration_url() . '" title="'. __('Registrarse', 'emyth') . '"><span class="icono-user2"></span>
			</a>';
			echo '<a class="boton_registro--boton" href="' . wp_login_url() . '" title="'. __('Entrar', 'emyth') . '"><span class="icono-enter"></span>
			</a>';
			echo '</div>';
		};?>

		<nav class="navegacion">
				<?php
				/*
				$args = array(
			<ul class="navegacion--listado navegacion--listado-cerrar" id="header_nav">
					'depth' => 2,
					// 'show_date' => '',
					'date_format' => get_option( 'date_format' ),
					// 'child_of' => 0,
					// 'exclude' => '',
					'title_li' => '',
					'echo' => 1,
					// 'authors' => '',
					'sort_column' => 'menu_order, post_title',
					// 'link_before' => '',
					// 'link_after' => '',
					'link_class'	=>	'button-bar',
					'show_home' => 'Home',
					// 'walker' => new Primary_Walker_Nav_Menu()
				);
			</ul>
				wp_list_pages ($args);
				*/
				?>
			<?php $default = array(
				'container'			=>	false,
				'depth'				=>	2,
				'menu'				=>	'header_nav',
				'theme_location'	=>	'header_nav',
				'items_wrap'		=>	'<ul id="header_nav" class="navegacion--listado navegacion--listado-cerrar">%3$s</ul>'
			);
			wp_nav_menu($default);?>
		</nav>
		<div class="clearfix"></div>
	</header>