'use strict';

advanceWarsByWebServices.factory('Countries', ['$http',
    function($http) {
        
        var message;
        var countries;
        
        $http.get('https://awbw.amarriner.com/api/country-type').
            success(function(data) {
                countries = data;
            }).
            error(function(data) {
                message = "Error retrieving countries from API!";
            });
        
        return {
            getMessage: function() {
                return message;
            },
            getCountries: function() {        
                return countries;
            },
        };
        
    }
]);