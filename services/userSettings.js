angular.module('wikidataTimeline')

// TODO: Add cookies fallback for browsers with localStorage disabled
// or with no localStorage
.factory('$userSettings', [function() {
  var settings = {};

  if(localStorage.getItem('wikidata-timeline')) {
    settings = JSON.parse(localStorage.getItem('wikidata-timeline'));
  } else {
    localStorage.setItem('wikidata-timeline', "{}");
  }

  return {
    /**
     * store an item in the userSettings
     * @param {string} name setting name
     * @param {*} value the value to store
     */
    setItem: function(name, value) {
      settings[name] = value;
      localStorage.setItem('wikidata-timeline', JSON.stringify(settings));
    },
    /**
     * get an item from memory. Return undefined if no item in memory
     * @param {string} name setting name
     * @return {*} setting value
     */
    getItem: function(name) {
      settings = JSON.parse(localStorage.getItem('wikidata-timeline'));
      return settings[name];
    }
  }
}]);
