(function() {
    'use strict';

    angular.module('advanceWarsByWeb.mapService', []).factory('Map', ['$http',
        function($http) {
            
            return {
                get: function(id) {
                    return $http.get('http://localhost:8888/api/maps/' + id)
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