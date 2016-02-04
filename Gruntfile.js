module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            default: [
                "Gruntfile.js",
                "server.js",
                "app/**/*.js",
            ]
        },  
        
        jsonlint: {
            default: {
                src: [
                    'bower.json',
                    'package.json'
                ]
            }
        },
                     
        watch: {
            js: {
                files: [
                    'app/**/*.js', 
                    'Gruntfile.js',
                    'server.js',
                    '*.json', 
                    '.bowerrc'
                ],
                tasks: ['lint']
            }
        }             
        
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsonlint');
    
    grunt.registerTask('lint', ['jshint', 'jsonlint']);
    
};
