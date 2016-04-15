![banner image](https://rawgit.com/cdrini/wikidata-timeline/master/imgs/banner.svg)
View it live here: https://tools.wmflabs.org/wikidata-timeline/

Web app for visualizing Wikidata items in the form of a timeline.


Developed on/for Chrome 44+. Firefox/IE also tested to be stable, but might have some issues.

When using WDQ, these properties are used for determining time:
* startTime: 'P577', 'P580', 'P569', 'P571'
* endTime: 'P577', 'P582', 'P570', 'P576'

If endTime is missing, applies a default value (see the `defaultEndTime` url parameter).
If startTime = endTime, displayed as a point.
Performs rounding when endtime is 'someValue'.

# URL Params
Valid on the [timeline view](https://tools.wmflabs.org/wikidata-timeline/#/timeline) and the [new view](https://tools.wmflabs.org/wikidata-timeline/#/new).

Note: Boolean parameters are true for any value which is not "false".

Name                 | Type        | Default         | Description
-------------------- | ----------- | --------------- | -------------
defaultEndTime       | String      | now             | One of "now" or "start".<br>(also useful for resolving ``P571(inception)`` ambiguity).
embed                | Boolean     | false           | If true, optimizes view for embedding in an iframe.
title                | String      | Untitled        | Timeline's title. Useful so that your browser's history doesn't display the same thing for different timelines.
wdq                  | String      |                 | The Wikidata Query from which to get items. See [WDQ's Documentation](https://wdq.wmflabs.org/api_documentation.html) for help.
sparql               | String      |                 | The SPARQL Query to use for the visualization. Expects the 1st variable to be items, 2nd to be labels, 3rd to be start time, and 4th to be end time (optional; see `defaultEndTime` parameter)). Try it/learn more at [Wikidata Query Service](https://query.wikidata.org).
widthOfYear          | Number      | widthOfYear     | How many pixels wide a year should be on the timeline

## WDQ Params
Name                 | Type        | Default         | Description
-------------------- | ----------- | --------------- | -------------
languages            | CSV         | en,fr           | The languages to use, ordered by preference. If no label in the given lang(s), stays blank
sitelink             | String      | wikidata        | What an item links to when clicked. Language determined by ``languages``. Possible values: ``[ 'wikisource', 'commonswiki', 'wikibooks', 'wikiquote', 'wiki', 'wikinews', 'wikidata' ]``
sitelinkFallback     | Boolean     | true            | If true, when the desired sitelink is not available, links to wikidata. If false, links to nothing.

# Credits

## Services/APIs
* [Wikidata API](https://www.wikidata.org/w/api.php)
* [WikidataQuery API](https://wdq.wmflabs.org/api_documentation.html)
* [Wikidata Query Service SPARQL Endpoint](https://www.mediawiki.org/wiki/Wikidata_query_service/User_Manual#SPARQL_endpoint)

## Libraries
* [AngularJS](https://github.com/angular/angular.js)
* [Angular Google Analytics](https://github.com/revolunet/angular-google-analytics)
* [Bootstrap](https://github.com/twbs/bootstrap)
* [Codemirror](https://github.com/codemirror/CodeMirror)
* [D3](https://github.com/mbostock/d3)
* [jQuery](https://github.com/jquery/jquery)
