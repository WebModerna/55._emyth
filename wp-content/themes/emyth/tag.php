<?php
/**
* tag.php
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
				<h1 class="h1"><?php _e('Etiquetas: ', 'emyth'); echo '"'.single_tag_title( '', false ).'"';?></h1>
			</header>
		</div>
		<section class="contenido contenedor text-align-left">
			<div><?php the_breadcrums();?></div>
			<div class="blog--losposts">
			<?php // The Loop
			if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
				<article class="blog--item">
					<header>
						<h4 class="blog--item--header"><a href="<?php the_permalink();?>"><?php the_title();?></a></h4>
					</header>
					<figure>
						<div class="blog--item--nota gradient">
							<div class="blog--item--nota--fecha">
								<i class="icono-calendar icono-right"></i><?php echo date('d-m-Y');?>
							</div>
						</div>
						<?php if( has_post_thumbnail() ) {
							the_post_thumbnail('custom-thumb-300-200');
						} else {
							echo '<img src="' . get_stylesheet_directory_uri() . '/img/imagen.jpg" alt="alt" />';
						}?>
						<div class="miscelaneos">
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
						<?php the_excerpt();?>
						<a class="small boton boton-azul" title="<?php the_title();?>" href="<?php the_permalink();?>"><?php _e('Leer más', 'emyth');?></a>
					</div>
				</article>
			<?php endwhile;

			echo '<div class="pagination">';
			if ( function_exists( "pagination" ) )
			{
				if ( pagination() != null )
				{
					pagination();
				}
			};
			echo '</div>';

			else : ?>
				<article>
					<?php _e( 'No hay nada publicado.', 'emyth' );?>
				</article>
			<?php endif;?>
			</div>
		</section>
	<?php get_sidebar('right');?>
	</main>
<?php get_sidebar();?>
<?php get_footer();?>