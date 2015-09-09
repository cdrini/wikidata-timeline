'use strict';

// Declare app level module which depends on views, and components
angular.module('wikidataTimeline', [
  'ngRoute',
  'wikidataTimeline.newTimelineView',
  'wikidataTimeline.timelineView',
  'wikidataTimeline.staticSampleView'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({
    templateUrl: 'views/newTimelineView/newTimelineView.html',
    controller: 'NewTimelineViewCtrl'
  });
}]);
