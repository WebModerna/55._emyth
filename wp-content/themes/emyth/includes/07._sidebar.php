<?php // Sidebars
function barras_laterales()
{
	$args = array(
		'id'            => 'sidebar_right',
		'class'         => 'widget--box',
		'name'          => __( 'Barra Lateral Derecha', 'emyth' ),
		'description'   => __( 'Barra Lateral Derecha', 'emyth' ),
		'before_title'  => '<header class="widget--box--title"><h3>',
		'after_title'   => '</h3></header>',
		'before_widget'	=>	'<section class="widget--box">',
		'after_widget'	=>	'</section>'
	);
	register_sidebar( $args );

	$args = array(
		'id'            => 'sidebar_footer_1',
		'class'         => 'widget--box',
		'name'          => __( 'Barra del Pie 1', 'emyth' ),
		'description'   => __( 'Barra del Pie 1', 'emyth' ),
		'before_title'  => '<header class="widget--box--title"><h3>',
		'after_title'   => '</h3></header>',
		'before_widget'	=>	'<section class="widget--box">',
		'after_widget'	=>	'</section>'
	);
	register_sidebar( $args );

	$args = array(
		'id'            => 'sidebar_footer_2',
		'class'         => 'widget--box',
		'name'          => __( 'Barra del Pie 2', 'emyth' ),
		'description'   => __( 'Barra del Pie 2', 'emyth' ),
		'before_title'  => '<header class="widget--box--title"><h3>',
		'after_title'   => '</h3></header>',
		'before_widget'	=>	'<section class="widget--box">',
		'after_widget'	=>	'</section>'
	);
	register_sidebar( $args );

	$args = array(
		'id'            => 'sidebar_footer_3',
		'class'         => 'widget--box',
		'name'          => __( 'Barra del Pie 3', 'emyth' ),
		'description'   => __( 'Barra del Pie 3', 'emyth' ),
		'before_title'  => '<header class="widget--box--title"><h3>',
		'after_title'   => '</h3></header>',
		'before_widget'	=>	'<section class="widget--box">',
		'after_widget'	=>	'</section>'
	);
	register_sidebar( $args );

/*	$args = array(
		'id'            => 'sidebar_footer_4',
		'class'         => 'widget--box',
		'name'          => __( 'Barra del Pie 4', 'emyth' ),
		'description'   => __( 'Barra del Pie 4', 'emyth' ),
		'before_title'  => '<header class="widget--box--title"><h3>',
		'after_title'   => '</h3></header>',
		'before_widget'	=>	'<section class="widget--box">',
		'after_widget'	=>	'</section>'
	);*/
	register_sidebar( $args );

}
add_action( 'widgets_init', 'barras_laterales' );
?>