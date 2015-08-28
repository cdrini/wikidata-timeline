var WD = {};
WD.apiBase = 'https://www.wikidata.org/w/api.php';
WD.langs = ['en', 'fr'];

/**
 * @class
 */
WD.Entity = function(entity) {
	this.entity = entity;
}
/**
 * Gets the array of property's values. If not found, returns undefined.
 *
 * @param {String} prop - a property PID
 * @return {Array} of values or undefined
 */
WD.Entity.prototype.getClaim = function(prop) {
	return this.entity.claims[prop];
}

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
}

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
}

WD.Entity.prototype.getLabel = function(langs, returnObject) {
	if(langs instanceof String) {
		langs = [ langs ];
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
WD.Entity.prototype.getUrl = function() {
}
	return 'https://www.wikidata.org/wiki/' + this.entity.title;
}

/**
 * @param {string} wikidata query
 * @returns {Promise}
 */
WD.WDQ = function(query) {
	return $.ajax({
		url: 'https://wdq.wmflabs.org/api?q=' + encodeURIComponent(query),
		dataType: "jsonp"
	});
};

/**
 * Raw wrapper for the api
 */
WD.API = {};
WD.API.wbgetentities = function(opts) {
}
