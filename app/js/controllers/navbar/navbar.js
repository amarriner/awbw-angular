'use strict';

angular.module('advanceWarsByWeb.navbar', [])
               
.controller('NavbarCtrl', ['$scope', 'User',
    function($scope, User) {
        
        $scope.username = User.getUsername; 
        $scope.isLoggedIn = User.isLoggedIn;
        
        $scope.logout = function() {
            User.logout();
        };
    
    }
]);