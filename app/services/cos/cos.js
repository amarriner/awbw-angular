'use strict';

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