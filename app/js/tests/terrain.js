'use strict';

describe('advanceWarsByWeb.terrain module', function() {

    beforeEach(module('advanceWarsByWeb.terrain'));
    beforeEach(module('advanceWarsByWebServices'));

    describe('terrain controller', function(){
        var scope, terrainCtrl;
        
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();

            terrainCtrl = $controller('TerrainCtrl', { $scope: scope });
        }));
        
        it('should ....', function() {
            //spec body
        
            expect(terrainCtrl).toBeDefined();
        });
    });
});