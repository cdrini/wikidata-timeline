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

.config(['$sceDelegateProvider', function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self', // Allow same origin resource loads.
    'https://www.wikidata.org/w/api.php', // Allow JSONP calls that match this pattern
    'https://www.w3.org/TR/sparql11-query/', // for sparql docs iframe
    'https://www.wikidata.org/wiki/*' // for sparql docs iframe
  ]);
}])

.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}])

.controller('AppController', ['$scope', '$urlParamManager', '$sparqlSamples',
function($scope, $urlParamManager, $sparqlSamples) {
  var paramManager = $urlParamManager({
    embed: false
  });

  $scope.embedded = paramManager.get('embed');
  $scope.samples = $sparqlSamples.getSamples();
}]);
