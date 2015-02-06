'use strict';

describe('advanceWarsByWeb.countries module', function() {

    beforeEach(module('advanceWarsByWeb.countries'));
    beforeEach(module('advanceWarsByWebServices'));

    describe('countries controller', function(){
        var scope, countriesCtrl;
        
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();

            countriesCtrl = $controller('CountriesCtrl', { $scope: scope });
        }));
        
        it('should ....', function() {
            //spec body
        
            expect(countriesCtrl).toBeDefined();
        });
    });
});