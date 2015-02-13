'use strict';

advanceWarsByWebServices.factory('Units', ['$http',
    function($http) {
        
        var message;
        var units;
        
        $http.get('https://awbw.amarriner.com/api/unit-type').
            success(function(data) {
                units = data;
            }).
            error(function(data) {
                message = "Error retrieving units from API!";
            });
        
        return {
            getMessage: function() {
                return message;
            },
            getUnits: function() {        
                return units;
            },
        };
        
    }
]);
