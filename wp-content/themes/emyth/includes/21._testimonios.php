<?php
// Testimonios

function testimonios() {

	$labels = array(
		'name'                  => _x( 'Testimonios', 'Post Type General Name', 'Testimonios' ),
		'singular_name'         => _x( 'Testimonio', 'Post Type Singular Name', 'Testimonios' ),
		'menu_name'             => __( 'Testomonios', 'Testimonios' ),
		'name_admin_bar'        => __( 'Testomonios', 'Testimonios' ),
		'archives'              => __( 'Archivo de testimonios', 'Testimonios' ),
		'parent_item_colon'     => __( 'Testomonio padre:', 'Testimonios' ),
		'all_items'             => __( 'Todos los testimonios', 'Testimonios' ),
		'add_new_item'          => __( 'Agregar un nuevo testimonio', 'Testimonios' ),
		'add_new'               => __( 'Agregar uno nuevo', 'Testimonios' ),
		'new_item'              => __( 'Nuevo testimonio', 'Testimonios' ),
		'edit_item'             => __( 'Editar testimonio', 'Testimonios' ),
		'update_item'           => __( 'Actualizar testimonio', 'Testimonios' ),
		'view_item'             => __( 'Ver testimonio', 'Testimonios' ),
		'search_items'          => __( 'Buscar testimonios', 'Testimonios' ),
		'not_found'             => __( 'No hay testimonios', 'Testimonios' ),
		'not_found_in_trash'    => __( 'No hay testimonios en la papelera', 'Testimonios' ),
		'featured_image'        => __( 'Imagen destacada', 'Testimonios' ),
		'set_featured_image'    => __( 'Colocar una imagen destacada', 'Testimonios' ),
		'remove_featured_image' => __( 'Remover una imagen destacada', 'Testimonios' ),
		'use_featured_image'    => __( 'Usar como Imagen destacada', 'Testimonios' ),
		'insert_into_item'      => __( 'Insertar dentro del testimonio', 'Testimonios' ),
		'uploaded_to_this_item' => __( 'Cargado en este testimonio', 'Testimonios' ),
		'items_list'            => __( 'Listado de los testimonios', 'Testimonios' ),
		'items_list_navigation' => __( 'Listado de navegación de testimonios', 'Testimonios' ),
		'filter_items_list'     => __( 'Filtrar listado de testimonios', 'Testimonios' ),
	);
	$capabilities = array(
		'edit_post'             => 'Editar Testimonio',
		'read_post'             => 'Leer Testimonio',
		'delete_post'           => 'Borrar el Testimonio',
		'edit_posts'            => 'Editar Testimonios',
		'edit_others_posts'     => 'Editar otros Testimonios',
		'publish_posts'         => 'Publicar el Testimonio',
		'read_private_posts'    => 'Leer Testimonios Privados',
	);
	$args = array(
		'label'                 => __( 'Testimonio', 'Testimonios' ),
		'description'           => __( 'Testimonios de los clientes', 'Testimonios' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'author', 'thumbnail', 'page-attributes', 'post-formats', ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 15,
		'menu_icon'             => 'dashicons-thumbs-up',
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'query_var'             => 'testimonio_post_type',
		// 'capabilities'          => $capabilities, la comento porque no funciona
	);
	register_post_type( 'testimonio_key', $args );

}
add_action( 'init', 'testimonios', 0 );


?>