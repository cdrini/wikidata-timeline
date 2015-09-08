'use strict';

angular.module('wikidataTimeline.newView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/new', {
    templateUrl: 'newView/newView.html',
    controller: 'NewViewCtrl'
  });
}])

.controller('NewViewCtrl', ['$scope', '$timeout', '$location', '$wikidata',
function($scope, $timeout, $location, $wikidata) {
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
          query: wdq
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
  queryEditor.on('blur', function() {
    $scope.activeToken = '';
    $scope.$digest();
  });
}]);
