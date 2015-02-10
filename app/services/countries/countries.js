'use strict';

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