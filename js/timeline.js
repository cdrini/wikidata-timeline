/******************************************
 ****** Helpers
 ******************************************/

/**
 * @private
 * Helper function which will assign principal[key] to secondary[key] if
 * defined, otherwise to defaultValue.
 */
function setParam(principal, secondary, key, defaultValue) {
	if(typeof(secondary[key]) == 'undefined') {
		principal[key] = defaultValue;
	} else {
		principal[key] = secondary[key];
	}
}

/**
 * @private
 * Helper function which converts ms to years
 * @param {Integer} ms
 * @return {Integer} years
 */
function msToYears(ms) {
  return ms / 3.15569e10;
}

/**
 * @private
 * Helper function which takes a string with '%%' as placeholders. Replaces
 * ith placeholder with (i+1)th param (first being the string)
 * @param {String} str with '%%' placeholders
 * @param {...*} [items] items to replace placeholders with
 * @return {String}
 */
function sprintf(str) {
  var args = arguments;
  var i = 1;
  return str.replace(/%%/g, function() { return args[i++];});
}

/******************************************
 ****** Main
 ******************************************/

/**
 * @class
 * @param {Array<Object>} items items to plot on timeline. Objects must have name, and
 * start, defined. 'end' is optional; if undefined, assumed the present.
 * @param {Object} opts config object
 *   @config {Integer}   [widthOfYear]
 *   @config {Integer}   [itemHeight]
 *   @config {Integer}   [itemSpacing] @todo
 *   @config {Timestamp} [startDate] @todo
 *   @config {Timestamp} [endDate] @todo
 *   @config {Integer}   [padding]
 *   @config {Integer}   [axisLabelSize] @todo
 */
function Timeline(items, opts) {
  this.items = items;
  opts = opts || {};

  setParam(this, opts, 'widthOfYear',                     20); //px
  setParam(this, opts, 'itemHeight',                      20); //px
  setParam(this, opts, 'itemSpacing',                      2); //px
  setParam(this, opts, 'startDate',                        0);
  setParam(this, opts, 'endDate',     (new Date()).getTime()); // present
  setParam(this, opts, 'padding',                          5);
  setParam(this, opts, 'axisLabelSize',                   20); //px
}

// getters/setters
Object.defineProperty(Timeline.prototype, 'canvasWidth',
  { get: function() { return this.dimensions.gridWidth + 2*this.padding; }});
Object.defineProperty(Timeline.prototype, 'canvasHeight',
  { get: function() { return this.dimensions.gridHeight +  2*this.padding + this.axisLabelSize; }});
Object.defineProperty(Timeline.prototype, 'gridStartPoint',
  { get: function() { return {
    x: this.padding,
    y: this.canvasHeight - this.padding - this.axisLabelSize
  }}});

/**Creates SVG, calculates range/scale
 * @private
 */
Timeline.prototype.init = function() {
  var _this = this;
  // determine data extents
  var timeMin = d3.min(this.items, function(d) { return d.start; });
  var timeMax = d3.max(this.items, function(d) { return !d.end && d.end !== 0 ? (new Date()).getTime() : d.end; });

  this.dimensions = {};
  this.dimensions.gridHeight = this.items.length * (this.itemHeight + this.itemSpacing);
  this.dimensions.gridWidth  = msToYears(timeMax - timeMin) * this.widthOfYear;

  this.xScale = d3.time.scale()
    .domain([timeMin, timeMax])
    .range([this.padding, this.padding + this.dimensions.gridWidth]);

  this.svg = d3.select(this.container).append('svg')
    .attr('width',   this.canvasWidth)
    .attr('height',  this.canvasHeight)
    .classed('timeline', true);

  this.chart = {
    svg: _this.svg
  };
}

/** Creates the timeline and appends it to HTMLContainer
 * @param{HTMLElement} HTMLContainer
 */
Timeline.prototype.draw = function(HTMLContainer) {
  this.container = HTMLContainer;
  if (!this.svg) {
    this.init();

  }

  this._drawGrid();
  this._drawItems();
};

/**Draws the grid/axes
 * @private
 */
Timeline.prototype._drawGrid = function() {
  var tl = this;

  var xAxis = d3.svg.axis()
    .scale(this.xScale)
    .orient("bottom")
	  .ticks(8)
	  .tickPadding(2);

  this._grid = this.svg.append('g').call(xAxis)
    .attr('transform', 'translate(0, ' + (this.dimensions.gridHeight) + ')');;
  this._grid.classed('grid', true);
}

/**Draws the individual items
 * @private
 */
Timeline.prototype._drawItems = function() {
  var _this = this;
  this.svg._itemsGroup = this.svg.append('g').classed('items', true);

  var groups = this.svg._itemsGroup.selectAll('g')
    .data(this.items)
    .enter()
    .append('g')
    .attr({
      class: 'item',
      transform: function(d, i) { return sprintf('translate(%%, %%)', _this.xScale(d.start), _this.gridStartPoint.y - (i+1) * _this.itemHeight); }
    });
  groups.append('rect')
    .attr({
      x:      function(d)    {return (_this.xScale(!d.end && d.end !== 0 ? (new Date()).getTime() : d.end) - _this.xScale(d.start))/2 },
      y:      0,
      width:  0,
      height: _this.itemHeight,
    })
    .transition().duration(80)
    .delay(function(d, i) { return 60*Math.log(i); })
    .attr({
      x: 0,
      width:  function(d)    {return _this.xScale(!d.end && d.end !== 0 ? (new Date()).getTime() : d.end) - _this.xScale(d.start)}
    });
  groups.append('text')
    .attr({
      x: function(d)    {return (_this.xScale(!d.end && d.end !== 0 ? (new Date()).getTime() : d.end) - _this.xScale(d.start))/2 },
      y: _this.itemHeight / 2
    })
		.append('tspan')
		.text(function(d) { return d.name; })
    .style({
      fill: '#000',
      'text-anchor': 'middle',
      'alignment-baseline': 'central',
      opacity: 0
    })
    .transition().duration(80).delay(function(d, i) { return 60*Math.log(i); })
    .style('opacity', 1);

};
