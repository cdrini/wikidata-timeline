angular.module('wikidataTimeline')

.directive('wdtHelp', [function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    templateUrl: 'directives/quickHelp/quickHelp.html',
    link: function($scope, $element, $attrs) {
      $scope.quickHelpActive = false;
    }
  };
}]);
