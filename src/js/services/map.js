(function() {
    'use strict';

    angular.module('advanceWarsByWeb.mapService', []).factory('Map', ['$http',
        function($http) {
            
            return {
                get: function(id) {
                    return $http.get('/api/maps/' + id)
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