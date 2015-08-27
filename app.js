'use strict';

// Declare app level module which depends on views, and components
angular.module('wikidataTimeline', [
  'ngRoute',
  'wikidataTimeline.samplesView'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/samples'});
}]);
