'use strict';

angular.module('advanceWarsByWeb.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'views/login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$http',
    function($scope, $http) {
        
        $scope.submit = function(username, password) {
            
            var credentials = {
                "username": $scope.username,
                "password": $scope.password
            };

            $http.post(restUrlBase + 'login', credentials).
                success(function(data) { 
                    $("#results").text("Success! " + data['token']);
                }).
                error(function(data) {
                    $("#results").text("Error! " + data["message"]);
                });
        };
    }
]);