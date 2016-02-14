(function() {
    'use strict';

    angular.module('advanceWarsByWeb.register', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/register', {
            templateUrl: 'js/views/register.html',
            controller: 'RegisterCtrl'
        });
    }])

    .controller('RegisterCtrl', ['$scope', '$window', '$location', 'Login', 'SweetAlert',
        function($scope, $window, $location, Login, SweetAlert) {
        
            var token;
        
            $scope.buttonDisabled = false;
            
            $scope.register = function() {
                $scope.buttonDisabled = true;
                $scope.error = "";
            
                Login.register({
                    username: $scope.username,
                    password: $scope.password,
                    email: $scope.email
                }).then(function(response) {
                
                    console.log(response);
                    
                    Login.setCurrentUser(response.data.user);
                    
                    $window.sessionStorage.token = response.data.token;    
                    
                    SweetAlert.swal({title: 'Registered', text: 'User account created, logged in'}, function() {
                        $location.path('/');
                    });
                     
                }).catch(function(response) {
                
                    SweetAlert.swal({title: 'Error', text: response.data.message}, function() { $scope.buttonDisabled = false; });
                
                });
            };
        }   
    ]);
}());