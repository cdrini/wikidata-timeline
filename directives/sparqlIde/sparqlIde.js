angular.module('wikidataTimeline')

/**
 * Directive for displaying a WDQ editing 'IDE'
 */
.directive('wdtSparqlIde', ['$wdqSamples', function($wdqSamples) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      model: '='
    },
    templateUrl: 'directives/sparqlIde/sparqlIde.html',
    link: function($scope, $element, $attrs) {
      $scope.showAllWDQDocs = false;
      $scope.contextualDocsEnabled = true;
      $scope.activeToken = '';
      $scope.samples = $wdqSamples.getSamples();

      var TEMPLATES = [
        {
          name: 'Basic',
          code: 'SELECT ?item ?itemLabel ?start ?end WHERE {\n  \n  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }\n}'
        }
      ];
      $scope.templates = TEMPLATES;

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

      var editorWrapper = $element[0].getElementsByClassName('query-editor')[0];
      var editor = CodeMirror(editorWrapper, {
        mode: 'sparql',
        viewportMargin: Infinity,
        lineWrapping: true,
        matchBrackets: true,
        value: $scope.model
      });

      editor.on('change', getTokenUnderCursor);
      editor.on('change', () => $scope.model = editor.getValue())
      editor.on('cursorActivity', getTokenUnderCursor);
    }
  };
}]);
