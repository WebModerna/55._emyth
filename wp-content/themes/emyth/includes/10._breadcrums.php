<?php // Las migajas de pan cordero, chicharrón y un poco de casero

function the_breadcrums()
{
// Defino la ubicación como una variable; así la puedo cargar en la función del breadcrums.
	// $ubicacion = __('Ud. está aquí: ', 'emyth');
	echo '<ul class="breadcrums">';
	if ( !is_home() )
	{
		echo '<li class="breadcrums--label"><i class="icono-tree icono-right"></i></li>';
		echo '<li><a href="';
		echo get_option('home');
		echo '">';
		echo _e('Inicio', 'emyth');
		echo '</a></li>';

		if ( is_category() )
		{
			echo single_cat_title( "<li>", true, "</li>" );
		};

		if ( is_tag() )
		{
			echo single_tag_title( "<li>", true, "</li>" );
		};

		if ( is_single() )
		{
			echo '<li>';
			the_category('</li><li>', 'single', false);
			echo '</li>';
			echo '<li class="breadcrums-muted">';
			echo the_title();
			echo '</li>';
		};

		if ( is_page() )
		{
			echo '<li class="breadcrums-muted">';
			echo the_title();
			echo '</li>';
		};
	};
echo '</ul>';
};

;?>