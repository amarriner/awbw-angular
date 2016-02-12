(function() {
    'use strict';

    angular.module('advanceWarsByWeb.navbar', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        
    }])
    .directive('navbar', function() {
        return {
            templateUrl: 'js/views/navbar.html'
        };
    })  
    .controller('NavbarCtrl', ['$scope', '$window', '$location', 'Login',
        function($scope, $window, $location, Login) {
            
            $scope.currentUser = Login.getCurrentUser;
            
            $scope.$on('$routeChangeSuccess', function() {
                $scope.location = $location.path();
            });
            
            $scope.menus = [];
            
            $scope.closeMenu = function() {
                console.log('test');
                $scope.menus[0] = true;
                $scope.menus[1] = true;
                $scope.menus[2] = true;
            };
            
            $scope.closeMenu();
            
            $scope.resetMenu = function(open) {
                for (var i = 1; i < $scope.menus.length; i++) {
                    if (open === i) {
                        $scope.menus[i] = !$scope.menus[i];
                    }
                    else {
                        $scope.menus[i] = true;
                    }
                }
            };
                      
            $scope.logout = function() {
                $scope.closeMenu();
                Login.clearCurrentUser();
                $window.sessionStorage.token = "";
                $location.path("/");
            };
            
        }   
    ]);
}());