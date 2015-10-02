angular.module('wikidataTimeline')

.factory('$wdqSamples', [function() {
  var samples = [
    {
      title: 'Former Countries',
      query: 'claim[31:(TREE[3024240][][279])] AND CLAIM[571]',
      widthOfYear: '1'
    },
    {
      title: 'American Sitcoms',
      query: 'claim[31:(tree[5398426][][279])] AND claim[495:30] AND claim[136:170238]'
    },
    {
      title: 'US Presidents',
      query: 'claim[39:11696] and claim[31:5]',
      widthOfYear: '10'
    },
    {
      title: 'Wars',
      query: 'claim[31:(TREE[198][][279])] AND CLAIM[580]',
      widthOfYear: '2'
    },
    {
      title: 'Empires',
      query: 'claim[31:48349]',
      widthOfYear: '1'
    },
    {
      title: 'Meryl Streep',
      query: 'claim[161:873] or items[873]'
    },
    {
      title: 'Charlie Chaplin',
      query: 'claim[161:882] or items[882]'
    }
  ];

  function toUrl(sample) {
    var result = "";
    for(var name in sample) {
      result += '&' + name + '=' + encodeURIComponent(sample[name]);
    }

    return result.length ? result.slice(1) : "";
  };

  samples = samples.map(function(sample) {
    sample.urlComponents = toUrl(sample);
    return sample;
  });

  var api = {};
  api.getSamples = function() {
    return samples;
  };

  return api;
}]);
