module.exports = function(config){
  config.set({

    basePath : './',

    files : [
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-route/angular-route.js',
        'app/bower_components/angular-resource/angular-resource.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'app/js/app.js',
        'app/js/services/**/*.js',
        'app/js/controllers/**/*.js',
        'app/js/components/**/*.js',
        'app/js/tests/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
