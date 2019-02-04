angular.module('wikidataTimeline')

/**
 * Directive for displaying a WDQ editing 'IDE'
 */
.directive('wdtWdqIde', ['$wdqSamples', function($wdqSamples) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      model: '='
    },
    templateUrl: 'directives/wdqIde/wdqIde.html',
    link: function($scope, $element, $attrs) {
      $scope.showAllWDQDocs = false;
      $scope.contextualDocsEnabled = true;
      $scope.activeToken = '';
      $scope.samples = $wdqSamples.getSamples();

      $scope.toggleContextualDocs = function() {
        $scope.activeToken = '';
        $scope.contextualDocsEnabled = !$scope.contextualDocsEnabled;
      };

      /**
       * Updates the state to the current token under the cursor.
       * @param {CodeMirror.Editor} cm 
       */
      function getTokenUnderCursor(cm) {
        var token = cm.getTokenAt(cm.getCursor());
    
        if (token.type == 'keyword') {
          $scope.activeToken = token.string.toLowerCase();
          $scope.$digest();
        } else if (token.type == 'operator') {
          $scope.activeToken = 'operator';
          $scope.$digest();
        }
      };

      var editor = CodeMirror($('.query-editor')[0], {
        viewportMargin: Infinity,
        lineWrapping: true,
        matchBrackets: true,
        model: $scope.value
      });

      editor.on('change', getTokenUnderCursor);
      editor.on('change', () => $scope.model = editor.getValue())
      editor.on('cursorActivity', getTokenUnderCursor);
    }
  };
}]);
