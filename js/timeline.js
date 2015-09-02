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
  { get: function() { return this.gridWidth + 2*this.padding; }});
Object.defineProperty(Timeline.prototype, 'canvasHeight',
  { get: function() { return this.gridHeight +  2*this.padding + this.axisLabelSize; }});
Object.defineProperty(Timeline.prototype, 'gridStartPoint',
  { get: function() { return {
    x: this.padding,
    y: 0
  }}});

/**
 * Tells if the timeline has been drawn yet.
 * @return {Boolean}
 */
Timeline.prototype.isDrawn = function() {
	return !!this.svg;
};

/** Creates the timeline and appends it to HTMLContainer
 * @param{HTMLElement} HTMLContainer
 */
Timeline.prototype.draw = function(HTMLContainer) {
  this.container = HTMLContainer;

	this.gridWidth = 0;
	this.gridHeight = 0;

	// scale
	var timeMin = d3.min(this.items, function(d) { return d.start; });
	var timeMax = d3.max(this.items, function(d) { return getEndTime(d); });
	this.gridWidth = msToYears(timeMax - timeMin) * this.widthOfYear;
  this.xScale = d3.time.scale()
		.domain([timeMin, timeMax])
		.range([this.padding, this.padding + this.gridWidth]);

	// the svg
  this.svg = d3.select(this.container).append('svg')
    .classed('timeline', true);

	// x axis
	this._xAxis = d3.svg.axis()
		.scale(this.xScale)
		.ticks(100)
    .orient("bottom")
	  .tickPadding(4);
	this._xAxisGroup = this.svg.append('g').classed('x axis', true)
		.call(this._xAxis);

	// grid
	this._gridAxis = d3.svg.axis()
		.scale(this.xScale)
		.ticks(100)
		.tickFormat('')
    .orient("bottom")
		.innerTickSize(-1*this.gridHeight);
	this._gridGroup = this.svg.append('g').classed('grid', true)
		.call(this._gridAxis);

	// the items
	this.svg._itemsGroup = this.svg.append('g').classed('items', true);
	// these rows store the items in each row of the timeline, sorted. Used to
	// pack events in the _drawItems method.
	this.rows = [];
	this.nextRow = 0;


  this._drawItems();
};

/**Draws the individual items
 * @private
 */
Timeline.prototype._drawItems = function(items) {
  var _this = this;

	// Group
  var groups = this.svg._itemsGroup.selectAll('g')
    .data(this.items)
    .enter()
    .append('g')
    .attr({
			class: 'item'
		});

	// Rect
  groups.append('rect')
    .attr({
      x:      function(d) {return (_this.xScale(getEndTime(d)) - _this.xScale(d.start))/2 },
      y:      0,
      width:  0,
      height: _this.itemHeight,
    })
    // .transition().duration(80)
    // .delay(function(d, i) { return 60*Math.log(i); })
    .attr({
      x: 0,
      width: function(d) {return _this.xScale(getEndTime(d)) - _this.xScale(d.start)}
    });

	// Item text
  groups.append('text')
    .attr({
      x: function(d) {return (_this.xScale(getEndTime(d)) - _this.xScale(d.start))/2 },
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
    // .transition().duration(80).delay(function(d, i) { return 60*Math.log(i); })
    .style('opacity', 1);

		// position the group
		groups.attr({
      transform: function(d, i) {
				var defaultY = _this.gridStartPoint.y - (_this.nextRow+1) * _this.itemHeight;
				var finalY = defaultY;
				var bbox = this.getBBox();
				var xRange = {
					start: _this.xScale(d.start) + bbox.x,
					end: _this.xScale(d.start) + bbox.x + bbox.width
				};

				// first item; just add it
				if (_this.nextRow === 0) {
					finalY = defaultY;
					_this.rows[_this.nextRow] = [ xRange ];
					_this.nextRow++;
				} else {
					var rowWithRoom = -1;
					var indexInRow = -1;

					// starting from row 0, check if there is room.
					for(var i = 0; i < _this.nextRow; ++i) {
						// check left
						if (xRange.end < _this.rows[i][0].start) {
							rowWithRoom = i;
							indexInRow = 0;
							break;
						}
						// check right
						if (xRange.start > _this.rows[i][_this.rows[i].length - 1].end) {
							rowWithRoom = i;
							indexInRow = _this.rows[i].length;
							break;
						}
						// check middle
						for(var j = 0; j < _this.rows[i].length - 1; j++) {
							if (_this.rows[i][j].end < xRange.start && _this.rows[i][j+1].start > xRange.end) {
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
						_this.rows[rowWithRoom] = _this.rows[rowWithRoom].slice(0, indexInRow)
							.concat(xRange)
							.concat(_this.rows[rowWithRoom].slice(indexInRow));
					} else {
						finalY = defaultY;
						_this.rows[_this.nextRow] = [ xRange ];
						_this.nextRow++;
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
		this.gridHeight = this.svg._itemsGroup.node().getBBox().height;
		this._gridAxis.innerTickSize(-1*this.gridHeight); // FIXME: put me in better place T_T
		this._gridGroup.call(this._gridAxis);
		this._updateSVGSize();
};

/**
 * Adds the supplied items to the internal array and the chart. Updates chart's
 * axes to ensure the items fit. Use if adding a large number of items, to avoid
 * updating the axes a lot. Otherwise just add the array of items as per usual.
 * @param {array<object>} itemsArr items to add
 * @return {Timeline} @this
 */
Timeline.prototype.addItems = function(itemsArr) {
	var _this = this;

  if (!this.isDrawn()) {
    this.items = this.items.concat(itemsArr);
    return this;
  }

	var currentDomain = this.xScale.domain();
	var newItemsDomain = [
		d3.min(itemsArr, function(d) { return d.start; }),
		d3.max(itemsArr, function(d) { return getEndTime(d); })
	];

	var mustChangeDomain = (newItemsDomain[0] < currentDomain[0])
		|| (newItemsDomain[1] > currentDomain[1]);

	if (mustChangeDomain) {
		var newDomain = [
			Math.min(newItemsDomain[0], currentDomain[0]),
			Math.max(newItemsDomain[1], currentDomain[1])
		];
		var xTmp = this.xScale(0);
		this.xScale.domain(newDomain);
	}

	this.items = this.items.concat(itemsArr);

  // update xScale Range
  this.gridWidth = msToYears(this.xScale.domain()[1] - this.xScale.domain()[0]) * this.widthOfYear;
  this.xScale.range([this.padding, this.padding + this.gridWidth]);

  // update axes
  this._xAxisGroup.call(this._xAxis);
  this._gridGroup.call(this._gridAxis);

	if (mustChangeDomain) {
		var xChange = this.xScale(0) - xTmp;
		// move all the existing items over
		this.svg._itemsGroup.selectAll('g.item')
		.each(function(d, i) {
			var currentTransform = this.getAttribute('transform');
			var translation = currentTransform.match(/[-+]?((\d*\.\d+)|\d+)/g);

			this.setAttribute('transform', sprintf('translate(%%, %%)', _this.xScale(d.start), translation[1]));
		});

		// update ranges in rows so that things stay correct
		for (var i = 0; i < this.rows.length; ++i ) {
			for (var j = 0; j < this.rows[i].length; ++j) {
				this.rows[i][j].start += xChange;
				this.rows[i][j].end += xChange;
			}
		}
	}

  // draw the new items
  this._drawItems();
};

Timeline.prototype._updateSVGSize = function() {
  this.svg.attr({
    width: this.canvasWidth,
    height: this.canvasHeight,
    viewBox: sprintf("0 %% %% %%", -1*this.gridHeight, this.canvasWidth, this.canvasHeight)
  });
};
