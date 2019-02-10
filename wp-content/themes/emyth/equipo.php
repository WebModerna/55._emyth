<?php
/*
* equipo.php
* @package WordPress
* @subpackage emyth
* @since emyth 2.0
* Text Domain: emyth
* Template Name: Equipo de Trabajo
*/
?>
<?php get_header();
?>

	<main>
		<div class="blog">
			<header class="heading">
				<h1 class="h1"><?php the_title();?></h1>
			</header>
		</div>
		<section class="team contenido text-align-left">
			<div><?php the_breadcrums();?></div>
			<article class="blog--item--content acordeon">
				<?php
					rewind_posts();
					if ( have_posts() ) : while ( have_posts() ) : the_post();
					the_content();
					endwhile;
					endif;
				?>
			</article>
			<div class="blog team--header">
				<header class="heading">
					<h2 class="h2"><?php _e('Equipo de Trabajo', 'emyth');?></h2>
				</header>
			</div>
			<div>

		<?php
		// WP_Query arguments
		$args = array (
			'post_type'              => array( 'team_work' ),
			'cache_results'          => true,
			'update_post_meta_cache' => true,
			'update_post_term_cache' => true,
		);

		// The Query
		$equipo_de_trabajo = new WP_Query( $args );
		// The Loop
		if ( $equipo_de_trabajo->have_posts() ) {
			while ( $equipo_de_trabajo->have_posts() ) {
				$equipo_de_trabajo->the_post();?>
				<article class="team--item">
					<figure class="team--item--foto alignleft">
						<?php if( has_post_thumbnail() )
						{
							the_post_thumbnail('custom-thumb-300-200');
						} else {
							echo '<img src="' . get_stylesheet_directory_uri() . '/img/logo3.png" alt="Sin imagen" />';
						}?>
					</figure>
					<h4 class="team--item--titulo"><span class="icono-user2 icono-right"></span><?php the_title();?></h4>
					<?php the_content();?>
				</article>
				<div class="clearfix"></div>
				<hr />
			<?php }
			} else { ?>
				<article class="team--item">
					<figure class="team--item--foto alignleft">
						<img src="<?php echo get_stylesheet_directory_uri();?>/img/logo3.png" alt="alt" />
					</figure>
					<div class="team--descripcion">
						<h4 class="team--item--titulo"><?php _e('No hay nadie', 'emyth');?></h4>
						<p><?php _e('No hay ningún integrante del equipo de trabajo hasta ahora. Debes agregar a alquien.', 'emyth');?></p>
					</div>
				</article>
				<?php }; wp_reset_postdata();?>
			</div>
		</section>
	<?php get_sidebar('right');?>
	</main>

<?php get_sidebar();?>
<?php get_footer();?>