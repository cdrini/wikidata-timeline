'use strict';

angular.module('wikidataTimeline.timelineView', [])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/timeline', {
    templateUrl: 'views/timelineView/timelineView.html',
    controller: 'TimelineViewCtrl'
  });
}])

.controller('TimelineViewCtrl', ['$scope', '$http', '$wikidata', '$urlParamManager',
function($scope, $http, $wikidata, $urlParamManager) {
  var defaultOpts = {
    query: 'claim[31:(tree[5398426][][279])] AND claim[495:30] AND claim[136:170238]',
    langs: ['en', 'fr'],
    widthOfYear: 20,
    title: 'Untitled'
  };
  var urlManager = $urlParamManager(defaultOpts);

  document.title = urlManager.get('title') + ' Timeline';
  $wikidata.langs = urlManager.get('langs');
  $scope.unembeddedUrl = function() {
    return location.href.replace(/([\?\&])embed/, function(match, $1) {
      return $1 + 'noembed'; // just in case someone did embed=true
    });
  };

  // scope variables
  $scope.queryStates = {
    WDQ:      1,
    Wikidata: 2
  };
  $scope.queryState = null;

  $scope.wdQueryStates = $wikidata.QueryStates;

  $scope.totalItemsToLoad = 0;
  $scope.itemsLoaded = 0;
  $scope.percentLoaded = function(type) {
    switch(type) {
      case 'shown': return Math.round(100*$scope.shownEntities.length / $scope.totalItemsToLoad);
      case 'hidden': return Math.round(100*$scope.hiddenEntities.length / $scope.totalItemsToLoad);
      default: return Math.round(100*$scope.itemsLoaded / $scope.totalItemsToLoad);
    }
  };

  var timelineStyle;
  $http({
    url: 'css/main.css'
  }).then(function(response) {
    timelineStyle = $('<style>' + response.data.replace(/\.timeline-container/g, '') + '</style>');
  });
  $scope.downloadURL = '';
  $scope.getSVGCode = function() {
    var svgEl = $('svg.main-chart');
    if (svgEl.length == 0) {
      return;
    }
    $('svg.main-chart')
      .prepend(timelineStyle);
    var svg = $('.main-chart-container').html(); // get the 'outer' html
    timelineStyle.remove();

    return svg;
  };
  $scope.createDownloadURL = function() {
    var blob = new Blob([$scope.getSVGCode()], {type: 'octet/stream'});
    if ($scope.downloadURL != '') {
      window.URL.revokeObjectURL($scope.downloadURL);
    }
    $scope.downloadURL = window.URL.createObjectURL(blob);
  };



  var dateTimeFormat = d3.time.format("%Y-%m-%d");

  // read in URL params
  var wdq = urlManager.get('query');
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

        var tmpItem = {
          start: ent.getFirstClaim('P580', 'P569', 'P571'),
          end:   ent.getFirstClaim('P582', 'P570', 'P576'),
          time:  ent.getFirstClaim('P577')
        };

        var item = {
          name: ent.getLabel(),
          href:  link
        };

        if (tmpItem.start) {
          if (tmpItem.start[0].mainsnak.snaktype == 'value') {
            item.start = $wikidata.parseDateTime(tmpItem.start[0].mainsnak.datavalue.value.time);
          }
        }

        if (tmpItem.end) {
          var snaktype = tmpItem.end[0].mainsnak.snaktype;
          if (snaktype == 'value') {
            item.end = $wikidata.parseDateTime(tmpItem.end[0].mainsnak.datavalue.value.time);
          } else if (snaktype == 'somevalue' && item.start) {
            // average lifespan is like 80, right?!
            // TODO: Add visual indicator (gradient? wavy line?)
            item.end = new Date(item.start.getTime() + 3.15569e10 * 80);
          }
        }

        if (tmpItem.time) {
          if (tmpItem.time[0].mainsnak.snaktype == 'value') {
            item.time = $wikidata.parseDateTime(tmpItem.time[0].mainsnak.datavalue.value.time);
          }
        }

        ent.trimIncludeOnly({
          claims:       ['P580', 'P569', 'P571', 'P582', 'P570', 'P576', 'P577'],
          labels:       urlManager.get('langs'),
          descriptions: urlManager.get('langs'),
          sitelinks:    urlManager.get('langs').map(function(l) { return l + "wiki"; })
        });

        if (!item.start && !item.time) {
          $scope.hiddenEntities.push(ent);
        } else {
          $scope.shownEntities.push(ent);
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

  $scope.shownEntities = [];
  $scope.hiddenEntities = [];

  var items = [];
  var tl = new Timeline(items, {
  	widthOfYear: urlManager.get('widthOfYear')
  });
}])

.controller('EmbedCtrl', ['$scope', '$element',
function($scope, $element) {
  var embedPreview = $('.embed-preview');
  var embedCode = $('.embed-code code');

  $scope.embedTypes = [
    {
      name: 'Live <iframe>',
      code: function() { return '<iframe style="width:100%; height: 400px; border: 0;" src="' + location.href + '&embed' + '"></iframe>'}
    },
    {
      name: 'Static SVG',
      code: function() { return '<div style="width:100%; max-height: 400px; overflow: auto;">' + $scope.$parent.getSVGCode() + '</div>'; }
    }
    // },
    // {
    //   name: 'Interactive SVG',
    //   code: function() { return 'ho!'; }
    // }
  ];

  $scope.activeEmbedType = -1;
  $scope.setEmbedType = function (newEmbedType) {
    if (newEmbedType !== $scope.activeEmbedType) {
      $scope.activeEmbedType = newEmbedType;

      var code = $scope.embedTypes[$scope.activeEmbedType].code();
      embedCode.text(code);
      embedPreview.html(code);
    }
  };
  $scope.isActive = function (embedIndex) {
    return $scope.activeEmbedType == embedIndex;
  };

  $('.embed-modal').on('shown.bs.modal', function () {
    if ($scope.activeEmbedType == -1) {
      $scope.setEmbedType(0);
    }
  })
}]);
