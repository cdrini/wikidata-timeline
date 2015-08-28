'use strict';

angular.module('wikidataTimeline.mainView', [])

.controller('MainViewCtrl', ['$scope', '$location', '$wikidata',
function($scope, $location, $wikidata) {

  var defaultOpts = {
    query: 'claim[31:(tree[5398426][][279])] AND claim[495:30] AND claim[136:170238]',
    langs: ['en', 'fr']
  };

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
    $wikidata.api.wbgetentities(ids, ['labels', 'sitelinks'])
    .onChunkCompletion(function(response) {
      console.log('chunk!');
      console.log(response);
    })
    .onFullCompletion(function() {
      console.log('done!');
    });
  });

  var items = [];
  var tl = new Timeline(items, {
  	widthOfYear: 40
  });
  // tl.draw(d3.select('.timeline-container')[0][0]);
}]);
