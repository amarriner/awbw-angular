'use strict';

advanceWarsByWebServices.factory('Units', ['$http',
    function($http) {
        
        var apiName = 'unit-type';
        var dataFactory = {};
        
        dataFactory.getUnits = function() {
            return $http.get('http://www.amarriner.com/awbw/api/unit-type');
        };
                
        return dataFactory;
    }
]);
