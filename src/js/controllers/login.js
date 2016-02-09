(function() {
    'use strict';

    angular.module('advanceWarsByWeb.login', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'js/views/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ['$scope', '$window', '$location', 'Login',
        function($scope, $window, $location, Login) {
        
            var token;
        
            $scope.login = function() {
                $scope.error = "";
            
                Login.authenticate({
                    username: $scope.username,
                    password: $scope.password
                }).then(function(response) {
                
                    Login.setCurrentUser(response.data.user);
                    
                    $window.sessionStorage.token = response.data.token;    
                    $location.path($window.sessionStorage.previousLocation);
 
                }).catch(function(response) {
                
                    $scope.error = response.data.error;
                
                });
            };
        }   
    ]);
}());