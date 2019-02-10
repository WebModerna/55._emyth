<?php
/**
* footer.php
* @package WordPress
* @subpackage emyth
* @since emyth 2.0
* Text Domain: emyth
*/

// Variables a utilizar
$google_plus_contact	=	of_get_option( 'google_plus_contact', '' );
$facebook_contact		=	of_get_option( 'facebook_contact', '' );
$twitter_contact		=	of_get_option( 'twitter_contact', '' );
$linkedin_contact		=	of_get_option( 'linkedin_contact', '' );
$email_contact			=	of_get_option( 'email_contact', '' );
$add_this_script		=	of_get_option('add_this_script', '');
?>
	<footer class="footer">
		<div>
			<div class="redes_sociales">
				<ul>
					<?php if ( $google_plus_contact )
					{
						echo '<li><a target="_blank" class="icono-google-plus3" href="//' . $google_plus_contact . '" title="Google+"></a></li>';
					};
					if ( $facebook_contact )
					{
						echo '<li><a target="_blank" class="icono-facebook3" href="//' . $facebook_contact . '" title="Facebook"></a></li>';
					};
					if ( $twitter_contact )
					{
						echo '<li><a target="_blank" class="icono-twitter3" href="//' . $twitter_contact . '" title="Twitter"></a></li>';
					};
					if ( $email_contact )
					{
						echo '<li><a target="_blank" class="icono-mail4" href="mailto:' . $email_contact . '" title="E-Mail"></a></li>';
					};?>

					<li><a target="_blank" class="icono-feed4" href="<?php bloginfo('rss2_url');?>" title="Feed"></a></li>
				</ul>
			</div>
			<?php
			if( function_exists( display_copyright() ) )
			{
				display_copyright();
			};
			?>
			<div class="copyright">
				<?php _e('Desarrollado por ', 'emyth');?><a href="http://www.webmoderna.com.ar" target="_blank">WebModerna</a>
			</div>
		</div>
		<a id="ir_arriba" class="gotop gradient" href="#" title="<?php _e('Ir hacia arriba', 'emyth');?>"></a>
	</footer>
</div><!-- .wrapper -->
<script type="text/javascript" src="<?php bloginfo('stylesheet_directory');?>/js/scripts.min.js"></script>
<?php if ( $add_this_script )
{
	echo '<!-- Go to www.addthis.com/dashboard to customize your tools -->
	<script type="text/javascript" src="'	. $add_this_script . '"></script>';
	};
wp_footer();?>
</body>
</html>