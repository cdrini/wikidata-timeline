angular.module('wikidataTimeline')

.factory('$wikidata', ['$http', '$q', function($http, $q) {
  var WD = {};
  WD.langs = ['en', 'fr'];

  /**
   * converts a wikidata datetime to a JS Date
   * @todo: expand to get time part as well
   * @param {string} dateTimeStr ex: +1952-03-11T00:00:00Z
   * @return {Date}
   */
  WD.parseDateTime = function(dateTimeStr) {
    var match = dateTimeStr.match(/^([+-]\d+)-(\d\d)-(\d\d)/);
    if (match && match.length == 4) {
      var result = new Date(match[1], match[2] - 1, match[3]);
      result.setFullYear(match[1]); // 30 != 1930, javascript!
      return result;
    } else {
      return undefined;
    }
  };

  /**
   * @class
   */
  WD.Entity = function(entity) {
  	this.entity = entity;
  };
  /**
   * Gets the array of property's values. If not found, returns undefined.
   *
   * @param {String} prop - a property PID
   * @return {Array} of values or undefined
   */
  WD.Entity.prototype.getClaim = function(prop) {
  	return this.entity.claims[prop];
  };
  /**
   * Get's a claim's value. Uses the first statement.
   *
   * @param {String} prop - a property PID
   * @return {String} The value
   */
  WD.Entity.prototype.getClaimValue = function(prop) {
  	var claim = this.entity.claims[prop];
  	if(!claim) return undefined;

  	// TODO: if there is a preferred statement, use it
  	// TODO: else pick first normal ranked statement

  	var statement = claim[0];
  	var type = statement.mainsnak.snaktype;
  	switch(type) {
  		case 'value':
  			return statement.mainsnak.datavalue.value;
  		default:
  			// TODO: Add other cases
  			return statement.mainsnak.datavalue.value;
  	}
  };
  /**
   * Returns the first of the arguments that has 1 or more claims. If none
   * found, returns undefined.
   *
   * @param list of string property IDs
   * @return {Array} of values or undefined
   */
  WD.Entity.prototype.getFirstClaim = function() {
  	for (var i = 0; i < arguments.length; i++) {
  		if(this.getClaim(arguments[i])) {
  			return this.getClaim(arguments[i]);
  		}
  	};
  	return undefined;
  };
  /**
   * Returns an entity's label. If langs provided, finds langs, otherwise uses
   * APIs defaults.
   * @param {array<string>} [langs] langs to look for label. Defaults to WD params
   * @param {Boolean} [returnObject=false] if true, returns an object ({language, value})
   * @return {string|object} string if !returnObject, else {language, value} object
   */
  WD.Entity.prototype.getLabel = function(langs, returnObject) {
    if (typeof langs == 'undefined') {
      langs = WD.langs;
    }
    if(langs instanceof String) {
  		langs = [ langs ];
  	}

    if (!this.entity.labels) {
      return "";
    }

  	// iterate through langs until we find one we have
  	for(var i = 0; i < langs.length; ++i) {
  		var obj = this.entity.labels[langs[i]];
  		if(obj) {
  			if (returnObject) {
  				return obj;
  			} else {
  				return obj.value;
  			}
  		}
  	}

  	// no luck. Try to return any label.
  	for(var lang in this.entity.labels) {
  		if(returnObject) {
  			return this.entity.labels[lang];
  		} else {
  			return this.entity.labels[lang].value;
  		}
  	}

  	// still nothing?!? return empty string
  	return "";
  };
  /**
   * Returns an entity's sitelink. If langs provided, finds langs, otherwise uses
   * APIs defaults.
   * @param {array<string>} [langs] langs to look for label. Defaults to WD params
   * @param {Boolean} [returnObject=false] if true, returns an object ({site, title, badges})
   * @return {string|object} string if !returnObject, else {site, title, badges} object
   */
  WD.Entity.prototype.getWikipediaSitelink = function(langs, returnObject) {
    if (typeof langs == 'undefined') {
      langs = WD.langs;
    }
    if (langs instanceof String) {
  		langs = [ langs ];
  	}

    if (!this.entity.sitelinks) {
      return null;
    }

  	// iterate through langs until we find one we have
  	for(var i = 0; i < langs.length; ++i) {
  		var obj = this.entity.sitelinks[langs[i] + 'wiki'];
  		if(obj) {
  			if (returnObject) {
  				return obj;
  			} else {
  				return obj.title;
  			}
  		}
  	}

  	// no luck. Try to return any label.
  	for (var sitelink in this.entity.sitelinks) {
      if (/wiki/.test(sitelink)) {
    		if (returnObject) {
    			return this.entity.sitelinks[sitelink];
    		} else {
    			return this.entity.sitelinks[sitelink].title;
    		}
      }
  	}

  	// still nothing?!? return null
  	return null;
  };

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

  /**
   * @name QueryState
   * @enum {number}
   */
  WD.QueryStates = {
    Active:   1,
    Pausing:  2,
    Paused:   3,
    Complete: 4
  };

  /**
   * See {@link https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities}
   * Executes the query in 50-sized chunks
   * @async
   * @param {array<integer>} ids the IDs to get
   * @param {array<string>} props props to get back for each item
   * @param {object} opts @todo
   * @return {Object} publicApi
   * @return {Function} publicApi.onChunkComplete
   * @return {Function} publicApi.onFullCompletion
   * @return {Function} publicApi.pause
   * @return {Function} publicApi.resume
   * @return {Function} publicApi.getState the state of the query.
   * See {@link QueryState}
   */
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

    var state = WD.QueryStates.Active;
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
      },
      pause: function() {
        state = WD.QueryStates.Pausing;
        return publicApi;
      },
      resume: function() {
        if (state == WD.QueryStates.Paused) {
          state = WD.QueryStates.Active;
          queryForNextChunk();
        }
        return publicApi;
      },
      getState: function() {
        return state;
      }
    };

    function queryForNextChunk() {
      if (state == WD.QueryStates.Active) {
        $http({
          url: WD.api.baseURL,
          method: 'jsonp',
          params: {
            action: 'wbgetentities',
            ids: idChunks.shift().join('|'),
            languages: WD.langs.join('|'),
            props: props.join('|'),
            callback: 'JSON_CALLBACK',
            format: 'json',
            cache: true
          }
        })
        .then(_onChunkCompletion);
      }
    };

    function _onChunkCompletion(response) {
      if (state == WD.QueryStates.Pausing) {
        state = WD.QueryStates.Paused;
      }
      api.onChunkCompletion(response);

      if (idChunks.length === 0) {
        state = WD.QueryStates.Complete;
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
