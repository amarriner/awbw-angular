'use strict';

describe('advanceWarsByWeb.version module', function() {
  beforeEach(module('advanceWarsByWeb.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
