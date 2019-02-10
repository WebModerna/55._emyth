<?php // Paginación avanzada
function pagination( $pages = '', $range = 2 )
{
	$pagina_palabra			= __('Página', 'emyth');
	$de_palabra				= __('de', 'emyth');
	$primero				= __('Primero', 'emyth');
	$atras					= __('Atrás', 'emyth');
	$siguiente				= __('Siguiente', 'emyth');
	$ultimo					= __('Último', 'emyth');
	$showitems				= ( $range * 2 ) + 1;
	global $paged;
	if( empty( $paged ) ) $paged = 1;
	if( $pages == '' )
	{
		global $wp_query;
		$pages = $wp_query->max_num_pages;
		if( !$pages )
		{
			$pages = 1;
		}
	}
	if( 1 != $pages )
	{
		echo '<ul>';
		echo '<li class="pagination--leyenda">' . $pagina_palabra . ' ' . $paged . ' ' . $de_palabra . ' ' . $pages . '</li>';

		if( $paged > 2 && $paged > $range+1 && $showitems < $pages )
		{
			echo '<li><a class="pagination--primero" href="' . get_pagenum_link(1) . '" title="' . $primero . '">&laquo;</a></li>';
		}

		if( $paged > 1 && $showitems < $pages )
		{
			echo '<li><a class="pagination--atras" title="' . $atras . '" href="' . get_pagenum_link( $paged - 1 ) . '">&lsaquo;</a></li>';
		}

		for ( $i = 1; $i <= $pages; $i++ )
		{
			if ( 1 != $pages && ( !( $i >= $paged + $range + 1 || $i <= $paged - $range - 1 ) || $pages <= $showitems ) )
			{
				echo ( $paged == $i )? '<li class="current">' . $i . '</li>':'<li><a href="' . get_pagenum_link($i) . '" class="inactive" title="' . $i . '">'. $i . '</a></li>';
			}
		}
		if ( $paged < $pages && $showitems < $pages )
		{
			echo '<li><a class="pagination--siguiente" title="' . $siguiente . '" href="' . get_pagenum_link( $paged + 1 ) . '">&rsaquo;</a></li>';
		}

		if ( $paged < $pages - 1 &&  $paged + $range - 1 < $pages && $showitems < $pages )
		{
			echo '<li><a class="pagination--ultimo" title="' . $ultimo . '" href="' . get_pagenum_link( $pages ) . '">&raquo;</a></li>';
		}
		echo '</ul>';
	};
};
?>