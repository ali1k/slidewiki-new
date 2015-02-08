module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
			dist: {
				src: ['build/*', '!build/bower_components/**']
			}
		},
        concurrent: {
            dev: ['nodemon:dev', 'webpack:dev'],
            options: {
                logConcurrentOutput: true
            }
        },
        copy: {
            slidewiki_new: {
                files: [{
                    expand: true,
                    cwd: './src/assets/css/',
                    src: ['*.*'],
                    dest: './build/'
                }]
            }
        },
        nodemon: {
            dev: {
                script: './src/server.js',
                options: {
                    ignore: ['build/**'],
                    ext: 'js,jsx'
                }
            }
        },
        webpack: {
            dev: {
                resolve: {
                    extensions: ['', '.js', '.jsx']
                },
                entry: './src/client.js',
                output: {
                    path: 'build/js',
                    filename: 'client.js'
                },
                module: {
                    loaders: [
                        { test: /\.css$/, loader: 'style!css' },
                        { test: /\.jsx$/, loader: 'jsx-loader' }
                    ]
                },
                stats: {
                    colors: true
                },
                devtool: 'source-map',
                watch: true,
                keepalive: true
            }
        }
    });


    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-webpack');

    grunt.registerTask('default', ['clean:dist', 'copy:slidewiki_new', 'concurrent:dev']);
    
};
