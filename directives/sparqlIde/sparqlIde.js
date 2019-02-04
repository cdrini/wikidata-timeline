angular.module('wikidataTimeline')

/**
 * Directive for displaying a WDQ editing 'IDE'
 */
.directive('wdtSparqlIde', ['$timeout', '$wdqSamples', function($timeout, $wdqSamples) {
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
      $scope.sparqlDocId = 'introduction';
      $scope.selectedWikidata = null;
      $scope.showWikidata = false;

      var SPARQL_DOCS_IDS = {
        keyword: {
          base: 'relIRIs',
          prefix: 'prefNames',
          select: 'select',
          distinct: 'modDistinct',
          reduced: 'modReduced',
          construct: 'construct',
          describe: 'describe',
          ask: 'ask',
          from: 'specifyingDataset',
          named: 'specifyingDataset',
          where: 'WritingSimpleQueries',
          order: 'modOrderBy',
          limit: 'modResultLimit',
          offset: 'modOffset',
          filter: 'termConstraint',
          optional: 'optionals',
          graph: 'queryDataset',
          by: '', // ambiguous: Group By/Order By
          asc: 'modOrderBy',
          desc: 'modOrderBy',
          as: 'assignment',
          having: 'having',
          undef: 'inline-data-syntax',
          values: 'inline-data',
          group: 'groupby',
          minus: 'neg-minus',
          in: 'func-in',
          not: '', // ambiguous: NOT IN/NOT EXISTS
          service: '',
          silent: '',
          using: '',
          insert: '',
          delete: '',
          union: 'alternatives',
          true: '',
          false: '',
          with: '',
          data: '',
          copy: '',
          to: '',
          move: '',
          add: '',
          create: '',
          drop: '',
          clear: '',
          load: '',
        },
        builtin: {
          str: 'func-str',
          lang: 'func-lang',
          langmatches: 'func-langMatches',
          datatype: 'func-datatype',
          bound: 'func-bound',
          sameterm: 'func-sameTerm',
          isiri: 'func-isIRI',
          isuri: 'func-isIRI',
          iri: 'func-iri',
          uri: 'func-iri',
          bnode: 'func-bnode',
          count: 'defn_aggCount',
          sum: 'defn_aggSum',
          min: 'defn_aggMin',
          max: 'defn_aggMax',
          avg: 'defn_aggAvg',
          sample: 'defn_aggSample',
          group_concat: 'defn_aggGroupConcat',
          rand: 'idp2130040',
          abs: 'func-abs',
          ceil: 'func-ceil',
          floor: 'func-floor',
          round: 'func-round',
          concat: 'func-concat',
          substr: 'func-substr',
          strlen: 'func-strlen',
          replace: 'func-replace',
          ucase: 'func-ucase',
          lcase: 'func-lcase',
          encode_for_uri: 'func-encode',
          contains: 'func-contains',
          strstarts: 'func-strstarts',
          strends: 'func-strends',
          strbefore: 'func-strbefore',
          strafter: 'func-strafter',
          year: 'func-year',
          month: 'func-month',
          day: 'func-day',
          hours: 'func-hours',
          minutes: 'func-minutes',
          seconds: 'func-seconds',
          timezone: 'func-timezone',
          tz: 'func-tz',
          now: 'func-now',
          uuid: 'func-uuid',
          struuid: 'func-struuid',
          md5: 'func-md5',
          sha1: 'func-sha1',
          sha256: 'func-sha256',
          sha384: 'func-sha384',
          sha512: 'func-sha512',
          coalesce: 'func-coalesce',
          if: 'func-if',
          strlang: 'func-strlang',
          strdt: 'func-strdt',
          isnumeric: 'func-isNumeric',
          regex: 'func-regex',
          exists: 'neg-pattern',
          isblank: 'func-isBlank',
          isliteral: 'func-isLiteral',
          a: '',
          bind: 'bind',
        }
      };

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

        $scope.activeToken = token.string.toLowerCase();
        if (token.type in SPARQL_DOCS_IDS) {
          $scope.sparqlDocId = SPARQL_DOCS_IDS[token.type][$scope.activeToken];
          $scope.$digest();
        } else {
          $scope.activeToken = '';
          $scope.$digest();
        }

        if (token.type == 'atom') {
          if (/([QP]\d+)$/.test(token.string)) {
            var id = token.string.match(/([QP]\d+)$/)[0];
            console.log(id);
            if (id.startsWith('P')) {
              $scope.selectedWikidata = 'https://www.wikidata.org/wiki/Property%3A' + id + '#p-namespaces';
            } else {
              $scope.selectedWikidata = 'https://www.wikidata.org/wiki/' + id + '#p-namespaces';
            }
            $scope.showWikidata = true;
            $scope.$digest();
          } else {
            $scope.showWikidata = false;
            $scope.$digest();
          }
        } else {
          $scope.showWikidata = false;
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
      editor.on('change', () => {
        $scope.model = editor.getValue();
        $timeout();
      });
      editor.on('cursorActivity', getTokenUnderCursor);
    }
  };
}]);
