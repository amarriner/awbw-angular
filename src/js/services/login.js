(function() {
    'use strict';

    angular.module('advanceWarsByWeb.loginService', []).factory('Login', ['$http', '$window', '$q',  
        function($http, $window, $q) {
            
            var currentUser = {};
            
            return {
                authenticate: function(credentials) {
                    return $http.post('http://localhost:8888/api/authenticate', credentials)
                        .success(function(response) {
                            return response;
                        })
                        .error(function(response) {
                            $window.sessionStorage.token = "";
                            return response;
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
                            console.log('Setting user');
                            currentUser = user;
                        });   
                    }
                    
                    return $http.get('http://localhost:8888/api/authenticate')
                        .success(function(response) {
                            currentUser = response.user;
                            return response;
                        });
                }
           };
            
        }
    ]);
}());    