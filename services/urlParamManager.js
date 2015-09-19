angular.module('wikidataTimeline')

.factory('$urlParamManager', ['$location', '$q', function($location, $q) {
  var ParamTypes = {
    'String': 1,
    'Array':  2,
    'JSON':   3,
    'Float':  4,
    'Boolean':5
  };

  /**
   * @class
   * @constructor
   * @param {object} defn mapping of urlParamNames to default values. Arrays will
   * be automatically read as CSV
   */
  function URLManager(defn) {
    this.definedParams = defn;

    // determine types
    this.types = {};
    for (var name in defn) {
      var val = defn[name];
      var type = ParamTypes.String;

      if (val instanceof Array) {
        type = ParamTypes.Array;
      }
      else if (val instanceof Boolean) {
        type = ParamTypes.Boolean;
      }
      else if (val instanceof Object) {
        type = ParamTypes.Object;
      }
      else if (!isNaN(parseFloat(val))) {
        type = ParamTypes.Float;
      }

      this.types[name] = type;
    }
  }

  URLManager.prototype.get = function(name) {
    var val = $location.search()[name];
    var result = val;

    if (typeof val != 'undefined') {
      switch(this.types[name]) {
        case ParamTypes.String: return val;
        case ParamTypes.Array: return val.split(',');
        case ParamTypes.Boolean: return val;
        case ParamTypes.Object: {
          try {
            return JSON.parse(val)
          } catch(e) {
            throw "ERROR: invalid JSON as URL Param Object";
          }
        }
        case ParamTypes.Float: return parseFloat(val);
      }
    }
    else {
      return this.definedParams[name];
    }
  };

  var api = function(defn) {
    return new URLManager(defn);
  };

  api.isDefined = function(name) {
    return !(typeof $location.search()[name] == 'undefined');
  };

  return api;
}]);
