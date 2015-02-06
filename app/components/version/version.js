'use strict';

angular.module('advanceWarsByWeb.version', [
  'advanceWarsByWeb.version.interpolate-filter',
  'advanceWarsByWeb.version.version-directive'
])

.value('version', '0.1');
