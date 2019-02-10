<?php
/*
* servicios.php
* @package WordPress
* @subpackage emyth
* @since emyth 2.0
* Text Domain: emyth
* Template Name: Servicios
*/
?>
<?php get_header();?>
	<main>
		<div class="blog">
			<header class="heading">
				<h1 class="h1"><?php the_title();?></h1>
			</header>
		</div>
		<section class="contenido text-align-left">
			<div><?php the_breadcrums();?></div>
		<?php rewind_posts(); if ( have_posts() ) : ?>
			<div>
			<?php while ( have_posts() ) : the_post(); ?>
				<article class="contenido--item-single">
					<?php the_content();?>
				</article>
			<?php endwhile; else : ?>
				<article>
					<?php _e('No hay nada publicado.', 'emyth');?>
				</article>
			<?php endif; ?>
			</div>
		</section>
	<?php get_sidebar('right');?>
	</main>
<?php get_sidebar();?>
<?php get_footer();?>