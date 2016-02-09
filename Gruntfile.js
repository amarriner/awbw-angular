module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            app: [
                "Gruntfile.js",
                "server.js",
                "app/**/*.js",
                "src/js/*.js"
            ]
        },  
        
        htmlangular: {
            options: {
                customattrs: [
                    'set-focus',
                    'uib-collapse'
                ],
                customtags: [
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
        
        jsonlint: {
            app: {
                src: [
                    'bower.json',
                    'package.json',
                    'app/data/*.json'
                ]
            }
        },
        
        less: {
            app: {
                files: {
                    "src/css/app.css": "src/less/app.less"
                }
            }
        },
                     
        watch: {
            lint: {
                files: [
                    'app/**/*.js', 
                    'Gruntfile.js',
                    'server.js',
                    '*.json', 
                    '.bowerrc',
                    'src/js/**/*.js',
                    'src/js/views/*.html'
                ],
                tasks: ['lint']
            },
                     
            less: {
                files: 'src/less/app.less',
                tasks: ['less']
            },
        }             
        
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html-angular-validate');
    grunt.loadNpmTasks('grunt-jsonlint');
    
    grunt.registerTask('lint', ['jshint', 'jsonlint', 'htmlangular']);
    
};
