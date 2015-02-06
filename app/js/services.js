'use strict';

var advanceWarsByWebServices = angular.module('advanceWarsByWebServices', ['ngResource']);

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

advanceWarsByWebServices.factory('Countries', ['$resource',
    function($resource) {
        return $resource('data/countries.json', {}, {
            query: {
                method: 'GET',
                params: {},
                isArray: true
            }
        });
    }
]);

advanceWarsByWebServices.factory('Cos', ['$resource',
    function($resource) {
        return $resource('data/cos.json', {}, {
            query: {
                method: 'GET',
                params: {},
                isArray: true
            }
        });
    }
]);