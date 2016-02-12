(function() {
    'use strict';

    angular.module('advanceWarsByWeb.mapService', []).factory('Map', ['$http', '$q', 
        function($http, $q) {
            
            return {
                get: function(id) {
                    
                    return $q(function(resolve, reject) {
                        $http.get('/api/maps/' + id)
                            .success(function(response) {
                                resolve(response);
                            })
                            .error(function(response) {
                                reject(response);
                            });
                    });
                }
                
           };
            
        }
    ]);
}());    