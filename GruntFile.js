
module.exports = function (grunt) {


	// Load Grunt tasks declared in the package.json file
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration.
	grunt.initConfig({

		watch: {
			scripts: {
				files: [
					'src/js/**/*.js',
					'src/maps/**/*.json',
					'src/gfx/**/*',
					'!src/js/start_GEN.js'
				],
				tasks: ['build']
			},
			pages: {
				files: [
					'src/html/*.*'
				],
				tasks: ['copy:html']
			}
		},
		'http-server': {
			dev: {
				root: 'dist',
				port: 3116,
				runInBackground: true
			}
		},
		image: {
			dev: {
				options: {
					optipng: true,
					pngquant: false,
					zopflipng: false,
				},
				files: {
					'dist/t.png': 'src/gfx/tiles.png',
				}
			},
			prod: {
				options: {
					optipng: ['-o 7', '-zc 7'],
					//pngquant: ['-s1', '--quality=40-60'],
					pngquant: ['-s1'],
					zopflipng: ['-m']
				},
				files: {
					'dist/t.png': 'src/gfx/tiles.png',
				}
			},
		},
		closureCompiler: {
			options: {
				compilerFile: 'node_modules/google-closure-compiler-java/compiler.jar',
				compilerOpts: {
					compilation_level: 'ADVANCED_OPTIMIZATIONS',
					language_out: 'ECMASCRIPT_2019',
					jscomp_off: 'checkVars',
					assume_function_wrapper: true,
					warning_level: 'QUIET'
				},
			},
			targetName: {
				src: 'dist/js/index_prod.js',
				dest: 'dist/js/i.js'
			}
		},
		uglify: {
			options: {
				compress: {
					global_defs: {
						'debug': false,
						'g_CHEATMODE': false,
					},
					dead_code: true,
					unused: true
					
				},
				mangle: {
					//properties: true,
					reserved: ['TileMaps', 'world', 'layers']
				},
			},
			my_target: {
				files: {
					'dist/i.min.js': ['dist/js/i.js']
				}
			}
		},
		clean: ['dist/*.html', 'dist/*.zip', 'dist/*.js', 'dist/*.png', 'dist/js/'],
		concat: {
			dev: {
				files: {
					'dist/index.html': [
						'src/html/index_dev.html'
					],
				}
			},
			shared: {
				files: {
					'dist/js/index.js': [
						'src/js/lib/*.js',
						'src/js/main.js',
						'src/js/DEFS.js',
						'src/js/**/*.js',
						'src/js/start_GEN.js',
					]
				}
			},
			prod: {
				files: {
					'dist/index.html': [
						'src/html/index_prod.html'
					],
					'dist/js/index_prod.js': [
						'dist/lib/engine.all.release.js',
						'dist/js/index.js'
					]
				}
			}
		},
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('rollup', 'combine html and js', function () {

		let src = grunt.file.read('dist/i.min.js');

		grunt.file.write('dist/index.html', '<script>' + src + '</script>');

	});
	grunt.registerTask('processMap', 'get map data from Tiled', function () {
		
		// ADD MAPS HERE!
		let maps = ["0", "1", "2"];

		let str = '// THIS FILE IS GENERATED BY THE BUILD SCRIPT\n';
		str += 'let mapData = [];\n';

		for (let i = 0; i < maps.length; i++) {
			let mapJson = grunt.file.readJSON('src/maps/' + maps[i] + '.json');
			str += 'mapData[' + i + '] = { w: ' + mapJson.width + ', h: ' + mapJson.height + ', data: ['
				+ mapJson.layers[0].data.toString().replaceAll(',0,', ',,').replaceAll(',0,', ',,') + '] }; \n';
		}
		
		str += '\ninit();'
		
		grunt.file.write('src/js/start_GEN.js', str);
	});

	// TODO: add roadroller and zip to script
	// Follow these steps after production build
	// npx roadroller --optimize 2 dist/i.min.js -o dist/i.min.js
	// grunt rollup
	// cd dist
	// zip -X9 a.zip index.html t.png 
	// npx advzip-bin --recompress --shrink-insane a.zip

	grunt.registerTask('dev', [
		'watch'
	]);
	grunt.registerTask('build', ['clean', 'processMap', 'concat:dev', 'concat:shared', 'image:dev']);
	grunt.registerTask('default', ['build', 'http-server', 'dev']);
	grunt.registerTask('prod', ['clean', 'processMap', 'image:prod', 'concat:shared', 'concat:prod', 'closureCompiler', 'uglify']);
	grunt.registerTask('web', ['http-server', 'dev']);

};