angular.module('wikidataTimeline')

.factory('$wdqSamples', [function() {
  var samples = [
    {
      title: 'Former Countries',
      wdq: 'claim[31:(TREE[3024240][][279])] AND CLAIM[571]',
      widthOfYear: '1'
    },
    {
      title: 'American Sitcoms',
      wdq: 'claim[31:(tree[5398426][][279])] AND claim[495:30] AND claim[136:170238]'
    },
    {
      title: 'US Presidents',
      wdq: 'claim[39:11696] and claim[31:5]',
      widthOfYear: '10'
    },
    {
      title: 'Wars',
      wdq: 'claim[31:(TREE[198][][279])] AND CLAIM[580]',
      widthOfYear: '2'
    },
    {
      title: 'Empires',
      wdq: 'claim[31:48349]',
      widthOfYear: '1'
    },
    {
      title: 'Meryl Streep',
      wdq: 'claim[161:873] or items[873]'
    },
    {
      title: 'Charlie Chaplin',
      wdq: 'claim[161:882] or items[882]'
    },
    {
      title: 'Jules Verne',
      wdq: 'items[33977] OR claim[50:33977]',
      widthOfYear: 10,
      sitelink: 'wikisource'
    }
  ];

  function toUrl(sample) {
    var result = "";
    for(var name in sample) {
      result += '&' + name + '=' + encodeURIComponent(sample[name]);
    }

    return result.length ? result.slice(1) : "";
  }

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
