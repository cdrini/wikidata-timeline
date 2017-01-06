angular.module('wikidataTimeline')

.factory('$wikidata', ['$http', '$q', function($http, $q) {
  var WD = {};
  WD.languages = ['en', 'fr'];
  WD.sitelinks = [ 'wikisource', 'commonswiki', 'wikibooks', 'wikiquote', 'wiki', 'wikinews' ];

  /**
   * converts a wikidata datetime to a JS Date
   * @todo: expand to get time part as well
   * @param {string} dateTimeStr ex: +1952-03-11T00:00:00Z
   * @return {Date}
   */
  WD.parseDateTime = function(dateTimeStr) {
    var match = dateTimeStr.match(/^([+-]?\d+)-(\d\d)-(\d\d)/);
    if (match && match.length == 4) {
      var result = new Date(match[1], match[2] - 1, match[3]);
      result.setFullYear(match[1]); // 30 != 1930, javascript!
      return result;
    } else {
      return undefined;
    }
  };
  /**
   * Creates a sitelink's url from the given params
   * @param {string} lang the lang
   * @param {string} sitelink the sitelink suffix
   * @return {string} string the url
   */
  WD.makeSitelinkUrl = function(lang, sitelink, title) {
    switch(sitelink) {
      case 'wiki':
        return "https://" + lang + ".wikipedia.org/w/index.php?title=" + title;
      case 'commonswiki':
        return "https://commons.wikimedia.org/w/index.php?title=" + title;
      default:
        return "https://" + lang + "." + sitelink + ".org/w/index.php?title=" + title;
    }
  };

  /**
   * @class
   */
  WD.Entity = function(entity) {
    this.isTrimmed = false;
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
   * Returns wikidata url
   *
   * @return {string} wikidata url
   */
  WD.Entity.prototype.url = function(prop) {
  	return "https://www.wikidata.org/wiki/" + this.entity.id;
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
      langs = WD.languages;
    }
    if(typeof langs == "string") {
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
   * @param {string|array<string>} sitelinks the sitelinks to get. See WD.sitelinks for valid options.
   * @param {string|array<string>} [langs] langs to look for label. Defaults to WD params
   * @return {string} string the url
   */
  WD.Entity.prototype.getSitelink = function(sitelinks, langs) {
    if (typeof langs == 'undefined') {
      langs = WD.languages;
    }
    if (typeof langs == "string") {
  		langs = [ langs ];
  	}
    if (typeof sitelinks == "string") {
      sitelinks = [ sitelinks ]
    }

    if (!this.entity.sitelinks) {
      return null;
    }

  	// iterate through langs/sitelink pairs
    for(var i = 0; i < sitelinks.length; ++i) {

    	for(var j = 0; j < langs.length; ++j) {
        var sl = this.entity.sitelinks[sitelinks[i]] || this.entity.sitelinks[langs[j].replace(/\-/g, '_') + sitelinks[i]];
        if (sl) {
          return WD.makeSitelinkUrl(langs[j], sitelinks[i], sl.title);
        }
      }
  	}

  	// no luck. Return null
  	return null;
  };
  /**
   * Deletes any unneeded items. Define the properties to keep. Everything else
   * deleted.
   * @param {object} config defines how to trim
   *   @config {array<string>}  claims
   *   @config {array<string>}  descriptions
   *   @config {*}              id
   *   @config {array<string>}  labels
   *   @config {*}              lastrevid
   *   @config {*}              modified
   *   @config {*}              ns
   *   @config {*}              pageid
   *   @config {array<string>}  sitelinks
   *   @config {*}              title
   *   @config {*}              type
   */
   WD.Entity.prototype.trimIncludeOnly = function(config) {
     var neverRemove = ['id'];

     for (var key in this.entity) {
       if(neverRemove.indexOf(key) !== -1) {
         continue;
       }

       if (typeof config[key] !== 'undefined') {
         if (['claims', 'descriptions', 'labels', 'sitelinks'].indexOf(key) !== -1) {
           for (var p in this.entity[key]) {
             if (config[key].indexOf(p) == -1) {
               delete this.entity[key][p];
             }
           }
         }
       } else {
         delete this.entity[key];
       }
     }

     return this;
   };

  /**
   * @param {string} wikidata query
   * @returns {Promise<QID[]>}
   */
  WD.WDQ = function(query) {
    // first convert to a SPARQL query
    return $http({
      url: '//tools.wmflabs.org/wdq2sparql/w2s.php',
      params: {
        wdq: query
      }
    }).then(function (response) {
      var contentType = response.headers()['content-type'];
      if (contentType.indexOf('text/plain') != -1) {
        // avoid duplicate items; replace the outermost SELECT with DISTINCT
        var sparql = response.data
        .replace(/^SELECT (\S+)/i, function($0, $1) {
          return $1.toLowerCase() == 'distinct' ? $0 : 'SELECT DISTINCT ' + $1;
        });
        return WD.wdqs(sparql);
      } else {
        return $q.reject();
      }
    }).then(function (response) {
      return response.data.results.bindings.map(function (o) {
        return o.item.value.replace('http://www.wikidata.org/entity/', '');
      });
    });
  };

  /**
   * Query the Wikidata Query Service
   * @param  {string} sparql the SPARQL query
   * @return {Promise}
   */
  WD.wdqs = function(sparql) {
    return $http({
      url: 'https://query.wikidata.org/sparql',
      params: {
        query: sparql,
        format: 'json'
      }
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
            languages: WD.languages.join('|'),
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
