(function() {
    'use strict';

    angular.module('advanceWarsByWeb.mapService', []).factory('Map', ['$http', '$q', 
        function($http, $q) {
            
            return {
                get: function(slug) {
                    
                    return $q(function(resolve, reject) {
                        $http.get('/api/maps/' + (slug || '') )
                            .then(function(response) {
                                resolve(response);
                            })
                            .catch(function(response) {
                                reject(response);
                            });
                    });
                }
                
           };
            
        }
    ]);
}());    