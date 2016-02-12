(function() {
    'use strict';

    angular.module('advanceWarsByWeb.gameService', []).factory('Game', ['$http', '$q', 
        function($http, $q) {
            
            return {
                
                delete: function(slug) {
                    return $q(function(resolve, reject) {
                        $http.delete('/api/games/' + slug)
                            .then(function(response) {
                                resolve(response);
                            })
                            .catch(function(response) {
                                reject(response);
                            });
                    });
                },
                
                get: function(slug) {
                    return $q(function(resolve, reject) {
                        $http.get('/api/games/' + (slug || '') )
                            .then(function(response) {
                                resolve(response);
                            })
                            .catch(function(response) {
                                reject(response);
                            });
                    });
                },
                
                post: function(params) {
                    return $q(function(resolve, reject) {
                        $http.post('/api/games/', params)
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