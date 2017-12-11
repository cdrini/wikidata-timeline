'use strict';

// Declare app level module which depends on views, and components
angular.module('wikidataTimeline', [
  'ngRoute',
  'wikidataTimeline.newTimelineView',
  'wikidataTimeline.timelineView',
  'wikidataTimeline.staticSampleView'
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

.controller('AppController', ['$scope', '$urlParamManager', '$wdqSamples',
function($scope, $urlParamManager, $wdqSamples) {
  var paramManager = $urlParamManager({
    embed: false
  });

  $scope.embedded = paramManager.get('embed');
  $scope.samples = $wdqSamples.getSamples();
}]);
