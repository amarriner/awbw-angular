'use strict';

angular.module('advanceWarsByWeb.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$http', 'User',
    function($scope, $http, User) {
        
        $scope.submit = function(username, password) {
            
            var credentials = {
                "username": $scope.username,
                "password": $scope.password
            };

            User.getToken(credentials);
           
        };
        
        $scope.message = User.getMessage;
        $scope.loading = User.getLoading;
    }
]);