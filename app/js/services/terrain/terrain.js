'use strict';

advanceWarsByWebServices.factory('Terrain', ['$http',
    function($http) {
        
        var message;
        var terrain;
        
        $http.get('https://awbw-api.amarriner.com/terrain-type').
            success(function(data) {
                terrain = data;
            }).
            error(function(data) {
                message = "Error retrieving terrain from API!";
            });
        
        return {
            getMessage: function() {
                return message;
            },
            getTerrain: function() {        
                return terrain;
            },
        };
        
    }
]);
