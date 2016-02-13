module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {
            dist: ['dist/**/*'],
        },
        
        concat: {
            css: {
                src: [
                    'src/bower_components/html5-boilerplate/dist/css/main.css',
                    'src/bower_components/html5-boilerplate/dist/css/normalize.css',
                    'src/bower_components/font-awesome/css/font-awesome.css',
                    'src/bower_components/sweetalert/dist/sweetalert.css'
                ],
                dest: 'src/css/libs.css'
            }
        },
        
        copy: {
            css: {
                files: [
                    {
                        expand: false,
                        src: ['src/css/app.css'],
                        dest: 'dist/css/app.css'
                    },
                    {
                        expand: false,
                        src: ['src/css/libs.css'],
                        dest: 'dist/css/libs.css'
                    }
                ]
            },
            
            fontAwesome: {
                files: [{
                    expand: true,
                    cwd: 'src/bower_components/font-awesome/fonts',
                    src: ['*'],
                    flatten: true,
                    dest: 'dist/fonts/'
                }]
            },
            
            images: {
                files: [{
                    expand: true,
                    cwd: 'src/images',
                    src: ['*'],
                    flatten: true,
                    dest: 'dist/images/'
                }]
            },
            
            json: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: 'src/js/data',
                    src: ['*.json'],
                    dest: 'dist/js/data/'
                }]    
            },
            
            views: {
                files: [{
                    expand: true,
                    cwd: 'src/js/views',
                    src: ['*.html'],
                    flatten: false,
                    dest: 'dist/js/views'
                }]
            }
        },
        
        cssmin: {
            minify: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    dest: 'dist/css',
                    src: ['app.css', 'libs.css'],
                    ext: '.min.css'
                }]
            }
        },
        
        htmlangular: {
            options: {
                customattrs: [
                    'context-menu-callback',
                    'context-menu-click',
                    'context-menu-items',
                    'popover-placement',
                    'popover-title',
                    'popover-trigger',
                    'set-focus',
                    'uib-collapse',
                    'uib-popover-template'
                ],
                customtags: [
                    'tile'
                ],
                relaxerror: [
                    "is missing required attribute"
                ],
                reportpath: null,
                reportCheckstylePath: null,
                tmplext: 'html'
            },
            files: {
                src: ['src/js/views/**/*.html']
            }
        },
        
        jshint: {
            app: [
                "Gruntfile.js",
                "bootstrap.js",
                "server.js",
                "app/**/*.js",
                "src/js/**/*.js"
            ]
        },  
        
        'json-minify': {
            data: {
                files: 'dist/js/data/*.json'
            }
        },
                     
        jsonlint: {
            app: {
                src: [
                    'bower.json',
                    'package.json',
                    'app/data/*.json',
                    'src/js/data/*.json'
                ]
            }
        },
        
        less: {
            app: {
                files: {
                    "src/css/app.css": "src/less/*.less"
                }
            }
        },
        
        preprocess: {
            dist: {
                options: {
                    context: {
                        NODE_ENV: 'production'
                    }
                },
                src: 'src/templates/index.html',
                dest: 'dist/index.html'
            },
            src: {
                options: {
                    context: {
                        NODE_ENV: 'development'
                    }
                },
                src: 'src/templates/index.html',
                dest: 'src/index.html'
            }
        },

        uglify: {
            concat: {
                options: {
                    compress: false,
                    preserveComments: true
                },
                files: {
                    'dist/js/app.js': [
                        'src/js/**/*.js'
                     ],
                    'dist/js/libs.js': [
                        'src/bower_components/html5-boilerplate/dist/js/main.js',
                        'src/bower_components/jquery/dist/jquery.js',
                        'src/bower_components/angular/angular.js',
                        'src/bower_components/angular-resource/angular-resource.js',
                        'src/bower_components/angular-route/angular-route.js',
                        'src/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                        'src/bower_components/sweetalert/dist/sweetalert-dev.js',
                        'src/bower_components/ngSweetAlert/SweetAlert.js'
                    ]
                }
            },
                    
            minify: {
                files: {
                    'dist/js/app.min.js': ['dist/js/app.js'],
                    'dist/js/libs.min.js': ['dist/js/libs.js']
                }
            }
        },
        
        watch: {
            lint: {
                files: [
                    'app/**/*.js', 
                    'Gruntfile.js',
                    'server.js',
                    'bootstrap.js',
                    '*.json', 
                    '.bowerrc',
                    'src/js/**/*.js',
                    'src/js/data/*.json',
                    'src/js/views/*.html'
                ],
                tasks: ['lint']
            },
                     
            less: {
                files: 'src/less/*.less',
                tasks: ['less']
            },
            
            preprocess: {
                files: 'src/templates/*.html',
                tasks: ['preprocess']
            }
        }             
        
    });
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html-angular-validate');
    grunt.loadNpmTasks('grunt-json-minify');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-preprocess');
    
    grunt.registerTask('lint', ['htmlangular', 'jsonlint', 'jshint' ]);
    grunt.registerTask('minify', ['uglify:concat', 'uglify:minify', 'concat:css', 'copy:css', 'cssmin']);
    grunt.registerTask('build', ['clean:dist', 'preprocess', 'lint', 'minify', 'copy:fontAwesome', 'copy:images', 'copy:json', 'copy:views', 'json-minify']);
    
};
