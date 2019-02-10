module.exports = function(grunt)
{
	grunt.initConfig({
		// Unificar y minificar scripts
		uglify: {
			// Scripst generales
			mi_combinador: {
				files: {
					'js/scripts.min.js': [
						'js/jquery-1.12.4.js',
						'js/el_fancybox.js',
						'js/jquery-ui.js',
						'js/cycle_slider.js',
						'js/placeholder.js',
						'js/scripts.js'
					]
				}
			},

			// Scripts del multidatepicker
			mi_multidatepicker: {
				/*files: {
					'js/multidatepicker.min.js': [
						'js/jquery-1.11.1.js',
						'js/jquery-ui-1.11.1.js',
						'js/jquery-ui.multidatespicker.js'
					]
				}*/
			}
		},

		// Monitorear cambios en los scripts, todos
		watch: {
			scripts: {
				files: ['js/*.js'],
				tasks: ['uglify'],
				options: {
					spawn: false,
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-imagemin');
};