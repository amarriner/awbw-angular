(function() {
    'use strict';

    angular.module('advanceWarsByWeb.dataService', []).factory('Data', ['$http',
        function($http) {
            
            return {
                getCoData: function() {
                    return $http.get('http://localhost:8888/api/cos-data')
                        .success(function(response) {
                            return response;
                        })
                        .error(function(response) {
                            return response;
                        });
                }
                
           };
            
        }
    ]);
}());    