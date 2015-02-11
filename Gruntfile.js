module.exports = function(grunt) {
    
    grunt.initConfig({
        clean: {
            build: ['dist/']
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/views',
                        src: '**/*',
                        dest: 'dist/views/'
                    },
                    {
                        expand: true,
                        cwd: 'app/images',
                        src: '**/*',
                        dest: 'dist/images/'
                    },
                    {
                        expand: true,
                        cwd: 'app/bower_components/font-awesome/fonts',
                        src: '**/*',
                        dest: 'dist/css/dist/fonts/'
                    },
                    {
                        expand: true,
                        cwd: 'app/data',
                        src: '**/*',
                        dest: 'dist/data/'
                    }
                ]
            }
        },
        concat: {
            dist: {
                src: [
                    'app/bower_components/html5-boilerplate/css/normalize.css',
                    'app/bower_components/html5-boilerplate/css/main.css',
                    'app/bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'app/bower_components/font-awesome/css/font-awesome.min.css'
                ],
                dest: 'dist/css/libraries.css'
            }
        },
        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    src: ['libraries.css'],
                    dest: 'dist/css',
                    ext: '.min.css'
                }]
            }
        },
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
                        'app/js/components/**/*.js',
                        'app/js/controllers/**/*.js',
                        'app/js/services/**/*.js']
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
                    "dist/css/app.min.css": "app/less/app.less"
                }
            }
        },
        processhtml: {
            dist: {
                files: {
                    'dist/index.html': ['app/index.html']
                }
            }
        },
        uglify: {
            default: {
                files: {
                    'dist/js/app.min.js': [
                        'app/js/app.js',
                        'app/js/components/**/*.js',
                        'app/js/controllers/**/*.js',
                        'app/js/services/**/*.js',
                    ],
                    'dist/js/libraries.min.js': [
                        'app/bower_components/angular/angular.js',
                        'app/bower_components/angular-route/angular-route.js',
                        'app/bower_components/angular-resource/angular-resource.js',
                        'app/bower_components/angular-cookies/angular-cookies.js',
                        'app/bower_components/jquery/dist/jquery.min.js',
                        'app/bower_components/bootstrap/dist/js/bootstrap.min.js'
                    ]
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', ['clean', 'jshint', 'less', 'concat', 'cssmin', 'uglify', 'processhtml', 'copy']);
}