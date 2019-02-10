<?php
/*
* header-home.php
* @package WordPress
* @subpackage emyth
* @since emyth 1.0
* Text Domain: emyth
*/
$meta_keywords2 = of_get_option('meta_keywords2','');
?>
<!DOCTYPE html>
<html type="text/html" <?php language_attributes();?>>
<head>
	<meta charset="<?php bloginfo('charset');?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.5, user-scalable=yes" />

<?php if ( is_home() || is_search() ) { ?>

	<title><?php bloginfo('name');?> - <?php bloginfo('description');?></title>
	<meta name="description" content="<?php bloginfo('description');?>" />
<?php	if ( $meta_keywords2 != null )
	{
		echo '<meta name="keywords" content="' . $meta_keywords2 . '" />';
	}

} elseif ( is_404() ) { ?>

	<title><?php echo _e('Error 404');?> | <?php bloginfo('name');?></title>
	<meta name="description" content="<?php bloginfo('description');?>" />

<?php } elseif ( is_page() || is_single() ) { ?>

	<title><?php the_title();?> | <?php bloginfo('name');?></title>
	<meta name="description" content="<?php bloginfo('description');?>">

<?php } else { ?>

	<title><?php the_title();?> | <?php bloginfo('name');?></title>
	<meta description="<?php bloginfo('description');?>" />
	<!-- Está lo mismo de arriba pero hay que revisarlo y cambiarlo -->

<?php };?>

	<meta name="author" content="<?php _e('WebModerna | el futuro de la web', 'emyth') ?>">
	<link rel="stylesheet" type="text/css" href="<?php bloginfo('stylesheet_directory');?>/css/style.min.css" media="all" />
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory');?>/js/modernizr-2.8.3.min.js"></script>

<?php if(wpmd_is_notdevice()) { ?>
<!--[if IE 8]>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory');?>/js/selectivizr-min.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory');?>/js/html5.js"></script>
	<script src="<?php bloginfo('stylesheet_directory');?>/js/DD_roundies_0.0.2a-min.js" type="text/javascript"></script>
	<script type="text/javascript">DD_roundies.addRule('.boton, .selected', '10px', true);</script>
	<link type="text/css" rel="stylesheet" href="<?php bloginfo('stylesheet_directory');?>/css/styleIE8.css" media="all" />
<![endif]-->
<?php };?>
	<link rel="shortcut icon" type="image/x-icon" href="<?php bloginfo('stylesheet_directory');?>/favicon.ico" />
<?php wp_head();?>
</head>
<body>
	<header class="header">
		<div class="logo">
			<a href="<?php bloginfo('url');?>">
				<img src="<?php bloginfo('stylesheet_directory');?>/img/logo.png" alt="<?php bloginfo('name');?>" />
			</a>
		</div>

		<div class="menu-icono">
			<a href="#" id="menu">
				<span></span>
				<span></span>
				<span></span>
			</a>
		</div>

		<nav class="nav" id="nav_home">
			<ul id="header_nav" class="nav--listado">
				<li class="nav--listado--item current_menu_item current_page_item"><a href="index.php">Home</a></li>
				<li class="nav--listado--item"><a href="#productos">Productos</a></li>
				<li class="nav--listado--item"><a href="#blog">Blog</a></li>
				<li class="nav--listado--item"><a href="#ubicacion">Deshubicación</a></li>
				<li class="nav--listado--item"><a href="#servicios">Servicios</a></li>
				<li class="nav--listado--item"><a href="#about_us">About Us</a></li>
				<li class="nav--listado--item"><a href="#contacto">Contacto</a></li>
			</ul>
		</nav>
	</header>
	<div class="wrapper">

		<section>
			<article>
				<?php if ( function_exists( 'the_msls' ) ) the_msls();?>
			</article>
		</section>

	<?php
	// llamada al slider
	// include (TEMPLATEPATH . '/slider.php'); ?>