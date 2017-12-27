'use strict';

angular.module('wikidataTimeline.newTimelineView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/new', {
    templateUrl: 'views/newTimelineView/newTimelineView.html',
    controller: 'NewTimelineViewCtrl'
  });
}])

.controller('NewTimelineViewCtrl', ['$scope', '$timeout', '$location', '$wikidata', '$userSettings', '$urlParamManager',
function($scope, $timeout, $location, $wikidata, $userSettings, $urlParamManager) {
  // initialize bootstrap tooltips :/
  $('[data-toggle="tooltip"]').tooltip();

  $scope.$userSettings = $userSettings;

  // URLParam setup
  var defaultValues = {
    wdq: '',

    languages: ['en', 'fr'],
    sitelink: 'wikidata',
    sitelinkFallback: true,

    widthOfYear: 20,
    defaultEndTime: 'now',
    title: ''
  };
  var urlManager = $urlParamManager(defaultValues);
  urlManager.addAlias('wdq', 'query');

  $scope.urlManager = urlManager;
  $scope.languages = urlManager.get('languages') ? urlManager.get('languages').join(',') : 'en,fr';

  $scope.title = urlManager.get('title');
  $scope.defaultEndTime = urlManager.get('defaultEndTime');
  $scope.sitelink = urlManager.get('sitelink');
  $scope.validSitelinks = $wikidata.sitelinks.concat('wikidata');
  $scope.sitelinkFallback = urlManager.get('sitelinkFallback');
  $scope.activeToken = '';
  $scope.showAllWDQDocs = false;
  $scope.contextualDocsEnabled = true;
  $scope.toggleContextualDocs = function() {
    $scope.activeToken = '';
    $scope.contextualDocsEnabled = !$scope.contextualDocsEnabled;
  };
  $scope.saveButtonStates = {
    Def: 1,
    ValidatingWDQ: 2,
    InvalidWDQ: 3,
    PreparingToDraw: 4
  };
  $scope.saveButtonState = $scope.saveButtonStates.Def;
  $scope.wdqError = false;

  $scope.drawTimeline = function() {
    var wdq = queryEditor.getValue();
    $scope.wdqError = false;

    $scope.saveButtonState = $scope.saveButtonStates.ValidatingWDQ;
    $wikidata.WDQ(wdq)
    .then(
      function success(qids) {
        $scope.saveButtonState = $scope.saveButtonStates.PreparingToDraw;
        $location.path('timeline').search({
          title: $scope.title,
          wdq: wdq,
          languages: $scope.languages,
          defaultEndTime: $scope.defaultEndTime,
          sitelink: $scope.sitelink,
          sitelinkFallback: $scope.sitelinkFallback
        });
      },
      function error() {
        $scope.wdqError = true;
        $scope.saveButtonState = $scope.saveButtonStates.InvalidWDQ;
        $timeout(function() {
          $scope.saveButtonState = $scope.saveButtonStates.Def;
        }, 1000);
      }
    );
  };

  var queryEditor = CodeMirror($('.query-editor')[0], {
    viewportMargin: Infinity,
    lineWrapping: true,
    matchBrackets: true,
    value: urlManager.get('wdq')
  });

  var getTokenUnderCursor = function(cm) {
    var token = cm.getTokenAt(cm.getCursor());

    if (token.type == 'keyword') {
      $scope.activeToken = token.string.toLowerCase();
      $scope.$digest();
    } else if (token.type == 'operator') {
      $scope.activeToken = 'operator';
      $scope.$digest();
    }
  };

  queryEditor.on('change', getTokenUnderCursor);
  queryEditor.on('cursorActivity', getTokenUnderCursor);

  $('form.new-view').on('keyup', function(ev) {
    // submit on ctrl enter
    if(ev.keyCode == 13 && ev.ctrlKey) $(this).find('[type="submit"]').click();
  });
}]);
