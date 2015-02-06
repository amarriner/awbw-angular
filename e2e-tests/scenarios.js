'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Advance Wars by Web', function() {

    browser.get('index.html#/countries');

    //it('should automatically redirect to /units when location hash/fragment is empty', function() {
    //    expect(browser.getLocationAbsUrl()).toMatch("/units");
    //});

    //describe('units', function() {

    //    beforeEach(function() {
    //        browser.get('index.html#/units');
    //    });

    //    it('should render units when user navigates to units', function() {
    //        expect(element.all(by.css('[ng-view] h2')).first().getText()).
    //            toMatch(/Units/);
    //    });
    //});
        
    describe('countries', function() {

        beforeEach(function() {
            browser.get('index.html#/countries');
        });
        
        it('should render countries when user navigates to countries', function() {
            expect(element.all(by.css('[ng-view] h2')).first().getText()).
                toMatch(/Countries/);
        });
        
        it('should have an infantry icon for each country row', function() {
            console.log('Checking rows');
            element.all(by.css('.table-row div div.unit')).each(function(unit) {
                unit.getCssValue('background-image').then(function(value) {
                    console.log(value.replace('url(', '').replace(')', ''));
                });
            });
        });
    });

    describe('cos', function() {

        beforeEach(function() {
            browser.get('index.html#/cos');
        });
        
        it('should render countries when user navigates to cos', function() {
            expect(element.all(by.css('[ng-view] h2')).first().getText()).
                toMatch(/CO Info/);
        });

    });

});
