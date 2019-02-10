jQuery(document).ready(function($)
{
	var custom_fields;

	custom_fields = '<tr class="form-field form-required">';
	custom_fields += '<th scope="row">';
	custom_fields += '<label for="user_town">Población</label>';
	custom_fields += '</th>';
	custom_fields += '<td>';
	custom_fields += '<input type="text" id="user_town" name="user_town">';
	custom_fields += '</td>';
	custom_fields += '</tr>';

	custom_fields += '<tr class="form-field form-required">';
	custom_fields += '<th scope="row">';
	custom_fields += '<label for="user_province">Provincia</label>';
	custom_fields += '</th>';
	custom_fields += '<td>';
	custom_fields += '<input type="text" id="user_province" name="user_province">';
	custom_fields += '</td>';
	custom_fields += '</tr>';

	custom_fields += '<tr class="form-field form-required">';
	custom_fields += '<th scope="row">';
	custom_fields += '<label for="user_phone">Teléfono</label>';
	custom_fields += '</th>';
	custom_fields += '<td>';
	custom_fields += '<input type="tel" id="user_phone" name="user_phone">';
	custom_fields += '</td>';
	custom_fields += '</tr>';

	$('#createuser .form-table tbody').append(custom_fields);
});


/*
 * Adapted from: http://mikejolley.com/2012/12/using-the-new-wordpress-3-5-media-uploader-in-plugins/
 */
jQuery(document).ready(function($)
{
	// Uploading files
	var file_frame;
	$('.additional-user-image').on('click', function( event )
	{
		event.preventDefault();

		// If the media frame already exists, reopen it.
		if ( file_frame )
		{
			file_frame.open();
			return;
		}

		// Create the media frame.
		file_frame = wp.media.frames.file_frame = wp.media(
		{
			title: $( this ).data( 'uploader_title' ),
			button:
			{
				text: $( this ).data( 'uploader_button_text' ),
			},
			multiple: false  // Set to true to allow multiple files to be selected
		});

		// When an image is selected, run a callback.
		file_frame.on( 'select', function()
		{
			// We set multiple to false so only get one image from the uploader
			attachment = file_frame.state().get('selection').first().toJSON();

			// Do something with attachment.id and/or attachment.url here
			// Colocar la url de la imagen en el campo
			jQuery( '#user_meta_image' ).attr( 'value', attachment.url );

			// Reemplazar la imagen subida
			jQuery( '#avatar_usuario' ).attr( 'src', attachment.url );
		});

		// Finally, open the modal
		file_frame.open();
	});
});