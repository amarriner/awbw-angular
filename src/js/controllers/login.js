(function() {
    'use strict';

    angular.module('advanceWarsByWeb.login', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'js/views/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ['$scope', '$window', '$location', 'Login', 'SweetAlert',
        function($scope, $window, $location, Login, SweetAlert) {
        
            var token;
        
            $scope.buttonDisabled = false;
            
            $scope.login = function() {
                $scope.buttonDisabled = true;
                $scope.error = "";
            
                Login.authenticate({
                    username: $scope.username,
                    password: $scope.password
                }).then(function(response) {
                
                    Login.setCurrentUser(response.data.user);
                    
                    $window.sessionStorage.token = response.data.token;    
                    
                    if ($window.sessionStorage.previousLocation) {
                        $location.path($window.sessionStorage.previousLocation);
                    }
                    else {
                        $location.path('/');
                    }
 
                }).catch(function(response) {
                
                    SweetAlert.swal({title: 'Error', text: response.data.message}, function() { $scope.buttonDisabled = false; });
                
                });
            };
        }   
    ]);
}());