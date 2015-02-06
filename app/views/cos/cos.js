'use strict';

angular.module('advanceWarsByWeb.cos', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cos', {
    templateUrl: 'views/cos/cos.html',
    controller: 'CosCtrl'
  });
}])

.controller('CosCtrl', ['$scope', 'Cos',
    function($scope, Cos) {
        var cos = Cos.query();  
            
        $scope.cos = cos;
    }
]);