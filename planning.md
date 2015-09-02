# MVP
* Allow users to embed timeline in their own sites using iframes
* Allow users to download an SVG copy of the timeline
* Add license
* Available on WD tools for easy access
* Add to the directory of WD tools
* Add "Powered by Wikidata" icon
* Complete README
## Done:
* Dynamically load content using WDQ which the user can enter
* Display a timeline using data from wikidata

# Current Sprint
* Restructure angular routes (home; no samples)
* cleanup timeline.js:285
* Add visual indicator (with pause/cancel options) as pages loaded from Wikidata
## Done:
* Use bootstrap
* Add items in realtime as loaded from Wikidata

# Backlog
* Add point events
* Let user choose how pick start/end times (somehow)
  * example: show US presidents office time :/
  * maybe `claim[39:11696]{claim[580]}` ? Would have to write a parser though...
  * maybe `item.claim('39:11696').qualifier(580)` ? This would be easy! Harder for users to pick up, but not *that* hard.
* Add embed option (using /:embed route)
* Add tooltips
* Visual indicator for date precision
* Visual indicator for 'somevalue' (i.e. unknown end date)
* Add SPARQL support
* Add UI page for query entry
* Better date formatting for BCE years
* Add title URL param
* Add brush control
  * Timeline example: http://bl.ocks.org/bunkat/2338034
  * General example: http://bl.ocks.org/mbostock/1667367
  * Docs: https://github.com/mbostock/d3/wiki/SVG-Controls

## Done:
* Stack the items so they take less vertical space
