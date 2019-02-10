<?php // configuración del Mensaje

// Register Custom Post Type
function mensajes()
{

	$labels = array(
		'name'                => _x( 'Mensajes', 'Post Type General Name', 'Mensajes' ),
		'singular_name'       => _x( 'Mensaje', 'Post Type Singular Name', 'Mensajes' ),
		'menu_name'           => __( 'Mensaje de la Home', 'Mensajes' ),
		'name_admin_bar'      => __( 'Mensaje de la Home', 'Mensajes' ),
		'parent_item_colon'   => __( 'Mensaje superior:', 'Mensajes' ),
		'all_items'           => __( 'Todos los Mensajes', 'Mensajes' ),
		'add_new_item'        => __( 'Agregar nuevo Mensaje', 'Mensajes' ),
		'add_new'             => __( 'Agregar uno nuevo', 'Mensajes' ),
		'new_item'            => __( 'Nuevo Mensaje', 'Mensajes' ),
		'edit_item'           => __( 'Editar Mensaje', 'Mensajes' ),
		'update_item'         => __( 'Actualizar Mensaje', 'Mensajes' ),
		'view_item'           => __( 'Ver Mensaje', 'Mensajes' ),
		'search_items'        => __( 'Buscar Mensaje', 'Mensajes' ),
		'not_found'           => __( 'No hay Mensajes', 'Mensajes' ),
		'not_found_in_trash'  => __( 'No hay Mensajes en la papelera', 'Mensajes' ),
	);
	$rewrite = array(
		'slug'                => 'mensajes',
		'with_front'          => true,
		'pages'               => false,
		'feeds'               => false,
	);
	$args = array(
		'label'               => __( 'Mensaje', 'Mensajes' ),
		'description'         => __( 'Mensajes', 'Mensajes' ),
		'labels'              => $labels,
		'supports'            => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
		'hierarchical'        => true,
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'menu_position'       => 5,
		'menu_icon'           => 'dashicons-images-alt2',
		'show_in_admin_bar'   => true,
		'show_in_nav_menus'   => true,
		'can_export'          => true,
		'has_archive'         => true,
		'exclude_from_search' => false,
		'publicly_queryable'  => true,
		'rewrite'             => $rewrite,
		'capability_type'     => 'page',
	);
	register_post_type( 'mensajes', $args );

}
add_action( 'init', 'mensajes', 0 );
?>