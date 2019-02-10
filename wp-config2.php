<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link https://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', '55._emyth');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'hch`g>Ys]ia&,{u+LbH]Y`[]%dWPJr0GHD4,Nth6,+rb$5lhmU2`BbhTYhsl8jM&');
define('SECURE_AUTH_KEY',  'KDd%]vAGTQd#w[O~eu&x>NZheRCL`@:]V7HEl%l3$U!Oez1h.-2;Ks2f1Yz^GbF4');
define('LOGGED_IN_KEY',    'X}L_|hb}$&4v`:hc=#I}PM3VwQzh3{PxB4B!r!!xsuz%I Gg=`Z72xQ}a#~.X:9N');
define('NONCE_KEY',        '2S$Y,PLy8,~D.4im#&|`w@`{rbHB}6j8IM=,4dXvL0|O2gIk`T4=foOq1gYWwntS');
define('AUTH_SALT',        '5Nkky8UlJBTCm%7Jov{f!-1h9{4n<9bPYUz_E[lrx*0riaJ=oYNdbT%`qI6U;zhL');
define('SECURE_AUTH_SALT', ',9+KA}]r#xXEWY.Q}5R+>ip#jHm!K:]{!<E-/$)8M^)G=W &AeBUEe;#VP68K.y)');
define('LOGGED_IN_SALT',   '*)3p&*M,9YuiRD_E8mKnd!>AVz|-8jqZ:-`$D.V^IwpWMI_Rb%i8xuG]~nnp9T]O');
define('NONCE_SALT',       'MXE_h.1!xG2iBTPvCS;JO$W.-<H0xT3LFyDF[*oiU/YP?/vS8zI{=uz&6|B//4O!');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'emyth_';

// Definiendo el lenguage por defecto de WordPress. Ya no es necesario
// define('WPLANG', 'es_ES');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */



// Modo depuración
define('WP_DEBUG', true);
@ini_set('log_errors', 'On');
@ini_set('display_errors', 'On');
@ini_set('error_log', '/php_error.log');


// Depurando scripts
define( 'SCRIPT_DEBUG', false );
define( 'CONCATENATE_SCRIPTS', true );
define( 'CONCATENATE_CSS', true );
define( 'COMPRESS_SCRIPTS', true );


// Compresión y concatenación de estilos
define( 'COMPRESS_CSS', true );
define( 'COMPRESS_JS', true );
define( 'ENFORCE_GZIP', true );

// Nuevas urls absolutas pero dinámicas y sirven para desarrollo en local con otros dispositivos
define( 'WP_SITEURL', 'http://' . $_SERVER['HTTP_HOST'] . '/55._emyth' );
define( 'WP_HOME', 'http://' . $_SERVER['HTTP_HOST'] . '/55._emyth' );

// Generando las consultas a la base de datos.
// define( 'SAVEQUERIES', true );
/*
Guardando las consultas de la base de datos para análisis posterior
luego colocar en el hook wp_footer. O sea colocar este código en el footer.php de tu tema, justo antes del wp_footer();
<?php
	if ( current_user_can( 'administrator' ) )
	{
		global $wpdb;
		echo "<pre>";
		print_r( $wpdb->queries );
		echo "</pre>";
	}
?>
*/

// Deshabilitar el editor de temas y plugins para evitar metidas de pata de los clientes
define( 'DISALLOW_FILE_EDIT', true );

// Deshabilitando la opción de revisiones. Tu sabes que la base de datos irá creciendo y mucho, te lo recomiendo.
define( 'WP_POST_REVISIONS', false );

// Autoguardado de posts y páginas para evitar pérdidas si se corta las conexión a internet.
define( 'AUTOSAVE_INTERVAL', 60 );

// Evitar imágenes duplicadas
define( 'IMAGE_EDIT_OVERWRITE', true );

// Incrementando el nivel de memoria asignada a WordPress para darle mayor velocidad
// define( 'WP_MEMORY_LIMIT', '64M' );


// Desabilitando C-Form 7 scripts y css por defecto. Recomendable sí o sí.
define( 'WPCF7_LOAD_JS', false );
define( 'WPCF7_LOAD_CSS', false );

// Actualizaciones automáticas. Muy confiable
define( 'WP_AUTO_UPDATE_CORE', false );

// Activando el mutisite
// define('MULTISITE', true);
// define('SUBDOMAIN_INSTALL', false);
// define('DOMAIN_CURRENT_SITE', 'localhost');
// define('PATH_CURRENT_SITE', '/55._emyth/');
// define('SITE_ID_CURRENT_SITE', 1);
// define('BLOG_ID_CURRENT_SITE', 1);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
