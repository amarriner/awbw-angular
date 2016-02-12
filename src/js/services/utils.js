(function() {
    'use strict';

    angular.module('advanceWarsByWeb.utilsService', []).factory('Utils', [
        function() {
            
            return {
                
                range: function(min, max, step) {
                    step = step || 1;
                    var input = [];
                    for (var i = min; i <= max; i += step) {
                        input.push(i);
                    }
                    return input;
                }
                
           };
            
        }
    ]);
}());    
