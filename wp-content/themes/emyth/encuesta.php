<?php
/**
* contacto.php
* @package WordPress
* @subpackage emyth
* @since emyth 2.0
* Text Domain: emyth
* Template Name: Encuesta
*/

$email_contact    = of_get_option('email_contact', '');
$GLOBALS['DEBUG_MODE'] = 0;
// session_start();
// this MUST be called prior to any output including whitespaces and line breaks!
// CHANGE TO 0 TO TURN OFF DEBUG MODE
// IN DEBUG MODE, ONLY THE CAPTCHA CODE IS VALIDATED, AND NO EMAIL IS SENT

$GLOBALS['ct_recipient']   = $email_contact; // Change to your email address!
$GLOBALS['ct_msg_subject'] = __( 'Encuesta vía web', 'emyth' );

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

		$name			= @$_POST['ct_name'];				// Apellido y nombre
		$email			= @$_POST['ct_email'];				// Captura del email
		$cargo_posicion	= @$_POST['ct_cargo_posicion'];		// Captura del cargo o posición empresaria
		$nombre_empresa	= @$_POST['ct_nombre_empresa'];		// Nombre empresa
		$rubro			= @$_POST['ct_rubro'];				// Rubro empresarial
		$localidad		= @$_POST['ct_localidad'];			// Localidad de la empresa
		$ventas_anterior = @$_POST['ct_ventas_anterior'];	// Ventas del año pasado de la empresa
		$ventas_anterior_moneda = @$_POST['ct_ventas_anterior_moneda'];	// Ventas del año pasado de la empresa
		$educacion		= @$_POST['ct_educacion'];			// Nivel de educación
		$personal		= @$_POST['ct_personal'];			// Personal a cargo
		$hace_cuanto	= @$_POST['ct_hace_cuanto'];		// Hace cuánto está en al actividad
		$telefono			= @$_POST['ct_telefono'];			// Teléfono
		$conocimiento		= @$_POST['ct_conocimiento'];		// Dónde conoció a Emyth?
		$conocimiento_otro	= @$_POST['ct_conocimiento_otro'];	// Dónde conoció a Emyth?
		$si_coaching		= @$_POST['ct_si_coaching'];		// Sí al coaching
		$mensage			= @$_POST['ct_message'];			// the message from the form
		$captcha			= @$_POST['ct_captcha'];			// para capturar el código captcha
		$name				= substr( $name, 0, 64 );			// limit name to 64 characters

		$errors = array();  // initialize empty error array

		// only check for errors if the form is not in debug mode
		if ( isset( $GLOBALS['DEBUG_MODE'] ) && $GLOBALS['DEBUG_MODE'] == false )
		{
			// Nombre corto y error
			if ( strlen( $name ) < 3 )
			{
				$errors['name_error'] = __('Debes completar tu nombre y apellido', 'emyth');
			}

			// Campo de email vacío
			if ( strlen( $email ) == 0 )
			{
				$errors['email_error'] = __('Debes completar tu dirección de correo eletrónico', 'emyth');
			}
			// Formato de email inválido
			else if ( !preg_match( '/^(?:[\w\d]+\.?)+@(?:(?:[\w\d]\-?)+\.)+\w{2,4}$/i', $email ) )
			{
				$errors['email_error'] = __('La dirección de correo electrónico es inválida.', 'emyth');
			}

			// Nombre de la empresa
			if ( strlen( $nombre_empresa ) < 3 )
			{
				$errors['nombre_empresa_error'] = __('Debes completar el nombre de tu empesa', 'emyth');
			}

			// Cargo o posición dentro de la empesa
			if ( strlen( $cargo_posicion ) < 3 )
			{
				$errors['cargo_posicion_error'] = __('Debes completar el cargo o la posición que ocupas en la empesa', 'emyth');
			}

			// Localidad
			if ( strlen( $localidad ) < 3 )
			{
				$errors['localidad_error'] = __('Debes completar la localidad', 'emyth');
			}

			// Rubro/Actividad de la empresa
			if ( strlen( $rubro ) < 3 )
			{
				$errors['rubro_error'] = __('Debes completar el rubro o la actividad de la empresa.', 'emyth');
			}

			// Año de fundación
			if ( strlen( $hace_cuanto ) < 4 )
			{
				$errors['hace_cuanto_error'] = __('Debes colocar el año que más o menos comenzó la empresa.', 'emyth');
			}

			// Ventas del año anterior
			if ( $ventas_anterior_moneda == false )
			{
				$errors['ventas_anterior_error'] = __('Debes elegir un tipo de moneda.', 'emyth');
			}
			if ( strlen( $ventas_anterior ) < 3 )
			{
				$errors['ventas_anterior_error'] = __('Debes colocar en monto de pesos, las ventas del año anterior', 'emyth');
			}

			// Personal a cargo
			if ( $personal == "" )
			{
				$errors['personal_error'] = __('Si no tienes empleados debes poner 0 (cero).', 'emyth');
			}

			// Teléfono corto y error
			if ( strlen( $telefono ) < 8 )
			{
				$errors['telefono_error'] = __('Debes completar tu teléfono.', 'emyth');
			}

			// Educación sin datos
			if ( $educacion == "" )
			{
				$errors['educacion_error'] = __('Debes seleccionar tu nivel de educación.', 'emyth');
			}

			// Cómo conociste a E-Myth
			if ( $conocimiento == "" )
			{
				$errors['conocimiento_error'] = __('Debes elegir una opción.', 'emyth');
			}
			if ( $conocimiento_otro == "" and $conocimiento == __('Otro', 'emyth')  )
			{
				$errors['conocimiento_error'] = __('Debes elegir una opción.', 'emyth');
			}

			// Coaching
			if ( $si_coaching == false )
			{
				$errors['si_coaching_error'] = __('Debes estar de acuerdo sí o sí. ¿Lo estás?', 'emyth');
			}

			// frustraciones sin datos
			if ( $mensage == false )
			{
				$errors['message_error'] = __('Tienes que elegir mínimo unas tres opciones.', 'emyth');
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
			$time       = date( 'r' );
			/*$message = "Este mensaje ha sido enviado desde Emyth Argentina.  .<br /><br />"
				. "Apellido y Nombre: $name<br />"
				. "E-Mail: $email<br />"
				. "Teléfono: $telefono<br />"
				. "Nombre de la Empresa: $empresa<br />"
				. "Cargo / Posición en la Empresa: $cargo_posicion<br />"
				. "Localidad: $localidad<br />"
				. "Rubro / Principal Producto: $rubro<br />"
				. "Año de Fundación: $hace_cuanto<br />"
				. "Nivel de educación: $educacion<br />"
				. "Ventas del año pasado: $ventas_anterior<br />"
				. "Personal a cargo: $personal<br />"
				. "Principales frustraciones:<br />"
				. "<pre>$message</pre><br />"
				. "Cómo conociste E-Myth?: $conocimiento<br />"
				. "<br /><br />Dirección IP: {$_SERVER['REMOTE_ADDR']}<br />"
				. "Fecha y Hora: $time<br />"
				. "Navegador Web: {$_SERVER['HTTP_USER_AGENT']}<br />";*/
			include_once "formulario_encuesta.php";
			// $message = wordwrap( $message, 70 );

			if ( isset( $GLOBALS['DEBUG_MODE'] ) && $GLOBALS['DEBUG_MODE'] == false )
			{
				// send the message with mail()
				mail( $GLOBALS['ct_recipient'], $GLOBALS['ct_msg_subject'], $message, "From: {$GLOBALS['ct_recipient']}\r\nReply-To: {$email}\r\nContent-type: text/html; charset=utf-8\r\nMIME-Version: 1.0" );
			}

			$_SESSION['ctform']['error']		= false;  // no error with form
			$_SESSION['ctform']['success']		= true; // message sent
		} else {
			// save the entries, this is to re-populate the form
			$_SESSION['ctform']['ct_name']				= $name;
			$_SESSION['ctform']['ct_email']				= $email;
			$_SESSION['ctform']['ct_cargo_posicion']	= $cargo_posicion;
			$_SESSION['ctform']['ct_nombre_empresa']	= $nombre_empresa;
			$_SESSION['ctform']['ct_localidad']			= $localidad;
			$_SESSION['ctform']['ct_rubro']				= $rubro;
			$_SESSION['ctform']['ct_hace_cuanto']		= $hace_cuanto;
			$_SESSION['ctform']['ct_ventas_anterior_moneda']	= $ventas_anterior_moneda;
			$_SESSION['ctform']['ct_ventas_anterior']	= $ventas_anterior;
			$_SESSION['ctform']['ct_personal']			= $personal;
			$_SESSION['ctform']['ct_telefono']			= $telefono;
			$_SESSION['ctform']['ct_educacion']			= $educacion;
			$_SESSION['ctform']['ct_conocimiento']		= $conocimiento;
			$_SESSION['ctform']['ct_conocimiento_otro']	= $conocimiento_otro;
			$_SESSION['ctform']['ct_si_coaching']		= $si_coaching;
			$_SESSION['ctform']['ct_message']			= $mensage;

			foreach($errors as $key => $error) {
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
			<?php while ( have_posts() ) : the_post();
			if ( is_user_logged_in() ) { ?>
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
			<span class="respuesta--ok"><?php _e('¡Gracias por responder! ¡Que disfrutes la última partel del libro!', 'emyth');?></span>
		</div>
		<div>
			<?php
			// Variables del botón 3
			$leyenda_ebook_3	=	of_get_option( 'leyenda_ebook_3', '' );
			$ebook_3		=	of_get_option( 'ebook_3', '' );

			// Verificamos si tiene cargado algo.
			if( $ebook_3 )
			{
				echo '
				<div class="alerta alerta-verde">
					<div class="alerta--icono">
						<span class="icono-check-alt"></span>
					</div>
					<div class="alerta--mensaje">
						<h4>' . __('Ahora puedes bajar la última parte del libro', 'emyth') . ' </h4>
						<hr>
						<a class="boton boton-azul small" target="_blank" href="' . $ebook_3 . '" >';

							// Comprobamos si tiene alguna leyenda para mostrar
							if( $leyenda_ebook_3 )
							{
								echo $leyenda_ebook_3;
							} else {
								echo __('Botón 3', 'emyth');
							};

							echo '<span class="icono-download icono-left"></span>
						</a>
					</div>
				</div>';
			};?>
		</div>

		<?php endif; ?>
						<form class="contenido--item-single--content" method="post" action="<?php echo htmlspecialchars($_SERVER['REQUEST_URI'] . $_SERVER['QUERY_STRING']);?>" id="contact_form">
							<fieldset>
								<legend><?php _e('Apellido y Nombre', 'emyth');?></legend>
								<div class="resultado"><?php echo @$_SESSION['ctform']['name_error'];?></div>
								<input class="gradient" type="text" placeholder="..." maxlength="50" name="ct_name" value="<?php echo htmlspecialchars( @$_SESSION['ctform']['ct_name'] );?>" />
								<input type="hidden" name="do" value="contact" />
							</fieldset>

							<fieldset>
								<legend>E-Mail</legend>
								<div class="resultado"><?php echo @$_SESSION['ctform']['email_error'];?></div>
								<input class="gradient" type="text" name="ct_email" id="ct_email" placeholder="@" maxlength="40" value="<?php echo htmlspecialchars( @$_SESSION['ctform']['ct_email'] );?>" />
							</fieldset>

							<fieldset>
								<legend><?php _e('Cargo o posición dentro de la empresa', 'emyth');?></legend>
								<div class="resultado"><?php echo @$_SESSION['ctform']['cargo_posicion_error'];?></div>
								<input class="gradient" type="text" placeholder="..." maxlength="60" name="ct_cargo_posicion" value="<?php echo htmlspecialchars( @$_SESSION['ctform']['ct_cargo_posicion'] );?>" />
							</fieldset>

							<fieldset>
								<legend><?php _e('Nombre de la empresa');?></legend>
								<div class="resultado"><?php echo @$_SESSION['ctform']['nombre_empresa_error'];?></div>
								<input type="text" class="gradient" placeholder="..." maxlength="50" name="ct_nombre_empresa" id="ct_nombre_empresa" value="<?php echo htmlspecialchars( @$_SESSION['ctform']['ct_nombre_empresa'] );?>" />
							</fieldset>

							<fieldset>
								<legend><?php _e('Localidad');?></legend>
								<div class="resultado"><?php echo @$_SESSION['ctform']['localidad_error'];?></div>
								<input type="text" class="gradient" placeholder="..." maxlength="50" name="ct_localidad" id="ct_localidad" value="<?php echo htmlspecialchars( @$_SESSION['ctform']['ct_localidad'] );?>" />
							</fieldset>

							<fieldset>
								<legend><?php _e('Rubro / Principal producto');?></legend>
								<div class="resultado"><?php echo @$_SESSION['ctform']['rubro_error'];?></div>
								<input type="text" class="gradient" placeholder="..." maxlength="100" name="ct_rubro" id="ct_rubro" value="<?php echo htmlspecialchars( @$_SESSION['ctform']['ct_rubro'] );?>" />
							</fieldset>

							<fieldset>
								<legend><?php _e('Año de fundación de la empresa', 'emyth');?></legend>
								<div class="respuesta"><?php echo @$_SESSION['ctform']['hace_cuanto_error'];?></div>
								<input type="number" class="gradient" min="1000" name="ct_hace_cuanto" id="ct_hace_cuanto" placeholder="..." value="<?php echo htmlspecialchars( @$_SESSION['ctform']['ct_hace_cuanto'] );?>" />
							</fieldset>

							<fieldset>
								<legend><?php _e('Ventas del año anterior');?></legend>
								<div class="resultado"><?php echo @$_SESSION['ctform']['ventas_anterior_error'];?></div>

								<label for="pesos" class="icono-right">
									<input type="radio" name="ct_ventas_anterior_moneda" id="pesos" value="AR$" <?php if( @$_SESSION['ctform']['ct_ventas_anterior_moneda'] === "AR$" ) { echo 'checked="checked"'; };?> onclick="ct_ventas_anterior.disabled = false" />AR$
								</label>

								<label for="dolares" class="icono-left">
									<input type="radio" name="ct_ventas_anterior_moneda" id="dolares" value="u$s" <?php if( @$_SESSION['ctform']['ct_ventas_anterior_moneda'] === "u$s" ) { echo 'checked="checked"'; };?> onclick="ct_ventas_anterior.disabled = false" />u$s
								</label>

								<input type="number" class="gradient" placeholder="..." min="0" name="ct_ventas_anterior" id="ct_ventas_anterior" value="<?php echo htmlspecialchars( @$_SESSION['ctform']['ct_ventas_anterior'] );?>" disabled="disabled" />
							</fieldset>

							<fieldset>
								<legend><?php _e('Teléfono', 'emyth');?></legend>
								<div class="resultado"><?php echo @$_SESSION['ctform']['telefono_error'];?></div>
								<input class="gradient" type="tel" id="ct_telefono" name="ct_telefono" placeholder="..."  maxlength="13" value="<?php echo htmlspecialchars( @$_SESSION['ctform']['ct_telefono'] );?>" />
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
								<legend><?php _e('Si tienes pesonal a cargo, ¿cuántos empleados son?', 'emyth');?></legend>
								<div class="respuesta"><?php echo @$_SESSION['ctform']['personal_error'];?></div>
								<input class="gradient" type="number" name="ct_personal" id="ct_personal" min="0" max="99999" placeholder="..." value="<?php echo htmlspecialchars( @$_SESSION['ctform']['ct_personal'] );?>" />
							</fieldset>


							<fieldset>
								<legend class="h3"><?php _e('Elije las tres frustraciones más importantes de tu empresa:', 'emyth');?></legend>
								<div class="respuesta"><?php echo @$_SESSION['ctform']['message_error'];?></div>

								<label for="ct_frustraciones_1">
									<input type="checkbox" class="ct_message_checkbox" name="ct_message" id="ct_frustraciones_1" value="<?php _e('El Negocio es muy dependiente de mí.', 'emyth');?>" />
									<?php _e('El Negocio es muy dependiente de mí.', 'emyth');?>
								</label>
								<br />
								<label for="ct_frustraciones_2">
									<input type="checkbox" class="ct_message_checkbox" name="ct_message" id="ct_frustraciones_2" value="<?php _e('El Negocio no está creciendo.', 'emyth');?>" />
									<?php _e('El Negocio no está creciendo.', 'emyth');?>
								</label>
								<br />
								<label for="ct_frustraciones_3">
									<input type="checkbox" class="ct_message_checkbox" name="ct_message" id="ct_frustraciones_3" value="<?php _e('Problemas con el socio / con la familia.', 'emyth');?>" />
									<?php _e('Problemas con el socio / con la familia.', 'emyth');?>
								</label>
								<br />
								<label for="ct_frustraciones_4">
									<input type="checkbox" class="ct_message_checkbox" name="ct_message" id="ct_frustraciones_4" value="<?php _e('No puedo encontrar la gente adecuada.', 'emyth');?>" />
									<?php _e('No puedo encontrar la gente adecuada.', 'emyth');?>
								</label>
								<br />
								<label for="ct_frustraciones_5">
									<input type="checkbox" class="ct_message_checkbox" name="ct_message" id="ct_frustraciones_5" value="<?php _e('No sé cómo hacer para que la gente me haga caso.', 'emyth');?>" />
									<?php _e('No sé cómo hacer para que la gente me haga caso.', 'emyth');?>
								</label>
								<br />
								<label for="ct_frustraciones_6">
									<input type="checkbox" class="ct_message_checkbox" name="ct_message" id="ct_frustraciones_6" value="<?php _e('No entiendo las finanzas.', 'emyth');?>" />
									<?php _e('No entiendo las finanzas.', 'emyth');?>
								</label>
								<br />
								<label for="ct_frustraciones_7">
									<input type="checkbox" class="ct_message_checkbox" name="ct_message" id="ct_frustraciones_7" value="<?php _e('Los empleados no se comprometen lo suficiente.', 'emyth');?>" />
									<?php _e('Los empleados no se comprometen lo suficiente.', 'emyth');?>
								</label>
								<br />
								<label for="ct_frustraciones_8">
									<input type="checkbox" class="ct_message_checkbox" name="ct_message" id="ct_frustraciones_8" value="<?php _e('Necesito mejorar el marketing.', 'emyth');?>" />
									<?php _e('Necesito mejorar el marketing.', 'emyth');?>
								</label>
								<br />
								<label for="ct_frustraciones_9">
									<input type="checkbox" class="ct_message_checkbox" name="ct_message" id="ct_frustraciones_9" value="<?php _e('No genera suficiente efectivo.', 'emyth');?>" />
									<?php _e('No genera suficiente efectivo.', 'emyth');?>
								</label>
								<br />
								<label for="ct_frustraciones_10">
									<input type="checkbox" class="ct_message_checkbox" name="ct_message" id="ct_frustraciones_10" value="<?php _e('No tengo suficientes ventas.', 'emyth');?>" />
									<?php _e('No tengo suficientes ventas.', 'emyth');?>
								</label>
								<br />
								<label for="ct_frustraciones_11">
									<input type="checkbox" class="ct_message_checkbox" name="ct_message" id="ct_frustraciones_11" value="<?php _e('No me alcanzan las horas del día.', 'emyth');?>" />
									<?php _e('No me alcanzan las horas del día.', 'emyth');?>
								</label>
								<br />
								<label for="ct_frustraciones_12">
									<input type="checkbox" class="ct_message_checkbox" name="ct_message" id="ct_frustraciones_12" value="<?php _e('No está lo suficientemente sistematizado.', 'emyth');?>" />
									<?php _e('No está lo suficientemente sistematizado.', 'emyth');?>
								</label>
								<br />
								<label for="ct_frustraciones_13">
									<input type="checkbox" class="ct_message_checkbox" name="ct_message" id="ct_frustraciones_13" value="<?php _e('Quisiera vender mi negocio.', 'emyth');?>" />
									<?php _e('Quisiera vender mi negocio.', 'emyth');?>
								</label>
								<br />
							</fieldset>

							<hr />

							<fieldset>
								<legend class="h3"><?php _e('¿Como conociste de EMyth Argentina?', 'emyth');?></legend>
								<div class="respuesta"><?php echo @$_SESSION['ctform']['conocimiento_error'];?></div>
								<label for="ct_conocimiento_1">
									<input type="radio" name="ct_conocimiento" id="ct_conocimiento_1" value="<?php _e('Web.', 'emyth');?>" <?php if( @$_SESSION['ctform']['ct_conocimiento'] == __('Web.', 'emyth') ) { echo 'checked="checked"'; };?> onclick="otro.disabled = true" />
									<?php _e('Web.', 'emyth');?>
								</label>
								<br />
								<label for="ct_conocimiento_2">
									<input type="radio" name="ct_conocimiento" id="ct_conocimiento_2" value="<?php _e('Recomendación.', 'emyth');?>" <?php if( @$_SESSION['ctform']['ct_conocimiento'] == __('Recomendación.', 'emyth') ) { echo 'checked="checked"'; };?> onclick="otro.disabled = true" />
									<?php _e('Recomendación.', 'emyth');?>
								</label>
								<br />
								<label for="ct_conocimiento_3">
									<input type="radio" name="ct_conocimiento" id="ct_conocimiento_3" value="<?php _e('Curso.', 'emyth');?>" <?php if( @$_SESSION['ctform']['ct_conocimiento'] == __('Curso.', 'emyth') ) { echo 'checked="checked"'; };?> onclick="otro.disabled = true" />
									<?php _e('Curso.', 'emyth');?>
								</label>
								<br />
								<label for="ct_conocimiento_4">
									<input type="radio" name="ct_conocimiento" id="ct_conocimiento_4" value="<?php _e('Seminario.', 'emyth');?>" <?php if( @$_SESSION['ctform']['ct_conocimiento'] == __('Seminario.', 'emyth') ) { echo 'checked="checked"'; };?> onclick="otro.disabled = true" />
									<?php _e('Seminario.', 'emyth');?>
								</label>
								<br />
								<label for="ct_conocimiento_5">
									<input type="radio" name="ct_conocimiento" id="ct_conocimiento_5" value="<?php _e('Otro.', 'emyth');?>" <?php if( @$_SESSION['ctform']['ct_conocimiento'] == __('Otro.', 'emyth') ) { echo 'checked="checked"'; echo 'onload="otro.disabled = true"'; };?> onclick="otro.disabled = false" />
									<?php _e('Otro.', 'emyth');?>
								</label>
								<br />
								<label for="otro">
									<input type="text" maxlength="30" name="ct_conocimiento_otro" id="otro" <?php if( @$_SESSION['ctform']['ct_conocimiento'] == __('Otro.', 'emyth') and @$_SESSION['ctform']['ct_conocimiento_otro'] != null ) { echo 'value="'.@$_SESSION['ctform']['ct_conocimiento_otro'].'"'; };?> placeholder="..." disabled="disabled" />
								</label>
							</fieldset>

							<hr />

							<fieldset>
								<legend class="h3"><?php _e('¿Te interesaría conocer más sobre cómo podemos ayudarte? ', 'emyth');?></legend>
								<div class="resultado"><?php echo @$_SESSION['ctform']['si_coaching_error'];?></div>
								<input type="checkbox" class="botones_check" name="ct_si_coaching" id="ct_si_coaching" <?php htmlspecialchars ( @$_SESSION['ctform']['ct_si_coaching'] );
								if( htmlspecialchars ( @$_SESSION['ctform']['ct_si_coaching'] ) != '' )
								{
									echo 'checked="checked"';
								}
								?> />
								<label class="botones_check" for="ct_si_coaching"><?php _e('SI', 'emyth');?><span class="icono-check-alt icono-left"></span></label>
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

								<input class="gradient captcha--input" type="text" id="ct_captcha" name="ct_captcha" placeholder="..." maxlength="8" />
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
<?php } else {
	echo '<article>
			<div class="alerta alerta-azul">
				<div class="alerta--icono">
					<span class="icono-alert"></span>
				</div>
				<div class="alerta--mensaje">
					<h4>' . __('Debes iniciar sesión en este sitio para poder completar la encuesta. O registrarte si todavía no lo has hecho.', 'emyth') . ' </h4>
				</div>
				<div class="alerta--close">
					<a class="icono-x" href="#"></a>
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
	</article>';
};
endwhile; else : ?>
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