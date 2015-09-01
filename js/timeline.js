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

/**
 * @private
 * returns the end timestamp, or, if its undefined, present timestamp
 * @param {object} item
 * @returns {timestamp}
 */
function getEndTime(item) {
	return !item.end && item.end !== 0 ? (new Date()).getTime() : item.end;
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
  this._xAxis = d3.svg.axis()
    .scale(this.xScale)
    .orient("bottom")
	  .tickPadding(4);

	this._gridAxis = d3.svg.axis()
    .scale(this.xScale)
		.tickFormat('')
    .orient("bottom")
		.innerTickSize(-1*this.dimensions.gridHeight);

  this._xAxisGroup = this.svg.append('g').call(this._xAxis)
    .attr('transform', 'translate(0, ' + (this.dimensions.gridHeight) + ')');
	this._gridGroup = this.svg.append('g').call(this._gridAxis)
		.classed('grid', true)
    .attr('transform', 'translate(0, ' + (this.dimensions.gridHeight) + ')');
}

/**Draws the individual items
 * @private
 */
Timeline.prototype._drawItems = function() {
  var _this = this;
  this.svg._itemsGroup = this.svg.append('g').classed('items', true);

	// each row will store a (sorted) part of start, end values (px).
	// row 0 is at the bottom
	var rows = [];
	var nextRow = 0;

	// Group
  var groups = this.svg._itemsGroup.selectAll('g')
    .data(this.items)
    .enter()
    .append('g')
    .attr({
			class: 'item'
		});
	this._groups = groups;

	// Rect
  groups.append('rect')
    .attr({
      x:      function(d)    {return (_this.xScale(getEndTime(d)) - _this.xScale(d.start))/2 },
      y:      0,
      width:  0,
      height: _this.itemHeight,
    })
    // .transition().duration(80)
    // .delay(function(d, i) { return 60*Math.log(i); })
    .attr({
      x: 0,
      width:  function(d)    {return _this.xScale(getEndTime(d)) - _this.xScale(d.start)}
    });

	// Item text
  groups.append('text')
    .attr({
      x: function(d)    {return (_this.xScale(getEndTime(d)) - _this.xScale(d.start))/2 },
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

		// position the group
		groups.attr({
      transform: function(d, i) {
				var defaultY = _this.gridStartPoint.y - (nextRow+1) * _this.itemHeight;
				var finalY = defaultY;
				var bbox = this.getBBox();
				var xRange = {
					start: _this.xScale(d.start) + bbox.x,
					end: _this.xScale(d.start) + bbox.x + bbox.width
				};

				// first item; just add it
				if (nextRow === 0) {
					finalY = defaultY;
					rows[nextRow] = [ xRange ];
					nextRow++;
				} else {
					var rowWithRoom = -1;
					var indexInRow = -1;

					// starting from row 0, check if there is room.
					for(var i = 0; i < nextRow; ++i) {
						// check left
						if (xRange.end < rows[i][0].start) {
							rowWithRoom = i;
							indexInRow = 0;
							break;
						}
						// check right
						if (xRange.start > rows[i][rows[i].length - 1].end) {
							rowWithRoom = i;
							indexInRow = rows[i].length;
							break;
						}
						// check middle
						for(var j = 0; j < rows[i].length - 1; j++) {
							if (rows[i][j].end < xRange.start && rows[i][j+1].start > xRange.end) {
								rowWithRoom = i;
								indexInRow = j+1;
								break;
							}
						}

						if (rowWithRoom !== -1) break;
					}

					if (rowWithRoom != -1) {
						// success! put it here
						finalY = _this.gridStartPoint.y - (rowWithRoom+1) * _this.itemHeight;

						// add it to row (in correct position)
						rows[rowWithRoom] = rows[rowWithRoom].slice(0, indexInRow)
							.concat(xRange)
							.concat(rows[rowWithRoom].slice(indexInRow));
					} else {
						finalY = defaultY;
						rows[nextRow] = [ xRange ];
						nextRow++;
					}
				}

				return sprintf('translate(%%, %%)', _this.xScale(d.start), finalY);
			}
    });

		// Add anchors (where appropriate)
		groups.each(function(d) {
			if (d.href) {
				var group = d3.select(this);
				// move all the groups children into the anchor
				var anchor = group.append('a')
				.attr({
					'class': 'main-link',
					'xlink:href': function(d) { return d.href; },
					'xlink:show': 'new'
				});

				var anchorNode = anchor.node();

				var children = this.children;
				while(children.length > 1) {
					anchorNode.appendChild(children[0]);
				}
			}
		});

		// the height has probably changed because of stacking; should shrink doc

		this._updateSVGSize();
};


Timeline.prototype._updateSVGSize = function() {
	var newGridHeight = this.svg._itemsGroup.node().getBBox().height;
	var heightDiff = this.dimensions.gridHeight - newGridHeight;
	this.dimensions.gridHeight = newGridHeight;

	this.svg.attr({
		height:  this.canvasHeight,
		viewBox: sprintf("0 %% %% %%", heightDiff, this.canvasWidth, this.canvasHeight)
	});
};
