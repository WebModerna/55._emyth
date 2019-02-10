<?php
/**
* contacto.php
* @package WordPress
* @subpackage emyth
* @since emyth 2.0
* Text Domain: emyth
* Template Name: Contacto
*/

// Definición de variables a usar
$nombre_sitio	= get_bloginfo('name');
$facebook_contact = of_get_option('facebook_contact','');
$twitter_contact  = of_get_option('twitter_contact','');
$skype_contact    = of_get_option('skype_contact', '');
$linkedin_contact	= of_get_option('linkedin_contact', '');
$google_plus_contact = of_get_option('google_plus_contact', '');
$email_contact    = of_get_option('email_contact','');
$telefono_fijo    = of_get_option('telefono_fijo','');
$telefono_celular = of_get_option('telefono_celular','');
$direccion_web    = of_get_option('direccion_web','');

if(	!isset( $_SESSION ) )
{ 
	session_start(); 
}  // this MUST be called prior to any output including whitespaces and line breaks!

$GLOBALS['DEBUG_MODE'] = 0;
// CHANGE TO 0 TO TURN OFF DEBUG MODE
// IN DEBUG MODE, ONLY THE CAPTCHA CODE IS VALIDATED, AND NO EMAIL IS SENT

$GLOBALS['ct_recipient']   = $email_contact; // Change to your email address!
$GLOBALS['ct_msg_subject'] = __( 'Consulta vía web', 'emyth' );

// The form processor PHP code
function process_si_contact_form()
{
	$_SESSION['ctform'] = array(); // re-initialize the form session data

	if ( $_SERVER['REQUEST_METHOD'] == 'POST' && @$_POST['do'] == 'contact' )
	{
		// if the form has been submitted

		foreach( $_POST as $key => $value )
		{
			if ( !is_array( $key ) )
			{
				// sanitize the input data
				if ( $key != 'ct_message' ) $value = strip_tags( $value );
				$_POST[$key] = htmlspecialchars( stripslashes( trim( $value ) ) );
			}
		}

		$name				= @$_POST['ct_name'];		// name from the form
		$email				= @$_POST['ct_email'];		// email from the form
		$URL				= @$_POST['ct_URL'];		// el teléfono
		$educacion			= @$_POST['ct_educacion'];	// Opciones de educación
		$mensage			= @$_POST['ct_message'];	// the message from the form
		$captcha			= @$_POST['ct_captcha'];	// the user's entry for the captcha code
		$name				= substr( $name, 0, 64 );		// limit name to 64 characters

		$errors = array();  // initialize empty error array

		if ( isset( $GLOBALS['DEBUG_MODE'] ) && $GLOBALS['DEBUG_MODE'] == false )
		{
			// only check for errors if the form is not in debug mode
			// Nombre corto y error
			if ( strlen( $name ) < 3 )
			{
				$errors['name_error'] = __('Debes completar tu nombre y apellido', 'emyth');
			}

			// Teléfono corto y error
			if ( strlen( $URL ) < 8 )
			{
				$errors['telefono_error'] = __('Debes completar tu teléfono.', 'emyth');
			}

			// Educación sin datos
			if ( $educacion == "" )
			{
				$errors['educacion_error'] = __('Debes seleccionar tu nivel de educación.', 'emyth');
			}

			// Campo de email vacío
			if ( strlen( $email ) == 0 )
			{
				$errors['email_error'] = __('Debes completar tu dirección de correo eletrónico', 'emyth');
			}
			else if ( !preg_match( '/^(?:[\w\d]+\.?)+@(?:(?:[\w\d]\-?)+\.)+\w{2,4}$/i', $email ) )
			{
				// Formato de email inválido
				$errors['email_error'] = __('La dirección de correo electrónico es inválida.', 'emyth');
			}

			// Mensaje demasiado corto
			if ( strlen( $mensage ) < 20 )
			{
				$errors['message_error'] = __('Tienes que ingresar un mensaje.', 'emyth');
			}
		}

		// Only try to validate the captcha if the form has no errors
		// This is especially important for ajax calls
		if ( sizeof( $errors ) == 0 )
		{
			require_once 'includes/securimage/securimage.php';
			$securimage = new Securimage();

			if ( $securimage->check( $captcha ) == false )
			{
				$errors['captcha_error'] = __('El código de seguridad es incorrecto', 'emyth');
			}
		}

		if ( sizeof( $errors ) == 0 )
		{
			// no errors, send the form
			$time       = date('r');
			include_once "formulario_contacto.php";
			/*$message = "Este mensaje fue enviado desde Emyth Argentina. Es una consulta vía web.<br /><br />"
				. "Apellido y Nombre: $name<br />"
				. "Correo eletrónico: $email<br />"
				. "Teléfono: $URL<br />"
				. "Nivel de educación: $educacion<br />"
				. "Mensaje:<br />"
				. "<pre>$message</pre>"
				. "<br /><br />Dirección IP: {$_SERVER['REMOTE_ADDR']}<br />"
				. "Fecha y Hora: $time<br />"
				. "Navegador web: {$_SERVER['HTTP_USER_AGENT']}<br />";
charset=ISO-8859-1
				*/

			// $message = wordwrap ($message, 70 );

			if ( isset($GLOBALS['DEBUG_MODE'] ) && $GLOBALS['DEBUG_MODE'] == false )
			{
				// send the message with mail()
				mail( $GLOBALS['ct_recipient'], $GLOBALS['ct_msg_subject'], $message, "From: {$GLOBALS['ct_recipient']}\r\nReply-To: {$email}\r\nContent-type: text/html; charset=utf-8\r\nMIME-Version: 1.0" );
			}

			$_SESSION['ctform']['error']		= false;  // no error with form
			$_SESSION['ctform']['success']		= true; // message sent
		}
		else
		{
			// save the entries, this is to re-populate the form
			$_SESSION['ctform']['ct_name']		= $name;       // save name from the form submission
			$_SESSION['ctform']['ct_email']		= $email;		// save email
			$_SESSION['ctform']['ct_URL']		= $URL;        // guarda el teléfono
			$_SESSION['ctform']['ct_educacion']	= $educacion;	// guarda el nivel de educación
			$_SESSION['ctform']['ct_message']	= $mensage;		// save message

			foreach( $errors as $key => $error )
			{
				// set up error messages to display with each field
				$_SESSION['ctform'][$key] = "<span class='respuesta--mal'>$error</span>";
			}

			$_SESSION['ctform']['error'] = true; // set error floag
		}
	} // POST
}

$_SESSION['ctform']['success'] = false; // clear success value after running


get_header();?>
	<main>
		<div class="blog">
			<header class="heading">
				<h1 class="h1"><?php the_title();?></h1>
			</header>
		</div>
		<section class="contenido text-align-left">
			<div class="blog"><?php the_breadcrums();?></div>
			<?php rewind_posts(); if ( have_posts() ) : ?>
			<div>
			<?php while ( have_posts() ) : the_post(); ?>
				<article class="contacto contenido--item-single">
					<div>

<?php
// Process the form, if it was submitted
process_si_contact_form();

// The last form submission had 1 or more errors
if ( isset( $_SESSION['ctform']['error'] ) &&  $_SESSION['ctform']['error'] == true ):
?>

<div class="respuesta">
	<span class="respuesta--error"><?php _e('Hubo un error al enviar el mensaje :-(', 'emyth');?></span>
</div>

<?php
// form was processed successfully
elseif ( isset( $_SESSION['ctform']['success'] ) && $_SESSION['ctform']['success'] == true ):
?>

<div class="respuesta">
	<span class="respuesta--ok"><?php _e('Formulario enviado exitosamente :-D', 'emyth');?></span>
</div>

<?php endif; ?>
						<form class="contenido--item-single--content" method="post" action="<?php echo htmlspecialchars($_SERVER['REQUEST_URI'] . $_SERVER['QUERY_STRING']);?>" id="contact_form">
							<fieldset>
								<legend><?php _e('Apellido y Nombre', 'emyth');?></legend>
								<div class="resultado"><?php echo @$_SESSION['ctform']['name_error'];?></div>
								<input class="gradient" type="text" placeholder="..." maxlength="50" name="ct_name" value="<?php echo htmlspecialchars(@$_SESSION['ctform']['ct_name']);?>" />
								<input type="hidden" name="do" value="contact" />
							</fieldset>

							<fieldset>
								<legend>E-Mail</legend>
								<div class="resultado"><?php echo @$_SESSION['ctform']['email_error'];?></div>
								<input class="gradient" type="text" name="ct_email" id="ct_email" placeholder="@" maxlength="40" value="<?php echo htmlspecialchars(@$_SESSION['ctform']['ct_email']) ?>" />
							</fieldset>

							<fieldset>
								<legend><?php _e('Teléfono', 'emyth');?></legend>
								<div class="resultado"><?php echo @$_SESSION['ctform']['telefono_error'];?></div>
								<input class="gradient" type="tel" id="ct_URL" name="ct_URL" placeholder="..."  maxlength="13" value="<?php echo htmlspecialchars(@$_SESSION['ctform']['ct_URL']) ?>" />
							</fieldset>

							<fieldset>
								<legend><?php _e('Nivel de Educación', 'emyth');?></legend>
								<div class="respuesta"><?php echo @$_SESSION['ctform']['educacion_error'];?></div>
								<select name="ct_educacion" id="ct_educacion" class="gradient" >
									<option value="" <?php if( htmlspecialchars( @$_SESSION['ctform']['ct_educacion'] ) == "" ) { echo 'selected="selected"'; };?> ><?php _e('Seleccionar', 'emyth');?></option>
									<option value="Secundario" <?php if( htmlspecialchars( @$_SESSION['ctform']['ct_educacion'] ) == "Secundario" ) { echo 'selected="selected"'; };?>><?php _e('Secundario', 'emyth');?></option>
									<option value="Terciario" <?php if( htmlspecialchars( @$_SESSION['ctform']['ct_educacion'] ) == "Terciario" ) { echo 'selected="selected"'; };?>><?php _e('Terciario', 'emyth');?></option>
									<option value="Autodidacta" <?php if( htmlspecialchars( @$_SESSION['ctform']['ct_educacion'] ) == "Autodidacta" ) { echo 'selected="selected"'; };?>><?php _e('Autodidacta', 'emyth');?></option>
									<option value="Profesional Universitario" <?php if( htmlspecialchars( @$_SESSION['ctform']['ct_educacion'] ) == "Profesional Universitario" ) { echo 'selected="selected"'; };?>><?php _e('Profesional Universitario', 'emyth');?></option>
									<option value="Posgrado" <?php if( htmlspecialchars( @$_SESSION['ctform']['ct_educacion'] ) == "Posgrado" ) { echo 'selected="selected"'; };?>><?php _e('Posgrado', 'emyth');?></option>
									<option value="Magister" <?php if( htmlspecialchars( @$_SESSION['ctform']['ct_educacion'] ) == "Magister" ) { echo 'selected="selected"'; };?>><?php _e('Magister', 'emyth');?></option>
									<option value="Doctorado" <?php if( htmlspecialchars( @$_SESSION['ctform']['ct_educacion'] ) == "Doctorado" ) { echo 'selected="selected"'; };?>><?php _e('Doctorado', 'emyth');?></option>
								</select>
							</fieldset>

							<fieldset>
								<legend><?php _e('Mensaje', 'emyth');?></legend>
								<div class="respuesta"><?php echo @$_SESSION['ctform']['message_error'] ?></div>
								<textarea class="gradient" name="ct_message" id="ct_message" rows="5" maxlength="1000" placeholder="<?php _e('Escribir aquí', 'emyth');?>..."  ><?php echo htmlspecialchars(@$_SESSION['ctform']['ct_message']) ?></textarea>
							</fieldset>

							<fieldset class="captcha izquierda-contenido">
								<legend><?php _e('Escribe el código de la imagen', 'emyth');?></legend>
								<div class="respuesta"><?php echo @$_SESSION['ctform']['captcha_error'];?></div>
								<img id="siimage" class="captcha--imagen" src="<?php bloginfo('stylesheet_directory');?>/includes/securimage/securimage_show.php?sid=<?php echo md5(uniqid()) ?>" alt="CAPTCHA Image" />
								<object class="pointer" type="application/x-shockwave-flash" data="<?php bloginfo('stylesheet_directory');?>/includes/securimage/securimage_play.swf?bgcol=#ffffff&amp;icon_file=<?php bloginfo('stylesheet_directory');?>/includes/securimage/images/audio_icon.png&amp;audio_file=<?php bloginfo('stylesheet_directory');?>/includes/securimage/securimage_play.php">
									<param class="pointer" name="movie" value="<?php bloginfo('stylesheet_directory');?>/includes/securimage/securimage_play.swf?bgcol=#ffffff&amp;icon_file=<?php bloginfo('stylesheet_directory');?>/includes/securimage/images/audio_icon.png&amp;audio_file=<?php bloginfo("stylesheet_directory");?>/includes/securimage/securimage_play.php" />
								</object>
								<a href="#" title="<?php _e('Recargar imagen', 'emyth');?>" onclick="document.getElementById('siimage').src = '<?php bloginfo('stylesheet_directory');?>/includes/securimage/securimage_show.php?sid=' + Math.random(); this.blur(); return false">
									<img src="<?php bloginfo('stylesheet_directory');?>/includes/securimage/images/refresh.png" alt="<?php _e('Recargar imagen', 'emyth');?>" height="32" width="32" onclick="this.blur()" />
								</a>

								<input class="gradient captcha--input" type="text" id="ct_captcha" name="ct_captcha"  placeholder="abc12" maxlength="8" />
							</fieldset>

							<fieldset>
								<button class="boton-azul small" type="submit" name="enviar" id="enviar">
									<?php _e('Enviar', 'emyth');?>
									<span class="icono-check-alt icono-left"></span>
								</button>
								<button class="boton-naranja small" type="reset" name="borrar" id="borrar">
									<?php _e('Borrar', 'emyth');?>
									<span class="icono-x-altx-alt icono-left"></span>
								</button>
							</fieldset>
						</form>
					</div>
					<?php if( get_the_content() ) { ?>
					<hr />
					<div class="text-align-left"><?php the_content();?></div>
					<?php };?>
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