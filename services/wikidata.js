angular.module('wikidataTimeline')

.factory('$wikidata', ['$http', '$q', function($http, $q) {
  var WD = {};
  WD.langs = ['en', 'fr'];

  /**
   * @param {string} wikidata query
   * @returns {Promise}
   */
  WD.WDQ = function(query) {
  	return $http({
      url: 'https://wdq.wmflabs.org/api',
      params: {
        q: query,
        callback: 'JSON_CALLBACK' // -_-
      },
      method: 'jsonp'
    });
  };

  WD.api = {};
  var api = WD.api;
  api.baseURL = 'https://www.wikidata.org/w/api.php';
  api.wbgetentities = function(ids, props, opts) {
    ids = ids.map(function(id) { return 'Q' + id; });

    // split into 50-sized chunks
    var idChunks = [];
    for(var i = 0; i < ids.length; ++i) {
      if (i % 50 == 0) {
        idChunks.push([]);
      }
      idChunks[idChunks.length - 1].push(ids[i]);
    }

    var api = {
      onChunkCompletion: function() {},
      onFullCompletion: function() {}
    };
    var publicApi = {
      onChunkCompletion: function(fn) {
        api.onChunkCompletion = fn;
        return publicApi;
      },
      onFullCompletion: function(fn) {
        api.onFullCompletion = fn;
        return publicApi;
      }
    };

    function queryForNextChunk() {
      $http({
        url: WD.api.baseURL,
        method: 'jsonp',
        params: {
          action: 'wbgetentities',
          ids: idChunks.shift().join('|'),
          languages: WD.langs.join('|'),
          props: props.join('|'),
          callback: 'JSON_CALLBACK',
          format: 'json'
        }
      })
      .then(_onChunkCompletion);
    };

    function _onChunkCompletion(response) {
      api.onChunkCompletion(response);

      if (idChunks.length === 0) {
        api.onFullCompletion();
      } else {
        queryForNextChunk();
      }
    }

    queryForNextChunk();

    return publicApi;
  };

  return WD;
}]);
