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
    wdq: 'claim[31:(tree[5398426][][279])] AND claim[495:30] AND claim[136:170238]',

    sparql: '',
    itemVar: '',
    labelVar: '',
    startVar: '',
    endVar: '',

    languages:   ['en', 'fr'],
    sitelink: 'wikidata',
    sitelinkFallback: true,
    widthOfYear: 20,
    defaultEndTime: 'now',
    title: 'Untitled'
  };
  var urlManager = $urlParamManager(defaultOpts);
  urlManager.addAlias('wdq', 'query');
  $scope.title = urlManager.get('title') + ' Timeline';
  document.title = $scope.title;

  $wikidata.languages = urlManager.get('languages');
  $scope.unembeddedUrl = function() {
    return location.href.replace(/([\?\&])embed/, function(match, $1) {
      return $1 + 'noembed'; // just in case someone did embed=true
    });
  };

  // scope variables
  $scope.queryStates = {
    WDQ:      1,
    Wikidata: 2,
    wdqs:     3
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
    if (svgEl.length === 0) return;

    $('svg.main-chart')
      .prepend(timelineStyle);
    var svg = $('.main-chart-container').html(); // get the 'outer' html
    timelineStyle.remove();

    return svg;
  };
  $scope.createDownloadURL = function() {
    var blob = new Blob([$scope.getSVGCode()], {type: 'octet/stream'});
    if ($scope.downloadURL !== '') {
      window.URL.revokeObjectURL($scope.downloadURL);
    }
    $scope.downloadURL = window.URL.createObjectURL(blob);
  };

  if (urlManager.isUserSpecified('sparql')) _buildFromSPARQL(urlManager.get('sparql'));
  else if (urlManager.isUserSpecified('wdq')) _buildFromWDQ(urlManager.get('wdq'));

  $scope.shownEntities = [];
  $scope.hiddenEntities = [];

  var items, tl;
  var tlOpts = {
    widthOfYear: urlManager.get('widthOfYear')
  };

  function _buildFromSPARQL(query) {
    $scope.queryState = $scope.queryStates.wdqs;
    $wikidata.wdqs(query)
    .then(function(response) {
      var data = response.data;
      var accessors = {
        item: urlManager.get('itemVar') || data.head.vars[0],
        label: urlManager.get('labelVar') || data.head.vars[1],
        start: urlManager.get('startVar') || data.head.vars[2],
        end: urlManager.get('endVar') || data.head.vars[3]
      };

      items = data.results.bindings;
      tl = new Timeline(items, tlOpts)
      .startTime(function(b) { return $wikidata.parseDateTime(b[accessors.start].value); })
      .endTime(function(b) {
        return b[accessors.end] ?
          $wikidata.parseDateTime(b[accessors.end].value) :
          (urlManager.get('defaultEndTime') == 'start' ?
            $wikidata.parseDateTime(b[accessors.start].value) :
            new Date());
        })
      .name(function(b) { return b[accessors.label].value; })
      .url(function(b) { return b[accessors.item].value; })
      .draw(d3.select('.timeline-container')[0][0]);
    });
  }

  function _buildFromWDQ(wdq) {
    items = [];
    tl = new Timeline(items, tlOpts);

    $scope.queryState = $scope.queryStates.WDQ;
    $wikidata.WDQ(wdq)
    .then(function(qids) {
      $scope.queryState = null;

      var ids = qids.map(function(qid) { return parseInt(qid.slice(1), 10); });
      $scope.totalItemsToLoad = ids.length;

      $scope.queryState = $scope.queryStates.Wikidata;
      $scope.wikidataQuery = $wikidata.api.wbgetentities(ids, ['labels', 'sitelinks', 'claims'])
      .onChunkCompletion(function(response) {
        console.log('chunk!');

        if (response.error) throw response.error.info;

        var itemsChunk = [];
        var entities = response.data.entities;
        for (var id in entities) {
          $scope.itemsLoaded++;

          var ent = new $wikidata.Entity(entities[id]);

          var link;
          if(urlManager.get('sitelink') == 'wikidata') {
            link = ent.url();
          } else {
            link = ent.getSitelink(urlManager.get('sitelink'));
          }
          if (!link && urlManager.get('sitelinkFallback')) {
            link = ent.url();
          }

          var tmpItem = {
            start: ent.getFirstClaim('P577', 'P580', 'P569', 'P571'),
            end:   ent.getFirstClaim('P577', 'P582', 'P570', 'P576')
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

          if(item.start && !item.end) {
            // set to current date
            item.end = urlManager.get('defaultEndTime') !== 'start' ? new Date() : item.start;
          }

          ent.trimIncludeOnly({
            claims:       ['P580', 'P569', 'P571', 'P582', 'P570', 'P576', 'P577'],
            labels:       urlManager.get('languages'),
            descriptions: urlManager.get('languages'),
            sitelinks:    urlManager.get('languages').map(function(l) { return l + "wiki"; })
          });

          if (!item.start || !item.end) {
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
  }
}])

.controller('EmbedCtrl', ['$scope', '$element',
function($scope, $element) {
  var embedPreview = $('.embed-preview');
  var embedCode = $('.embed-code code');

  $scope.embedTypes = [
    {
      name: 'Live <iframe>',
      code: function() { return '<iframe style="width:100%; height: 400px; border: 0;" src="' + location.href + '&embed' + '"></iframe>'; }
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
  });
}]);
