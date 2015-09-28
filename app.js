'use strict';

// Declare app level module which depends on views, and components
angular.module('wikidataTimeline', [
  'ngRoute',
  'wikidataTimeline.newTimelineView',
  'wikidataTimeline.timelineView',
  'wikidataTimeline.staticSampleView',
  'angular-google-analytics'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({
    templateUrl: 'views/newTimelineView/newTimelineView.html',
    controller: 'NewTimelineViewCtrl'
  });
}])

.config(['$compileProvider', function($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
}])

.config(['AnalyticsProvider', function ($analyticsProvider) {
  $analyticsProvider
    .setAccount('UA-12233698-3')
    .trackPages(false);
}])
.run(['Analytics', function (Analytics) {}])

.controller('AppController', ['$scope', '$urlParamManager',
function($scope, $urlParamManager) {
  var paramManager = $urlParamManager({
    embed: false
  });

  $scope.embedded = paramManager.get('embed');
}]);
