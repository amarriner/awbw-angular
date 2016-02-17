(function() {
    'use strict';

    angular.module('advanceWarsByWeb.dataService', []).factory('Data', ['$http', '$resource', '$q',
        function($http, $resource, $q) {
            
            //
            // Local variables to cache data so it only polls the API once
            //
            var coData;
            var countryData;
            var menuData;
            var terrainData;
            var unitData;
            
            //
            // Promise wrapper to get all data endpoints, cache them and return them
            //
            var getAll = function() {
                return $q(function(resolve, reject) {
                        
                    functions.getMenuData()
                        .then(functions.getCoData)
                        .then(functions.getUnitData)
                        .then(functions.getCountryData)
                        .then(functions.getTerrainData)
                        .then(function() {
                            resolve({
                                coData: coData,
                                countryData: countryData,
                                menuData: menuData,
                                terrainData: terrainData,
                                unitData: unitData
                            });                        
                        })
                        .catch(function(err) {
                            reject(err);
                        });
                    
                });     
            };
            
            //
            // Public functions that actually get exposed 
            //
            var functions = {
                
                //
                // Wrapper to private function above
                //
                getAll: getAll,
                
                //
                // Get CO data from API/cache
                //
                getCoData: function() {
                    
                    return $q(function(resolve, reject) {
                        
                        if (coData) {
                            return resolve(coData);
                        }
                        
                        $http.get('/api/cos-data')
                            .then(function(response) {
                                coData = response.data;
                                resolve(coData);
                            })
                            .catch(function(response) {
                                reject(response);
                            });
                    });
                },
                
                //
                // Get country data from API/cache
                //
                getCountryData: function() {
                        
                    return $q(function(resolve, reject) {

                        if (countryData) {
                            return resolve(countryData);
                        }
                        
                        return $http.get('/api/countries-data')
                            .then(function(response) {
                                countryData = response.data;
                                resolve(countryData);
                            })
                            .catch(function(response) {
                                reject(response);
                            });
                    });
                },
                
                //
                // Get menu data from API/cache
                //
                getMenuData: function() {
                    
                    return $q(function(resolve, reject) {
                        
                        if (menuData) {
                            return resolve(menuData);
                        }

                        $resource('js/data/menu.json').get().$promise.then(function(response) {
                            menuData = response;
                            resolve(response);
                        }).catch(function(response) {
                            reject(response);
                        });
                            
                    });

                },
                
                //
                // Get terrain data from API/cache
                //
                getTerrainData: function() {
                    
                    return $q(function(resolve, reject) {
                        
                        if (terrainData) {
                            return resolve(terrainData);
                        }
                        
                        return $http.get('/api/terrain-data')
                            .then(function(response) {
                                terrainData = response.data;
                                resolve(terrainData);
                            })
                            .catch(function(response) {
                                reject(response);
                            });
                    });
                },
                
                //
                // Get unit data from API/cache
                //
                getUnitData: function() {
                        
                    return $q(function(resolve, reject) {
                        
                        if (unitData) {
                            return resolve(unitData);
                        }
                        
                        return $http.get('/api/units-data')
                            .then(function(response) {
                                unitData = response.data;
                                resolve(unitData);
                            })
                            .catch(function(response) {
                                reject(response);
                            });
                    });
                }
                
            };
            
            //
            // Exposes functions for use in app
            //
            return functions;
            
        }
    ]);
}());    