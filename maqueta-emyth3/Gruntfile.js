module.exports = function(grunt)
{
	grunt.initConfig({
		// Unificar y minificar scripts
		uglify:
		{
			// Scripts generales
			mi_prueba:
			{
				files:
				{
					'js/scripts.min.js':
					[
						'js/jquery.js',
						'js/jquery.placeholder.js',
						'js/jquery.foundation.accordion.js',
						'js/jquery.foundation.alerts.js',
						'js/jquery.foundation.buttons.js',
						'js/jquery.foundation.clearing.js',
						'js/jquery.foundation.forms.js',
						'js/jquery.foundation.joyride.js',
						'js/jquery.foundation.magellan.js',
						'js/jquery.foundation.mediaQueryToggle.js',
						'js/jquery.foundation.navigation.js',
						'js/jquery.foundation.orbit.js',
						'js/jquery.foundation.reveal.js',
						'js/jquery.foundation.tabs.js',
						'js/jquery.foundation.tooltips.js',
						'js/jquery.foundation.topbar.js',
						'js/app.js'
					]
				}
			}
		},

		// Monitorear cambios en los scripts, todos
		watch:
		{
			scripts:
			{
				files: ['js/*.js'],
				tasks: ['uglify'],
				options:
				{
					spawn: false
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-imagemin');
};