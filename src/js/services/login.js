(function() {
    'use strict';

    angular.module('advanceWarsByWeb.loginService', []).factory('Login', ['$http', '$window', '$q',  
        function($http, $window, $q) {
            
            var currentUser = {};
            
            return {
                authenticate: function(credentials) {
                    return $q(function(resolve, reject) {
                        $http.post('/api/authenticate', credentials)
                            .then(function(response) {
                                resolve(response);
                            })
                            .catch(function(response) {
                                $window.sessionStorage.token = "";
                                reject(response);
                        });
                    });
                },
                
                clearCurrentUser: function() {
                    currentUser = {};
                },
            
                getCurrentUser: function() {
                    return currentUser;
                },
                    
                setCurrentUser: function(user) {

                    if (user) {
                        return $q(function(resolve, reject) {
                            currentUser = user;
                            resolve(currentUser);
                        });   
                    }
                    
                    return $http.post('/api/authenticate/check')
                        .then(function(response) {
                            currentUser = response.data.user;
                            return response;
                        });
                }
           };
            
        }
    ]);
}());    