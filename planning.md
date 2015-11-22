# MVP
## Done:
* Available on WD tools for easy access
* Add to the directory of WD tools
* Complete README
* Add license
* Allow users to embed timeline in their own sites iframes/svg
* Allow users to download an SVG copy of the timeline
* Dynamically load content using WDQ which the user can enter
* Display a timeline using data from wikidata

# Current Sprint
## Done:

# Backlog
* Add option for 'interactive SVG' timeline embed
* Add UI page to change timeline settings in-place
* Make progress notification appear as bar instead of hovering overtop. Blocks a considerable chunk of the screen.
* Visual indicator for 'somevalue' (i.e. unknown end date)
* Visual indicator for date precision
* cleanup timeline.js:285
* Let user choose how pick start/end times (somehow)
  * example: show US presidents office time :/
  * maybe `claim[39:11696]{claim[580]}` ? Would have to write a parser though...
  * maybe `item.claim('39:11696').qualifier(580)` ? This would be easy! Harder for users to pick up, but not *that* hard.
* Add item tooltips
* Add SPARQL support

## Done:
* Let user choose where to link
* Stack the items so they take less vertical space
* Add WDQ API examples
* Add Samples to New page
* Smarter item label positioning (not off screen, if possible)
* Add embed option
* Add title URL param

# Past Sprints

## 20150907
* Add point events
* Add brush control
  * Timeline example: http://bl.ocks.org/bunkat/2338034
  * General example: http://bl.ocks.org/mbostock/1667367
  * Docs: https://github.com/mbostock/d3/wiki/SVG-Controls
  * Great example on codepen: http://codepen.io/techniq/pen/QbdpmB?editors=001
* Restructure angular routes (home; no samples)
* Smarter Axis appearance
* Add UI page for query entry
* Trim Wikidata items so we use less memory
* Better date formatting for BCE years
* Added toolinfo.json
* bug: fix shrinking API field in newView causing button to be difficult to press.
## 20150831
* Add visual indicator (with pause/cancel options) as pages loaded from Wikidata
* Use bootstrap
* Add items in realtime as loaded from Wikidata
