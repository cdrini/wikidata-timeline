'use strict';

angular.module('wikidataTimeline.newTimelineView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/new', {
    templateUrl: 'views/newTimelineView/newTimelineView.html',
    controller: 'NewTimelineViewCtrl'
  });
}])

.controller('NewTimelineViewCtrl', ['$scope', '$timeout', '$location', '$wikidata', 'Analytics', '$userSettings',
function($scope, $timeout, $location, $wikidata, $analytics, $userSettings) {
  $analytics.trackPage('/new', document.title);

  // initialize bootstrap tooltips :/
  $('[data-toggle="tooltip"]').tooltip()

  // disclaimer
  $scope.$userSettings = $userSettings;
  $scope.languages = 'en,fr';

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
  $scope.wdqError = '';

  $scope.drawTimeline = function() {
    var wdq = queryEditor.getValue();
    $scope.wdqError = '';

    $scope.saveButtonState = $scope.saveButtonStates.ValidatingWDQ;
    $wikidata.WDQ(wdq, {noitems: 1})
    .then(function(response) {
      if (response.data.status.error !== 'OK') {
        $scope.wdqError = response.data.status.error;
        $scope.saveButtonState = $scope.saveButtonStates.InvalidWDQ;
        $timeout(function() {
          $scope.saveButtonState = $scope.saveButtonStates.Def;
        }, 1000);
      } else {
        $scope.saveButtonState = $scope.saveButtonStates.PreparingToDraw;
        $location.path('timeline').search({
          title: $scope.title,
          query: wdq,
          languages: $scope.languages
        });
      }
    });
  }

  var queryEditor = CodeMirror.fromTextArea($('.query-editor')[0], {
    viewportMargin: Infinity,
    lineWrapping: true,
    matchBrackets: true
  });

  var updateTokenOnChange = function(cm, changeObj) {
    var token = cm.getTokenAt(changeObj.to);

    if (token.type == 'keyword') {
      $scope.activeToken = token.string.toLowerCase();
      $scope.$digest();
    } else if (token.type == 'operator') {
      $scope.activeToken = 'operator';
      $scope.$digest();
    }
  };

  queryEditor.on('change', updateTokenOnChange);

  $('form.new-view').on('keyup', function(ev) {
    // submit on ctrl enter
    if(ev.keyCode == 13 && ev.ctrlKey) {
      $(this).find('button[type="submit"]').click();
    }
  })
}]);
