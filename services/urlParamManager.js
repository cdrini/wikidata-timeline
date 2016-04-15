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
    this.alias2Param = {};
    this.param2Aliases = {};
    this.types = {};

    // determine types
    for (var name in defn) {
      var val = defn[name];
      var type;

      if (val instanceof Array)         type = ParamTypes.Array;
      else if (typeof val == "boolean") type = ParamTypes.Boolean;
      else if (val instanceof Object)   type = ParamTypes.Object;
      else if (!isNaN(parseFloat(val))) type = ParamTypes.Float;
      else                              type = ParamTypes.String;

      this.types[name] = type;
    }
  }

  /**
   * @param {string} val the unparsed value of the urlParam
   * @param {ParamTypes} type the type of the param
   * @return {string|array<string>|Boolean|Object}
   */
  URLManager._parseParam = function(val, type) {
    switch(type) {
      case ParamTypes.String:  return val;
      case ParamTypes.Array:   return val.split(',');
      case ParamTypes.Boolean: return val !== 'false';
      case ParamTypes.Float:   return parseFloat(val);
      case ParamTypes.Object: {
        try { return JSON.parse(val); }
        catch(e) { throw "Invalid JSON as URL Param Object"; }
        break;
      }
      default: throw "Unrecognized parameters type";
    }
  };

  URLManager.prototype._getFromPath = function(param) {
    var toCheck = [ param ].concat(this.param2Aliases[param] || []);

    for(var i = 0; i < toCheck.length; ++i) {
      var val = $location.search()[toCheck[i]];
      if (angular.isDefined(val)) return val;
    }
  };

  URLManager.prototype.get = function(name) {
    if (angular.isUndefined(this.definedParams[name]))
      throw "Unrecognized param name '" + name + "'.";

    var val = this._getFromPath(name);
    if (angular.isDefined(val)) {
      return URLManager._parseParam(val, this.types[name]);
    }
    else return this.definedParams[name];
  };

  URLManager.prototype.getFirst = function() {
    for(var i = 0; i < arguments.length; ++i) {
      if (angular.isUndefined(this.definedParams[arguments[i]]))
        throw "Unrecognized param name '" + arguments[i] + "'.";

      if (this._getFromPath(arguments[i])) return this.get(arguments[i]);
    }
  };

  URLManager.prototype.getUserSpecified = function() {
    var params = $location.search();
    var result = {};
    for(var p in params) {
      if (angular.isDefined(this.definedParams[p])) {
        result[p] = URLManager._parseParam(params[p], this.types[p]);
      }
      else if (this.alias2Param[p]) {
        var param = this.alias2Param[p];
        result[param] = URLManager._parseParam(params[p], this.types[param]);
      }
    }

    return result;
  };

  URLManager.prototype.isUserSpecified = function(name) {
    return angular.isDefined(this.getUserSpecified()[name]);
  };

  URLManager.prototype.addAlias = function(name, alias) {
    if (angular.isDefined(this.definedParams[alias]) || this.alias2Param[alias])
      throw "Cannot create alias '" + alias + "' for it is already defined.";
    if (angular.isUndefined(name))
      throw "Cannot create an alias to '" + name + "'; Unrecognized parameter name.";

    this.alias2Param[alias] = name;
    if (this.param2Aliases[name]) this.param2Aliases[name].push(alias);
    else this.param2Aliases[name] = [ alias ];
  };

  var api = function(defn) {
    return new URLManager(defn);
  };

  api.isDefined = function(name) {
    return angular.isDefined($location.search()[name]);
  };

  return api;
}]);
