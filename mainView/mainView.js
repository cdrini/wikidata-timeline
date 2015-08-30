'use strict';

angular.module('wikidataTimeline.mainView', [])

.controller('MainViewCtrl', ['$scope', '$location', '$wikidata',
function($scope, $location, $wikidata) {

  var defaultOpts = {
    query: 'claim[31:(tree[5398426][][279])] AND claim[495:30] AND claim[136:170238]',
    langs: ['en', 'fr'],
    widthOfYear: 40
  };

  var dateTimeFormat = d3.time.format("%Y-%m-%d");

  // read in URL params
  var wdq = $location.search().query;
  $wikidata.WDQ(wdq)
  .then(function(response) {
    if (response.data.status.error !== 'OK') {
      throw response.data.status.error;
      return;
    }
    console.log(response);
    var ids = response.data.items;
    $wikidata.api.wbgetentities(ids, ['labels', 'sitelinks', 'claims'])
    .onChunkCompletion(function(response) {
      console.log('chunk!');
      if (response.error) {
        throw response.error.info;
        return;
      }

      var entities = response.data.entities;
      for (var id in entities) {
        var ent = new $wikidata.Entity(entities[id]);

        var link = ent.getWikipediaSitelink(undefined, true);
        link = link && 'https://' + link.site.slice(0,2) + '.wikipedia.org/wiki/' + link.title;

        var item = {
          name:  ent.getLabel(),
          start: ent.getFirstClaim('P580', 'P569'),
          end:   ent.getFirstClaim('P582', 'P570'),
          href:  link
        }

        item.start = item.start
          && item.start[0].mainsnak.snaktype == 'value'
          && $wikidata.parseDateTime(item.start[0].mainsnak.datavalue.value.time);
        item.end = item.end
          && item.end[0].mainsnak.snaktype == 'value'
          && $wikidata.parseDateTime(item.end[0].mainsnak.datavalue.value.time);

        if (!item.start) {
          hiddenEntities[id] = ent;
        } else {
          shownEntities[id] = ent;
          items.push(item);
        }
      }
    })
    .onFullCompletion(function() {
      tl.draw(d3.select('.timeline-container')[0][0]);
      console.log('done!');
    });
  });

  var shownEntities = {};
  var hiddenEntities = {};

  var items = [];
  var tl = new Timeline(items, {
  	widthOfYear: $location.search().widthOfYear || 40
  });
}]);
