<?php
/**
* single.php
* @package WordPress
* @subpackage emyth
* @since emyth 2.0
* Text Domain: emyth
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
			<div class="blog"><?php the_breadcrums();?></div>
			<div class="blog--losposts">
			<?php // The Loop
			if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
				<article class="contenido--item-single">
					<figure class="contenido--item-single-figure">
						<?php if( has_post_thumbnail() )
						{
							the_post_thumbnail('custom-thumb-600-400');
						}
						else
						{
							echo '<img src="' . get_stylesheet_directory_uri() . '/img/imagen.jpg" alt="alt" />';
						}?>
						<div class="miscelaneos">
							<div class="miscelaneos--fecha">
								<span class="icono-calendar2 icono-right"></span><?php echo date('d-m-Y');?>
							</div>
							<div class="miscelaneos--categoria">
								<span class="icono-folder icono-right"></span>
								<?php the_category( ' ', ' ', '' ); ?>
							</div>
							<?php if ( get_the_tags() != null ) { ?>
							<div class="miscelaneos--tag">
								<span class="icono-price-tag icono-right"></span>
								<?php the_tags( ' ', ', ', ' ' ); ?>
							</div>
							<?php };
							if (get_comments_number($post->ID) != 0 ) { ?>
							<div class="miscelaneos--comentarios">
								<span class="icono-bubbles icono-right"></span>
								<a href="<?php echo get_comments_link($post->ID);?>"><?php echo get_comments_number($post->ID);?></a>
							</div>
							<?php };?>
						</div>
					</figure>

					<div class="blog--item--content">
						<?php the_content();?>
					</div>
				</article>
			<?php endwhile;
			// Paginación de Atrás y Siguiente
			?>
		<section  class="comentarios">
			<article class="enlaces__navegacion">
				<?php previous_post_link('<div class="prev">%link</div>' );?>
				<?php next_post_link( '<div class="next">%link</div>' ); ?>
			</article>
		</section>

		<section class="comentarios">
			<article>
				<?php // Los Comentarios
				comments_template();

				// De vuelta la navegación de atrás y adelante
				?>
			</article>
		</section>

		<section  class="comentarios">
			<article class="enlaces__navegacion">
				<?php previous_post_link('<div class="prev">%link</div>' );?>
				<?php next_post_link( '<div class="next">%link</div>' ); ?>
			</article>
		</section>

			<?php else : ?>
				<article>
					<?php _e('No hay nada publicado.', 'emyth');?>
				</article>
			<?php endif;?>
			</div>
		</section>

	<?php get_sidebar('right');?>
	</main>
<?php get_sidebar();?>
<?php get_footer();?>