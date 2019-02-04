angular.module('wikidataTimeline')

.directive('wdtIframeId', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    scope: {
      wdtIframeId: '='
    },
    link: function($scope, $element, $attrs) {
      function updateId(val) {
        // Was having some issues with the update occuring before the item
        // became visible, which would set the id but wouldn't scroll (probably
        // because it doesn't know the iframe is visible yet). Adding a delay
        // seems to fix this.
        $timeout(function() {
          if (val) $element[0].src = $attrs.ngSrc + '#' + val;
        });
      }
      $scope.$watch('wdtIframeId', updateId);
      updateId($scope.wdtIframeId);
    }
  };
}]);
