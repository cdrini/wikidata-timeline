'use strict';

// Declare app level module which depends on views, and components
angular.module('wikidataTimeline', [
  'ngRoute',
  'wikidataTimeline.samplesView',
  'wikidataTimeline.mainView',
  'wikidataTimeline.newView'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({
    templateUrl: 'newView/newView.html',
    controller: 'NewViewCtrl'
  });
}]);
