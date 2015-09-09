'use strict';

angular.module('wikidataTimeline.timelineView', [])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/timeline', {
    templateUrl: 'views/timelineView/timelineView.html',
    controller: 'TimelineViewCtrl'
  });
}])

.controller('TimelineViewCtrl', ['$scope', '$http', '$location', '$wikidata',
function($scope, $http, $location, $wikidata) {

  // scope variables
  $scope.queryStates = {
    WDQ:      1,
    Wikidata: 2
  };
  $scope.queryState = null;

  $scope.wdQueryStates = $wikidata.QueryStates;

  $scope.totalItemsToLoad = 0;
  $scope.itemsLoaded = 0;
  $scope.percentLoaded = function() {
    return Math.round(100*$scope.itemsLoaded / $scope.totalItemsToLoad);
  };

  var timelineStyle;
  $http({
    url: 'css/main.css'
  }).then(function(response) {
    timelineStyle = $('<style>' + response.data + '</style>');
  });
  $scope.downloadURL = '';
  $scope.createDownloadURL = function() {
    var svgEl = $('svg.timeline');
    if (svgEl.length == 0) {
      return;
    }
    $('svg.timeline')
      .prepend(timelineStyle);
    var svg = $('.timeline-container').html();
    timelineStyle.remove();

    var blob = new Blob([svg], {type: 'octet/stream'});
    if ($scope.downloadURL != '') {
      window.URL.revokeObjectURL($scope.downloadURL);
    }
    $scope.downloadURL = window.URL.createObjectURL(blob);
  };

  var defaultOpts = {
    query: 'claim[31:(tree[5398426][][279])] AND claim[495:30] AND claim[136:170238]',
    langs: ['en', 'fr'],
    widthOfYear: 20
  };

  var dateTimeFormat = d3.time.format("%Y-%m-%d");

  // read in URL params
  var wdq = $location.search().query;
  $scope.queryState = $scope.queryStates.WDQ;

  $wikidata.WDQ(wdq)
  .then(function(response) {
    $scope.queryState = null;

    if (response.data.status.error !== 'OK') {
      throw response.data.status.error;
      return;
    }
    console.log(response);
    var ids = response.data.items;
    $scope.totalItemsToLoad = ids.length;

    $scope.queryState = $scope.queryStates.Wikidata;
    $scope.wikidataQuery = $wikidata.api.wbgetentities(ids, ['labels', 'sitelinks', 'claims'])
    .onChunkCompletion(function(response) {
      console.log('chunk!');
      if (response.error) {
        throw response.error.info;
        return;
      }

      var itemsChunk = [];
      var entities = response.data.entities;
      for (var id in entities) {
        $scope.itemsLoaded++;

        var ent = new $wikidata.Entity(entities[id]);

        var link = ent.getWikipediaSitelink(undefined, true);
        link = link && 'https://' + link.site.slice(0,2) + '.wikipedia.org/wiki/' + link.title;

        var tmpRange = {
          start: ent.getFirstClaim('P580', 'P569', 'P571'),
          end:   ent.getFirstClaim('P582', 'P570', 'P576')
        };

        var item = {
          name: ent.getLabel(),
          href:  link
        };

        if (tmpRange.start) {
          if (tmpRange.start[0].mainsnak.snaktype == 'value') {
            item.start = $wikidata.parseDateTime(tmpRange.start[0].mainsnak.datavalue.value.time);
          }
        }

        if (tmpRange.end) {
          var snaktype = tmpRange.end[0].mainsnak.snaktype;
          if (snaktype == 'value') {
            item.end = $wikidata.parseDateTime(tmpRange.end[0].mainsnak.datavalue.value.time);
          } else if (snaktype == 'somevalue' && item.start) {
            // average lifespan is like 80, right?!
            // TODO: Add visual indicator (gradient? wavy line?)
            item.end = new Date(item.start.getTime() + 3.15569e10 * 80);
          }
        }

        ent.trimIncludeOnly({
          claims:       ['P580', 'P569', 'P571', 'P582', 'P570', 'P576'],
          labels:       defaultOpts.langs,
          descriptions: defaultOpts.langs,
          sitelinks:    defaultOpts.langs.map(function(l) { return l + "wiki"; })
        });

        if (!item.start) {
          hiddenEntities[id] = ent;
        } else {
          shownEntities[id] = ent;
          itemsChunk.push(item);
        }
      }

      if (!tl.isDrawn()) {
        Array.prototype.push.apply(items, itemsChunk);
        tl.draw(d3.select('.timeline-container')[0][0]);
      } else {
        tl.addItems(itemsChunk);
      }
    })
    .onFullCompletion(function() {
      $scope.queryState = null;
      console.log('done!');
    });
  });

  var shownEntities = {};
  var hiddenEntities = {};

  var items = [];
  var tl = new Timeline(items, {
  	widthOfYear: $location.search().widthOfYear || 20
  });
}]);
