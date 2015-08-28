'use strict';

// Declare app level module which depends on views, and components
angular.module('wikidataTimeline', [
  'ngRoute',
  'wikidataTimeline.samplesView',
  'wikidataTimeline.mainView'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({
    templateUrl: 'mainView/mainView.html',
    controller: 'MainViewCtrl'
  });
}]);
