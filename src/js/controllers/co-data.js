(function() {
    'use strict';

    angular.module('advanceWarsByWeb.coData', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/co-data', {
            templateUrl: 'js/views/co-data.html',
            controller: 'CoDataCtrl'
        });
    }])

    .controller('CoDataCtrl', ['$scope', 'Data',
        function($scope, Data) {
            
            Data.getCoData().then(function(response) {
                
                $scope.data = response.data;
                console.log($scope.data);
                
            }).catch(function(response) {
            });
            
        }   
    ]);
}());