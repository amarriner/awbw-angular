'use strict';

advanceWarsByWebServices.factory('User', ['$http',
    function($http) {
        
        var dataFactory = {};
        
        var loading = false;
        var message;
        var token;
        var username;
        
        return {
            getLoading: function() {
                return loading;
            },
            getMessage: function() {
                return message;
            },
            getToken: function(credentials) {
                message = '';
                loading = true;
                
                return $http.post(restUrlBase + 'login', credentials).
                    success(function(data) { 
                        token = data.token;          
                        username = data.username;
                        message = "Success!";
                        loading = false;
                    }).
                    error(function(data) {
                        message = data.message;
                        loading = false;
                    });
            },
            getUsername: function() {
                return username;
            }
        };

    }
]);