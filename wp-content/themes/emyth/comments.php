<?php
/**
* comments.php
* @package WordPress
* @subpackage emyth
* @since emyth 2.0
* Text Domain: emyth
*/
?>

<?php
	if ( !empty( $_SERVER['SCRIPT_FILENAME'] ) && 'comments.php' == basename( $_SERVER['SCRIPT_FILENAME'] ) )
		die (__('Por favor, no cargues esta página directamente. Gracias :-D', 'emyth'));

	if ( post_password_required() )
	{
		_e('Esta publicación está protegida con contraseña. Iniciá sesión para ver los comentarios.', 'emyth');
		return;
	}
?>

<?php if ( have_comments() ) : ?>
	<div class="blog">
		<header class="heading">
			<h2 id="comments">
				<?php comments_number( __('No hay respuestas', 'emyth'), __('Una Respuesta', 'emyth'), __('% Respuestas', 'emyth') );?>
			</h2>
		</header>
	</div>

	<div class="navigation">
		<div class="next-posts"><?php previous_comments_link();?></div>
		<div class="prev-posts"><?php next_comments_link();?></div>
	</div>

	<ul class="commentlist">
		<?php
			wp_list_comments();
			$args = array(
				'walker'            => null,
				'max_depth'         => '',
				'style'             => 'ul',
				'callback'          => null,
				'end-callback'      => null,
				'type'              => 'all',
				'reply_text'        => __('Responder', 'emyth'),
				'page'              => '',
				'per_page'          => '',
				'avatar_size'       => 64,
				'reverse_top_level' => null,
				'reverse_children'  => '',
				'format'            => 'html5',	// or 'xhtml' if no 'HTML5' theme support
				'short_ping'        => false,	// @since 3.6
				'echo'              => true		// boolean, default is true
			);
		?>
	</ul>

	<div class="navigation">
		<div class="next-posts"><?php previous_comments_link();?></div>
		<div class="prev-posts"><?php next_comments_link();?></div>
	</div>

<?php else : // this is displayed if there are no comments so far ?>

	<?php if ( comments_open() ) : ?>
		<!-- If comments are open, but there are no comments. -->

	<?php else : // comments are closed ?>

		<div class="alerta alerta-rojo">
			<div class="alerta--icono">
				<span class="icono-denied"></span>
			</div>
			<div class="alerta--mensaje">
				<h4><?php _e('Los comentarios están cerrados.', 'emyth');?></h4>
			</div>
		</div>

	<?php endif; ?>

<?php endif; ?>

<?php if ( comments_open() ) : ?>

<div id="respond" class="blog">
	<header class="heading">
		<h2>
			<?php comment_form_title( __('Dejar un Comentario', 'emyth'), __('Dejar un Comentario a %s', 'emyth') ); ?>
		</h2>
	</header>

	<div class="cancel-comment-reply">
		<?php cancel_comment_reply_link(); ?>
	</div>

	<?php if ( get_option('comment_registration') && !is_user_logged_in() ) : ?>
		<p>
			<a class="boton boton-azul small" href="<?php echo wp_login_url( get_permalink() ); ?>">
				<?php _e('Iniciar sesión', 'emyth');?>
			</a>
			<?php _e('para publicar un comentario', 'emyth');?>.
		</p>
	<?php else : ?>


	<form class="formulario" action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post" id="commentform">

		<?php if ( is_user_logged_in() ) : ?>

			<div>
				<?php _e('Hola', 'emyth');?>
				<a class="boton small boton-azul" href="<?php echo get_option('siteurl'); ?>/wp-admin/profile.php">
					<?php echo $user_identity; ?>
					<span class="icono-user2 icono-left"></span>
				</a>
				<a class="boton boton-naranja small" href="<?php echo wp_logout_url(get_permalink()); ?>" title="<?php __('Cerrar sesión', 'emyth') ?>">
					<?php _e('Salir', 'emyth');?>
					<span class="icono-exit icono-left"></span>
				</a>
			</div>

		<?php else : ?>

			<div>
				<input required="required" placeholder="<?php _e('Apellido y Nombre', 'emyth');?>" type="text" name="author" id="author" value="<?php echo esc_attr($comment_author); ?>" maxlength="50" tabindex="1" <?php if ($req) echo "aria-required='true'"; ?> />

				<input required="required" placeholder="<?php _e('E-Mail. No será publicado', 'emyth');?>" type="email" name="email" id="email" value="<?php echo esc_attr($comment_author_email); ?>" maxlength="50" tabindex="2" <?php if ($req) echo "aria-required='true'"; ?> />
			</div>

			<!-- <div>
				<input type="text" name="url" id="url" value="<?php // echo esc_attr($comment_author_url); ?>" size="22" tabindex="3" />
				<label for="url">Pagina Web</label>
			</div> -->

		<?php endif; ?>

		<!--<p>You can use these tags: <code><?php // echo allowed_tags(); ?></code></p>-->

		<div>
			<textarea required="required" placeholder="<?php _e('Comentario', 'emyth');?>" name="comment" id="comment" cols="38" rows="10" tabindex="4" maxlength="999"></textarea>
		</div>

		<div>
			<button class="boton boton-azul small" name="submit" type="submit" id="submit">
				<?php _e('Enviar', 'emyth');?>
				<span class="icono-upload icono-left"></span>
			</button>
			<button class="boton boton-rojo small" name="reset" type="reset" id="reset">
				<?php _e('Limpiar', 'emyth');?>
				<span class="icono-x icono-left"></span>
			</button>
			<?php comment_id_fields(); ?>
		</div>

		<?php do_action('comment_form', $post->ID); ?>

	</form>

	<?php endif; // If registration required and not logged in ?>

</div>

<?php endif; ?>