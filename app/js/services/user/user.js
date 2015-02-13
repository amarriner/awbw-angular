'use strict';

advanceWarsByWebServices.factory('User', ['$http', '$location',
    function($http, $location) {
        
        var dataFactory = {};
        
        var loading = false;
        var loggedIn = false;
        var message;
        var username;
        var token;
        
        return {
            getLoading: function() {
                return loading;
            },
            getMessage: function() {
                return message;
            },
            getToken: function() {
                return token;
            },
            getUsername: function() {
                return username;
            },
            isLoggedIn: function() {
                return loggedIn;
            },
            login: function(credentials) {
                message = '';
                loading = true;
                
                var req = {
                    method : 'POST',
                    url    : 'https://awbw.amarriner.com/api/login',
                    headers: {
                        'Awbw-Token': token
                    },
                    data   : credentials
                };
                            
                return $http(req).
                    success(function(data) { 
                        token = data.token;          
                        username = data.username;
                        message = data.message;
                        loading = false;
                        loggedIn = true;
                    }).
                    error(function(data) {
                        message = data.message;
                        loading = false;
                        loggedIn = false;
                    });
            },
            logout: function() {
                username = undefined;
                token = undefined;
                loggedIn = false;
                $location.path("/");
            }
        };

    }
]);