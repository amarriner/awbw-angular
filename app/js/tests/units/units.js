'use strict';

describe('advanceWarsByWeb.units module', function() {

    beforeEach(module('advanceWarsByWeb.units'));
    beforeEach(module('advanceWarsByWebServices'));

    describe('units controller', function(){
        var scope, unitsCtrl;
        
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();

            unitsCtrl = $controller('UnitsCtrl', { $scope: scope });
        }));
        
        it('should ....', function() {
            //spec body
        
            expect(unitsCtrl).toBeDefined();
        });
    });
});