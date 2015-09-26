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

## Timeline view
(i.e. View it live here: https://tools.wmflabs.org/wikidata-timeline/#/timeline)

Name          | Type          | Default                    | Description
------------- | ------------- | -------------------------- | -------------
embed         |               |                            | If present (regardless of value), modifies view for embedding in an iframe
langs         | CSV           | en,fr                      | The languages to use. If no label in the given lang(s), stays blank
title         | string        | Untitled                   | Timeline's title. Useful so that your browser's history doesn't display the same thing for different timelines.
query         | WDQ           |                            | The Wikidata Query from which to get items. See [WDQ's Documentation](https://wdq.wmflabs.org/api_documentation.html) for help
widthOfYear   | px            | widthOfYear                | How many pixels wide a years should be on the timeline

# Credits

## Services/APIs
* [Wikidata API](https://www.wikidata.org/w/api.php)
* [WikidataQuery API](https://wdq.wmflabs.org/api_documentation.html)

## Libraries
* [AngularJS](https://github.com/angular/angular.js)
* [Bootstrap](https://github.com/twbs/bootstrap)
* [Codemirror](https://github.com/codemirror/CodeMirror)
* [D3](https://github.com/mbostock/d3)
* [jQuery](https://github.com/jquery/jquery)
