<?php
/*
* 404.php
* @package WordPress
* @subpackage emyth
* @since emyth 2.0
* Text Domain: emyth
*/
?>
<?php get_header();?>
	<main class="grupo total">
		<section class="caja no-padding mensajes mensaje_error">
			<article>
				<header class="heading">
					<h2><?php _e('Error 404. La página que estás buscando no existe.', 'emyth');?></h2>
				</header>
			</article>
		</section>
	</main>
<?php get_sidebar();?>
<?php get_footer();?>