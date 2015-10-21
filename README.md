![banner image](https://rawgit.com/cdrini/wikidata-timeline/master/imgs/banner.svg)
View it live here: https://tools.wmflabs.org/wikidata-timeline/

Web app for visualizing Wikidata items in the form of a timeline.


Developed on Chrome 44+. Firefox/IE also tested to be stable, but might have some issues.


It uses the following properties for determining time:
* startTime: 'P580', 'P569', 'P571'
* endTime: 'P582', 'P570', 'P576'
* pointInTime: 'P577'
If a startTime is present without an endTime, assumes endTime is the present.
Performs rounding when endtime is 'someValue'.


# URL Params

Valid on the [timeline view](https://tools.wmflabs.org/wikidata-timeline/#/timeline) and the [new view](https://tools.wmflabs.org/wikidata-timeline/#/new)

Name                 | Type        | Default         | Description
-------------------- | ----------- | --------------- | -------------
defaultEndtime       | String      | present         | One of "present" or "start".<br>(useful for resolving ``P571(inception)`` ambiguity)
embed                | Boolean     | true            | If true, optimizes view for embedding in an iframe
languages            | CSV         | en,fr           | The languages to use. If no label in the given lang(s), stays blank
query                | WDQ         |                 | The Wikidata Query from which to get items. See [WDQ's Documentation](https://wdq.wmflabs.org/api_documentation.html) for help
title                | string      | Untitled        | Timeline's title. Useful so that your browser's history doesn't display the same thing for different timelines.
widthOfYear          | px          | widthOfYear     | How many pixels wide a years should be on the timeline

Note: Boolean parameters are true for any value which is not "false".

# Credits

## Services/APIs
* [Wikidata API](https://www.wikidata.org/w/api.php)
* [WikidataQuery API](https://wdq.wmflabs.org/api_documentation.html)

## Libraries
* [AngularJS](https://github.com/angular/angular.js)
* [Angular Google Analytics](https://github.com/revolunet/angular-google-analytics)
* [Bootstrap](https://github.com/twbs/bootstrap)
* [Codemirror](https://github.com/codemirror/CodeMirror)
* [D3](https://github.com/mbostock/d3)
* [jQuery](https://github.com/jquery/jquery)
