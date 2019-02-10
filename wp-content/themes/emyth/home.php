<?php
/**
* home.php
* @package WordPress
* @subpackage emyth
* @since emyth 2.0
* Text Domain: emyth
*/
?>
<?php get_header('home');?>


	<main>
<?php


// WP_Query arguments
$args = array (
	'post_type'              => array( 'mensajes' ),
	'order'                  => 'ASC',
	'orderby'                => 'menu_order',
	'nopaging'				=>	false,
	// 'cache_results'          => true,
);

// The Query
$mensajes_home = new WP_Query( $args );
$next_post = get_adjacent_post( true, '', false, 'taxonomy_slug' );

// The Loop
if ( $mensajes_home->have_posts() )
{
	while ( $mensajes_home->have_posts() )
	{
		$mensajes_home->the_post();
		$thumb_x1 = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'custom-thumb-300-x' );
		$url_x1 = $thumb_x1['0'];
		$thumb_x2 = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'custom-thumb-600-x' );
		$url_x2 = $thumb_x2['0'];
		$thumb_x3 = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'custom-thumb-900-x' );
		$url_x3 = $thumb_x3['0'];
		$thumb_x4 = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'custom-thumb-1200-x' );
		$url_x4 = $thumb_x4['0'];
		$thumb_x5 = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'custom-thumb-1500-x' );
		$url_x5 = $thumb_x5['0'];
		$thumb_x6 = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'custom-thumb-1800-x' );
		$url_x6 = $thumb_x6['0'];
		$thumb_x7 = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'custom-thumb-2100-x' );
		$url_x7 = $thumb_x7['0'];
		// do something

		// Variables definidas relacionadas a las páginas
		$leyenda_boton_1		=	rwmb_meta( 'emyth_leyenda_1', '' );
		$leyenda_boton_2		=	rwmb_meta( 'emyth_leyenda_2', '' );
		$leyenda_boton_3		=	rwmb_meta( 'emyth_leyenda_3', '' );
		$accion_boton_1			=	rwmb_meta( 'emyth_descarga_1', '' );
		$accion_boton_2			=	rwmb_meta( 'emyth_descarga_2', '' );
		$accion_boton_3			=	rwmb_meta( 'emyth_descarga_3', '' );
		$accion_boton_4			=	rwmb_meta( 'emyth_test', '' );

		// Variables relacionadas al sitio completo
		$boton_ebook_1			=	of_get_option( 'ebook_1', '' );
		$boton_ebook_2			=	of_get_option( 'ebook_2', '' );
		$boton_ebook_3			=	of_get_option( 'ebook_3', '' );
		$leyenda_ebook_1		=	of_get_option( 'leyenda_ebook_1', '' );
		$leyenda_ebook_2		=	of_get_option( 'leyenda_ebook_2', '' );
		$leyenda_ebook_3		=	of_get_option( 'leyenda_ebook_3', '' );
		$enlace_boton_3			=	of_get_option( 'enlace_boton_3', '' );
		$enlace_boton_4			=	of_get_option( 'enlace_boton_4', '' );
		$contenido_banner		=	of_get_option( 'contenido_banner', '' );
		$contenido_banner2		=	of_get_option( 'contenido_banner2', '' );
?>
		<section id="<?php echo 'mensajes--' . get_the_ID();?>" data-type="parallax_section" data-speed="5" class="mensajes">
			<style type="text/css">
				<?php // La base de todos
				echo '#mensajes--' . get_the_ID();?> {
					background-image: url("<?php echo $url_x5;?>");
				}
				@media only screen and (-webkit-min-device-pixel-ratio: 1.5), and (-moz-min-device-pixel-ratio: 1.5), and (-ms-min-device-pixel-ratio: 1.5), and (-o-min-device-pixel-ratio: 1.5), and (min-device-pixel-ratio: 1.5), and (min-resolution: 240dpi) {
					<?php echo '#mensajes--' . get_the_ID();?>
					{
						background-image: url("<?php echo $url_x7;?>");
					}
				}

				/* Hasta 900px */
				@media only screen and (max-width: 900px), and (max-device-width: 900px) {
					<?php echo '#mensajes--' . get_the_ID();?>
					{
						background-image: url("<?php echo $url_x3;?>");
					}
					@media only screen and (-webkit-min-device-pixel-ratio: 1.5), and (-moz-min-device-pixel-ratio: 1.5), and (-ms-min-device-pixel-ratio: 1.5), and (-o-min-device-pixel-ratio: 1.5), and (min-device-pixel-ratio: 1.5), and (min-resolution: 240dpi) {
						<?php echo '#mensajes--' . get_the_ID();?>
						{
							background-image: url("<?php echo $url_x6;?>");
						}
					}
				}

				/* Hasta 600px */
				@media only screen and (max-width: 600px), and (max-device-width: 600px) {
					<?php echo '#mensajes--' . get_the_ID();?>
					{
						background-image: url("<?php echo $url_x2;?>");
					}
					@media only screen and (-webkit-min-device-pixel-ratio: 1.5), and (-moz-min-device-pixel-ratio: 1.5), and (-ms-min-device-pixel-ratio: 1.5), and (-o-min-device-pixel-ratio: 1.5), and (min-device-pixel-ratio: 1.5), and (min-resolution: 240dpi) {
						<?php echo '#mensajes--' . get_the_ID();?>
						{
							background-image: url("<?php echo $url_x4;?>");
						}
					}
				}

				/* Hasta 300px */
				@media only screen and (max-width: 310px), and (max-device-width: 310px) {
					<?php echo '#mensajes--' . get_the_ID();?>
					{
						background-image: url("<?php echo $url_x1;?>");
					}
					@media only screen and (-webkit-min-device-pixel-ratio: 1.5), and (-moz-min-device-pixel-ratio: 1.5), and (-ms-min-device-pixel-ratio: 1.5), and (-o-min-device-pixel-ratio: 1.5), and (min-device-pixel-ratio: 1.5), only screen and (min-resolution: 240dpi) {
						<?php echo '#mensajes--' . get_the_ID();?>
						{
							background-image: url("<?php echo $url_x2;?>");
						}
					}
				}
			</style>
			<div class="mensajes--contenedor">
				<article class="articulo gradient">
					<header class="heading">
						<h2 class="h2"><?php the_title();?></h2>
					</header>
					<div class="mensajes--contenido">
						<?php the_content();?>
					</div>
					<div class="mensajes--botones">
					<?php

/*  BOTON UNO (1) ============================================================================ */
					// chechear si está habilitado para mostrarse desde mensajes para la home.
					if ( $accion_boton_1 )
					{
						// E-Book 1. Si no hay subido ningún archivo no se muestra nada
						if ( $boton_ebook_1 )
						{
							echo '<a download="' . $boton_ebook_1 . '" href="' . $boton_ebook_1 . '" class="boton boton-rojo small">';

							// Chequeando si hay algo cargado en la leyenda
							if ( $leyenda_ebook_1 )
							{
								echo $leyenda_ebook_1;
							} else {
								echo __('Botón 1', 'emyth');
							}

							echo '<span class="icono-download icono-left"></span></a>';
						};
					};
					// Si no está activado no se muestra nada


/*  BOTON DOS (2) ============================================================================ */
					// Chechear si está habilitado para mostrarse desde mensajes para la home.
					if ( $accion_boton_2 )
					{
						// E-Book 2. Si no hay subido ningún archivo no se muestra nada.
						if ( $boton_ebook_2 )
						{
							// Verificamos si el usuario está logueado
							if ( is_user_logged_in() )
							{
								echo '<a download="' . $boton_ebook_2 . '" href="' . $boton_ebook_2 . '" class="boton boton-negro small">';

								// Chequeando si hay algo cargado en la leyenda
								if ( $leyenda_ebook_2 )
								{
									echo $leyenda_ebook_2;
								} else {
									echo __('Botón 2', 'emyth');
								}

								echo '<span class="icono-download icono-left"></span></a>';

							} else {

								// Si el usuario no está logueado, o no registrado; mostramos un botón común
								echo '<a href="#ebook_' . get_the_id() . '" class="boton boton-negro small fancybox">';

								// Chequeando si hay algo cargado en la leyenda
								if ( $leyenda_ebook_2 )
								{
									echo $leyenda_ebook_2;
								} else {
									echo __('Botón 2', 'emyth');
								}

								echo '<span class="icono-download icono-left"></span></a>';

								// Alerta con contenido
								if ( $contenido_banner )
								{
									echo '
									<div class="banner_oculto" id="ebook_' . get_the_id() . '">
										<div class="alerta alerta-amarillo">
											<div class="alerta--icono">
												<span class="icono-denied"></span>
											</div>
											<div class="alerta--mensaje">
												' . $contenido_banner . '
											</div>
										</div>
										<div>
											<a target="_blank" href="' . wp_registration_url() . '" class="boton boton-naranja">
												' . __("Registrarse", "emyth") . '
												<span class="icono-enter icono-left"></span>
											</a>
											<a target="_blank" href="' . wp_login_url() . '" class="boton boton-azul">
												' . __("Entrar", "emyth") . '
												<span class="icono-user2 icono-left"></span>
											</a>
										</div>
									</div>
									';
								};
							};
						}
					};


/*  BOTON TRES (3) ============================================================================ */
					// Chechear si está habilitado para mostrarse desde mensajes para home
					if ( $accion_boton_3 )
					{
						// E-Book 3. Si no hay subido ningún archivo no se muestra nada
						if( $boton_ebook_3 )
						{
							echo '<a href="#ebook_' . get_the_id() . '" class="boton boton-naranja small fancybox">';

							// Chequeando si hay algo cargado en la leyenda
							if ( $leyenda_ebook_3 )
							{
								echo $leyenda_ebook_3;
							} else {
								echo __('Botón 3', 'emyth');
							}

							echo '<span class="icono-download icono-left"></span></a>';
						};


						// Alerta con contenido. Muestra un enlace para llenar una encuesta
						if ( $contenido_banner )
						{
							// Verificamos si el usuario está logueado. Si lo está lo mandamos directo a la encuesta.
							if ( is_user_logged_in() )
							{
								echo '
								<div class="banner_oculto" id="ebook_' . get_the_id() . '">
									<div class="alerta alerta-amarillo">
										<div class="alerta--icono">
											<span class="icono-denied"></span>
										</div>
										<div class="alerta--mensaje">
											' . $contenido_banner2 . '
										</div>
									</div>
									<div>
										<a href="' . get_page_link( $enlace_boton_3 ) . '" class="boton boton-naranja">
											' . get_the_title( $enlace_boton_3 ) . '
											<span class="icono-profile icono-left"></span>
										</a>
									</div>
								</div>
								';
							}

							// Al no estarlo, lo mandamos a que se loguee o se registre.
							else
							{
								echo '
								<div class="banner_oculto" id="ebook_' . get_the_id() . '">
									<div class="alerta alerta-amarillo">
										<div class="alerta--icono">
											<span class="icono-denied"></span>
										</div>
										<div class="alerta--mensaje">
											' . $contenido_banner2 . '
										</div>
									</div>
									<div>
										<a href="' . wp_registration_url() . '" class="boton boton-naranja">
											' . __("Registrarse", "emyth") . '
											<span class="icono-user2 icono-left"></span>
										</a>
										<a href="' . wp_login_url() . '" class="boton boton-azul">
											' . __("Entrar", "emyth") . '
											<span class="icono-enter icono-left"></span>
										</a>
									</div>
								</div>
								';
							}

						} else {
							// Al no haber nada cargado en el banner se muestra un mensaje por defecto
							echo '
							<div class="banner_oculto" id="ebook_' . get_the_id() . '">
								<div class="alerta alerta-amarillo">
									<div class="alerta--icono">
										<span class="icono-denied"></span>
									</div>
									<div class="alerta--mensaje">
										<h4>' . __('No hay contenido para mostrar', 'emyth') . ' </h4>
									</div>
								</div>
							</div>
							';
						}

					};


/*  BOTON CUATRO (4) ============================================================================ */
					// Chequear si está habilitado el botón 4
					if ( $accion_boton_4 )
					{
						echo '<a href="' . get_page_link( $enlace_boton_4 ) . '" class="boton boton-azul small">
							' . __('Hacer test', 'emyth') . '
							<span class="icono-clipboard icono-left"></span>
						</a>';
					}
					;?>
					</div>
				</article>
				<div class="mensajes--godown">
					<?php /*$next_post = get_adjacent_post( false, '', false );
					if ( is_a( $next_post, 'WP_Post' ) ) {*/ ?>
					<a href="<?php //echo '#mensajes--' . $next_post->ID;?>" class="mensajes--godown-link gradient"></a>
					<?php //} ?>
					<div class="mensajes--godown-sombra"></div>
				</div>
			</div>
		</section>
<?php
	}
} else {
	// no posts found
	echo __('No hay nada.', 'emyth');
}
// Restore original Post Data
wp_reset_postdata();
?>
	</main>
<?php get_sidebar();?>
<?php get_footer();?>