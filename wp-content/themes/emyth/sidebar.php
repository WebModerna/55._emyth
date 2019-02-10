<?php
/* sidebar.php
* @package WordPress
* @subpackage emyth
* @since emyth 1.0
* Text Domain: emyth
*/
?>
<div class="footer">
	<div class="sidebar">
		<?php
			// Acá van las cuatro sidebar del footer.

			dynamic_sidebar('sidebar_footer_1');
			dynamic_sidebar('sidebar_footer_2');
			// dynamic_sidebar('sidebar_footer_3');
			// dynamic_sidebar('sidebar_footer_4');
			$telefono_fijo		=	of_get_option( 'telefono_fijo', '' );
			$telefono_celular	=	of_get_option( 'telefono_celular', '' );
			$direccion_web		=	of_get_option( 'direccion_web', '' );
			$skype_contact		=	of_get_option( 'skype_contact', '');
			$email_contact		=	of_get_option( 'email_contact', '' );
			// cycle-slideshow
		?>
		<section class="widget--box" >
			<header class="widget--box--title">
				<h3><?php _e('Testimonios');?></h3>
			</header>
			<div class="widget--box--content cycle-slideshow" data-cycle-fx="fade"
			data-cycle-timeout="4000"
			data-cycle-pause-on-hover="true"
			data-cycle-swipe="true"
			data-cycle-slides=".bloques">
<?php

// WP_User_Query arguments
$args = array (
	'role'           => 'Subscriber',
	'order'          => 'DESC',
	'orderby'		=>	'random',
	'number'		=>	6,
	'orderby'        => 'user_registered',
	'fields'         => 'all',
);

// The User Query
$testimonios = new WP_User_Query( $args );

// The User Loop
if ( !empty( $testimonios->results ) )
{
	foreach ( $testimonios->results as $user )
	{
		// do something
?>
				<div class="bloques">
					<blockquote class="table">
						<div class="table--celda primera">
							<cite>
								<a href="<?php the_author_meta( 'user_url', $user->ID );?>">
									<?php the_author_meta( 'display_name', $user->ID );?>
								</a>
							</cite>
						</div>
						<div class="table--celda">
							<?php
							// retrieve our additional author meta info
							$user_meta_image = esc_attr( get_the_author_meta( 'user_meta_image', $post->post_author ) );

							// make sure the field is set
							if ( isset( $user_meta_image ) && $user_meta_image )
							{
								// only display if function exists
								if ( function_exists( 'get_additional_user_meta_thumb' ) ) ?>
								<img alt="Foto" src="<?php echo get_additional_user_meta_thumb();?>" />

							<?php } ?>
						</div>
					</blockquote>
					<div>
						<?php echo esc_attr( get_the_author_meta( 'user_opinion', $user->ID ) );?>
					</div>
				</div>
<?php		}
} else {
	// no users found

?>
				<blockquote>
					<div class="table">
						<div class="table--celda primera">
							<cite>Yani La Siento</cite>
						</div>
						<div class="table--celda">
							<figure>
								<img src="<?php bloginfo('stylesheet_directory');?>/img/team-1.jpg" alt="cuadrada" />
							</figure>
						</div>
					</div>
					<h4 class="heading widget--box--borde_inferior">Fulanito de tal</h4>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem accusantium deleniti, nulla esse quia at nihil sapiente!
				</blockquote>
<?php }
// Restore original Post Data
wp_reset_postdata();

?>
			</div>
		</section>
		<section class="widget--box">
			<header class="widget--box--title">
				<h3><?php _e('Contacto', 'emyth');?></h3>
			</header>
			<ul>
				<?php if ( $telefono_fijo ) { ?>
				<li><span class="icono-phone icono-right"></span><?php echo $telefono_fijo;?></li>
				<?php }; if ( $telefono_celular ) { ?>
				<li><span class="icono-mobile icono-right"></span><?php echo $telefono_celular;?></li>
				<?php }; if ( $direccion_web ) { ?>
				<li><span class="icono-map icono-right"></span><?php echo $direccion_web;?></li>
				<?php }; if ( $email_contact ) { ?>
				<li><span class="icono-mail icono-right"></span><?php echo $email_contact;?></li>
				<?php }; if ( $skype_contact ) {
				echo '
					<script type="text/javascript" src="//secure.skypeassets.com/i/scom/js/skype-uri.js"></script>
					<li>
						<div id="SkypeButton_Call_' . $skype_contact . '_1">
							<script type="text/javascript">
							Skype.ui({
								"name": "call",
								"element": "SkypeButton_Call_' . $skype_contact . '_1",
								"participants": ["' . $skype_contact . '"],
								"imageSize": 32
							});
							</script>
						</div>
					</li>
				';};?>
			</ul>
		</section>
	</div>
</div>