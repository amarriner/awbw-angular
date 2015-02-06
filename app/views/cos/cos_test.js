'use strict';

describe('advanceWarsByWeb.cos module', function() {

    beforeEach(module('advanceWarsByWeb.cos'));
    beforeEach(module('advanceWarsByWebServices'));

    describe('cos controller', function(){
        var scope, cosCtrl;
        
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();

            cosCtrl = $controller('CosCtrl', { $scope: scope });
        }));
        
        it('should ....', function() {
            //spec body
        
            expect(cosCtrl).toBeDefined();
        });
    });
});