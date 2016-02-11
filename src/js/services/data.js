(function() {
    'use strict';

    angular.module('advanceWarsByWeb.dataService', []).factory('Data', ['$http', '$resource', '$q',
        function($http, $resource, $q) {
            
            var menuData;
            
            return {
                getCoData: function() {
                    return $http.get('http://localhost:8888/api/cos-data')
                        .success(function(response) {
                            return response;
                        })
                        .error(function(response) {
                            return response;
                        });
                },
                
                getCountryData: function() {
                    return $http.get('http://localhost:8888/api/countries-data')
                        .success(function(response) {
                            return response;
                        })
                        .error(function(response) {
                            return response;
                        });
                },
                
                getTerrainData: function() {
                    return $http.get('http://localhost:8888/api/terrain-data')
                        .success(function(response) {
                            return response;
                        })
                        .error(function(response) {
                            return response;
                        });
                },
                
                getUnitData: function() {
                    return $http.get('http://localhost:8888/api/units-data')
                        .success(function(response) {
                            return response;
                        })
                        .error(function(response) {
                            return response;
                        });
                },
                
                getMenuData: function() {
                    
                    return $q(function(resolve, reject) {
                        
                        if (menuData) {
                            resolve(menuData);
                            return;
                        }

                        $resource('js/data/menu.json').get().$promise.then(function(response) {
                            menuData = response;
                            resolve(response);
                        });
                            
                    });

                }
                
           };
            
        }
    ]);
}());    