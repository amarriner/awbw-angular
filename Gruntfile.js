module.exports = function(grunt) {
    
    grunt.initConfig({
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'app/images/'
                }]
            }
        },
        jshint: {
            all: {
                options: {
                    ignores: ['app/**/*.min.js'],
                    jshintrc: true
                },
                files: {
                    src: [
                        'app/js/*.js', 
                        'app/js/controllers/**/*.js',
                        'app/services/**/*.js']
                }
            }
        },
        less: {
            development: {
                options: {
                    compress: false,
                    paths: ["less/**/*"]
                },
                files: {
                    "app/css/app.css": "app/less/app.less"
                }
            },
            production: {
                options: {
                    compress: true,
                    paths: ["less/**/*"]
                },
                files: {
                    "app/css/app.min.css": "app/less/app.less"
                }
            }
        },
        uglify: {
            default: {
                files: {
                    'app/js/app.min.js': [
                        'app/js/app.js',
                    ]
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', ['jshint', 'less', 'uglify']);    
}