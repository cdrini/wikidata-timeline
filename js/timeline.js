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

	                     // param name                      // default value
  setParam(this, opts, 'widthOfYear',                     20); //px
  setParam(this, opts, 'itemHeight',                      20); //px
  setParam(this, opts, 'itemSpacing',                      2); //px
  setParam(this, opts, 'startDate',                        0);
  setParam(this, opts, 'endDate',     (new Date()).getTime()); // present
  setParam(this, opts, 'padding',                          5);
	setParam(this, opts, 'axisLabelSize',                   20); //px
	setParam(this, opts, 'miniChartHeight',                 80); //px

	return this;
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
	return !!this.mainChart;
};

/** Creates the timeline and appends it to HTMLContainer
 * @param{HTMLElement} HTMLContainer
 */
Timeline.prototype.draw = function(HTMLContainer) {
  this.container = HTMLContainer;
	this.chartContainer = document.createElement('div');
	this.chartContainer.setAttribute('class', 'main-chart-container');
	this.container.style.paddingBottom = this.miniChartHeight + 'px';
	this.container.appendChild(this.chartContainer);

	this.chartContainerRect = this.chartContainer.getBoundingClientRect();

	var _this = this;

	this.gridWidth = 0;
	this.gridHeight = 0;

	// scale
	var timeMin = d3.min(this.items, this.getStartTime.bind(this) );
	var timeMax = d3.max(this.items, this.getEndTime.bind(this) );
	this.gridWidth = msToYears(timeMax - timeMin) * this.widthOfYear;

	this.mainChart = {};
	// the svg
  this.mainChart.svg = d3.select(this.chartContainer).append('svg')
		.attr("version", 1.1)
		.attr("xmlns", "http://www.w3.org/2000/svg")
    .classed('main-chart', true);

	// {svg, xScale, xAxis, xAxisGroup, gridAxis, gridGroup itemsGroup}
	this.mainChart.xScale = d3.time.scale()
		.domain([timeMin, timeMax])
		.range([this.padding, this.padding + this.gridWidth]);

	// x axis
	this.mainChart.xAxis = d3.svg.axis()
		.scale(this.mainChart.xScale)
		.ticks(100)
    .orient("bottom")
		.tickSize(8,4)
		.tickFormat(function (d) { return d.getUTCFullYear(); }) // avoid things like -0800
	  .tickPadding(4);
	this.mainChart.xAxisGroup = this.mainChart.svg.append('g')
		.classed('x axis', true)
		.call(this.mainChart.xAxis);

	// grid
	this.mainChart.gridAxis = d3.svg.axis()
		.scale(this.mainChart.xScale)
		.ticks(100)
		.tickFormat('')
    .orient("bottom")
		.tickSize(-1*this.gridHeight, 0);
	this.mainChart.gridGroup = this.mainChart.svg.append('g')
		.classed('grid', true)
		.call(this.mainChart.gridAxis);

	// the items
	this.mainChart.svg.itemsGroup = this.mainChart.svg.append('g').classed('items', true);

	// these rows store the items in each row of the timeline, sorted. Used to
	// pack events in the _drawItems method.
	this.rows = [];
	this.nextRow = 0;

	// the brush control
	this.miniChart = {};
	this.miniChart.svg = d3.select(this.container).append('svg')
		.classed('mini-chart', true)
		.attr({
			width: '100%',
			height: _this.miniChartHeight
		});
	this.miniChart.svg.itemsGroup = this.miniChart.svg.append('g').classed('items', true);

	this.miniChart.xScale = d3.time.scale()
		.domain([timeMin, timeMax])
		.range([this.padding, this.container.clientWidth]);
	this.miniChart.xAxis = d3.svg.axis()
		.scale(this.miniChart.xScale)
		.ticks(5)
    .orient("bottom")
		.tickSize(0,0)
		.tickFormat(function (d) { return d.getUTCFullYear(); }) // avoid things like -0800
	  .tickPadding(0);
	this.miniChart.xAxisGroup = this.miniChart.svg.append('g')
		.classed('x axis', true)
		.call(this.miniChart.xAxis)
		.attr({
			'transform': sprintf('translate(0, %%)', this.miniChartHeight / 2)
		});
	this.miniChart.viewfieldRect = this.miniChart.svg.append('rect')
		.classed('viewfield', true)
		.attr({
			width: (this.chartContainerRect.width / this.chartContainer.scrollWidth) * this.chartContainerRect.width,
			height: (this.chartContainerRect.height / this.chartContainer.scrollHeight) * this.miniChartHeight
		});

	// events
	d3.select(this.chartContainer).on('scroll', function() {
		_this.miniChart.viewfieldRect.attr({
			transform: sprintf('translate(%%, %%)',
				(this.scrollLeft / this.scrollWidth) * _this.chartContainerRect.width,
				(this.scrollTop / this.scrollHeight) * _this.miniChartHeight)
		});
	});

	d3.select(window).on('resize', Timeline.prototype.resizeHandler.bind(this));

	this._setupViewfieldRectDrag();

	this._drawItems();
};

/**
 * @private
 * returns the start timestamp if its defined
 * @param {object} d
 * @returns {timestamp}
 */
Timeline.prototype.getStartTime = function(d) {
	if (this.customGetStartTime) {
		return this.customGetStartTime(d).getTime();
	} else {
		return d.start.getTime();
	}
};

/**
 * @private
 * returns the end timestamp, or, if its undefined, present timestamp
 * @param {object} d
 * @returns {timestamp}
 */
Timeline.prototype.getEndTime = function(d) {
	var end;
	if (this.customGetEndTime) {
		end = this.customGetEndTime(d);
	} else {
		end = d.end;
	}

	return !end && end !== 0 ? (new Date()).getTime() : end.getTime();
};

/**
 * Define how to get the startime from a datum
 * @param {Function} given a datum, should return a Date
 * @return {Timeline} this
 */
Timeline.prototype.startTime = function(fn) {
	this.customGetStartTime = fn;
	return this;
}

/**
 * Define how to get the endtime from a datum
 * @param {Function} given a datum, should return a timestamp
 * @return {Timeline} this
 */
Timeline.prototype.endTime = function(fn) {
	this.customGetEndTime = fn;
	return this;
}

/**
 * Sets up viewfieldRect dragging logic
 * @private
 */
Timeline.prototype._setupViewfieldRectDrag = function() {
	var _this = this;

	var startViewfieldRectDrag = function() {
		viewfieldRectDragMain();

		_this.miniChart.svg.on('mousemove', viewfieldRectDragMain);
		_this.miniChart.svg.on('touchmove', viewfieldRectDragMain);

		_this.miniChart.svg.on('mouseup', endViewfieldRectDrag);
		_this.miniChart.svg.on('mouseleave', endViewfieldRectDrag);
		_this.miniChart.svg.on('touchend', endViewfieldRectDrag);
	};
	var endViewfieldRectDrag = function() {
		_this.miniChart.svg.on('mousemove', null);
		_this.miniChart.svg.on('touchmove', null);
	};
	var viewfieldRectDragMain = function() {
		var mousePos = d3.mouse(_this.miniChart.svg.node());

		var boxPos = {
			x: Math.max(mousePos[0] - 0.5 * _this.miniChart.viewfieldRect.attr('width'), 0),
			y: Math.max(mousePos[1] - 0.5 * _this.miniChart.viewfieldRect.attr('height'), 0),
		};

		boxPos.x = Math.min(boxPos.x, _this.chartContainerRect.width - _this.miniChart.viewfieldRect.attr('width'));
		boxPos.y = Math.min(boxPos.y, _this.miniChartHeight - _this.miniChart.viewfieldRect.attr('height'));

		// move box
		_this.miniChart.viewfieldRect.attr({
			transform: sprintf('translate(%%, %%)', boxPos.x, boxPos.y)
		});
		// move view in mainChart
		_this.chartContainer.scrollTop = (boxPos.y / _this.miniChartHeight) * _this.chartContainer.scrollHeight;
		_this.chartContainer.scrollLeft = (boxPos.x / _this.chartContainerRect.width) * _this.chartContainer.scrollWidth;
	};

	this.miniChart.svg.on('mousedown', startViewfieldRectDrag);
	this.miniChart.svg.on('touchstart', startViewfieldRectDrag);
};

/**
 * Call on resize / on scrollWidth/Height changes to keep variables accurate
 */
Timeline.prototype.resizeHandler = function() {
	this.chartContainerRect = this.chartContainer.getBoundingClientRect();
	this.miniChart.viewfieldRect
		.attr({
			width: (this.chartContainerRect.width / this.chartContainer.scrollWidth) * this.chartContainerRect.width,
			height: (this.chartContainerRect.height / this.chartContainer.scrollHeight) * this.miniChartHeight
		});

	// resize miniChart
	var oldRange = this.miniChart.xScale.range();
	var widthChangeRatio = this.chartContainerRect.width / oldRange[1];  //FIXME: padding :/
	this.miniChart.items.attr({
		transform: this.miniChart.items.attr('transform').replace(/scale\(([-+]?((\d*\.\d+)|\d+))/, function(match, $1) {
			return 'scale(' + (parseFloat($1) * widthChangeRatio);
		})
	});

	this.miniChart.xScale
		.range([this.padding, this.chartContainerRect.width]);
	this.miniChart.xAxisGroup.call(this.miniChart.xAxis);
}

/**Draws the individual items
 * @private
 */
Timeline.prototype._drawItems = function(items) {
  var _this = this;

	// Group
  var groups = this.mainChart.svg.itemsGroup.selectAll('g')
    .data(this.items)
    .enter()
    .append('g')
    .attr({
			class: 'item'
		});

	// Rect
  groups.append('rect')
    .attr({
      x:      function(d) {return (_this.mainChart.xScale(_this.getEndTime(d)) - _this.mainChart.xScale(_this.getStartTime(d)))/2 },
      y:      1,
      width:  0,
      height: _this.itemHeight -2,
    })
    // .transition().duration(80)
    // .delay(function(d, i) { return 60*Math.log(i); })
    .attr({
      x: 0,
      width: function(d) {return _this.mainChart.xScale(_this.getEndTime(d)) - _this.mainChart.xScale(_this.getStartTime(d))}
    });

	// Item text
	groups.append('text')
		.attr({
			x: function(d) {return (_this.mainChart.xScale(_this.getEndTime(d)) - _this.mainChart.xScale(_this.getStartTime(d)))/2 },
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

	// position the items
	groups.attr({
		transform: function(d, i) {
			var defaultY = _this.gridStartPoint.y - (_this.nextRow+1) * _this.itemHeight;
			var finalY = defaultY;
			var bbox = this.getBBox();
			var xRange = {
				start: _this.mainChart.xScale(_this.getStartTime(d)) + bbox.x,
				end: _this.mainChart.xScale(_this.getStartTime(d)) + bbox.x + bbox.width,
				item: d
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

			return sprintf('translate(%%, %%)', _this.mainChart.xScale(_this.getStartTime(d)), finalY);
		}
  });

	// mirror mini chart
	if (this.miniChart.items) {
		this.miniChart.items.remove();
	}
	this.miniChart.items = this.miniChart.svg.insert('path', ':first-child');
	var miniItemsD = "";

	var minItemHeight = 6;
	var condensedRows = Math.floor(this.miniChartHeight / minItemHeight);
	if (this.rows.length > condensedRows) {
		var rowsToMerge = this.rows.length / condensedRows;
		// don't want too many rows in the mini chart, so we'll merge them
		var miniItemHeight = miniItemHeight;
		for(var r = 0; r < this.rows.length; r += rowsToMerge) {
			var mergedRow = [];
			for(var r2 = Math.floor(r); r2 < Math.floor(r + rowsToMerge) && r2 < this.rows.length; r2++) {
				for(var i = 0; i < this.rows[r2].length ; ++i) {
					var d = this.rows[r2][i].item;
					var toAdd = {
						start: _this.getStartTime(d),
						end: _this.getEndTime(d)
					};
					if (r2 == Math.floor(r)) {
						// first row to be merge; just place a copy in the mergedRow
						mergedRow.push(toAdd);
					} else {
						// merge with the stuff in merged rows.
						var inserted = false;
						for(var j = 0; j < mergedRow.length; ++j) {
							if (toAdd.end < mergedRow[j].start) {
								// insert before current item
								mergedRow = mergedRow.splice(j, 0, toAdd);
								inserted = true;
								break;
							}
							else if (toAdd.start <= mergedRow[j].end && toAdd.end >= mergedRow[j].start) {
								// should be merged with the current item
								mergedRow[j] = {
									start: Math.min(mergedRow[j].start, toAdd.start),
									end: Math.max(mergedRow[j].end, toAdd.end)
								};
								inserted = true;
								break;
							}
						}
						if (!inserted) {
							mergedRow.push(toAdd);
						}
					}
				}
			}

			// the merged row has been created!
			for(var i = 0; i < mergedRow.length; ++i) {
				var miniYPos = Math.floor(r/rowsToMerge) * minItemHeight + minItemHeight / 2;
				miniItemsD += sprintf(' M %%,%% H %%', this.miniChart.xScale(mergedRow[i].start), -miniYPos,
																		           this.miniChart.xScale(mergedRow[i].end));
			}
		}
		this.miniChart.items.attr({
			'stroke-width':   4.5,
			transform:        sprintf('translate(0, %%) scale(1,1)', condensedRows * minItemHeight)
		});
	} else {
		var miniItemHeight = this.miniChartHeight / this.rows.length;
		for(var r = 0; r < this.rows.length; ++r) {
			for(var i = 0; i < this.rows[r].length; ++i) {
				var d = this.rows[r][i].item;
				var miniYPos = r * miniItemHeight + miniItemHeight / 2;
				miniItemsD += sprintf(' M %%,%% H %%', this.miniChart.xScale(_this.getStartTime(d)), -miniYPos,
																		           this.miniChart.xScale(_this.getEndTime(d)));
			}
		}
		this.miniChart.items.attr({
			'stroke-width':   miniItemHeight / 2,
			transform: sprintf('translate(0, %%) scale(1,1)', this.rows.length * miniItemHeight)
		});
	}

	this.miniChart.items.attr({
		d:                miniItemsD,
		class:            'items-path',
		'stroke-linecap': 'square'
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

			$(anchor.node()).append($(this).children()); // FIXME: no jQuery dependancy
		}
	});

	// the height has probably changed because of stacking; should shrink doc
	var bbox = this.mainChart.svg.itemsGroup.node().getBBox();
	var axisTicks = Math.floor(bbox.width / 100);
	console.log(axisTicks);
	this.gridHeight = bbox.height;
	this.mainChart.gridAxis.innerTickSize(-1*this.gridHeight); // FIXME: put me in better place T_T
	this._updateSVGSize();
	this.mainChart.gridAxis.ticks(axisTicks);
	this.mainChart.xAxis.ticks(axisTicks);
	this.mainChart.gridGroup.call(this.mainChart.gridAxis);
	this.mainChart.xAxisGroup.call(this.mainChart.xAxis);

	this.resizeHandler();
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

	var currentDomain = this.mainChart.xScale.domain();
	var newItemsDomain = [
		d3.min(itemsArr, this.getStartTime.bind(this)),
		d3.max(itemsArr, this.getEndTime.bind(this))
	];

	var mustChangeDomain = (newItemsDomain[0] < currentDomain[0])
		|| (newItemsDomain[1] > currentDomain[1]);

	if (mustChangeDomain) {
		var newDomain = [
			Math.min(newItemsDomain[0], currentDomain[0]),
			Math.max(newItemsDomain[1], currentDomain[1])
		];
		var xTmp = this.mainChart.xScale(0);
		this.mainChart.xScale.domain(newDomain);
		this.miniChart.xScale.domain(newDomain);
	}

	this.items = this.items.concat(itemsArr);

  // update xScale Range
  this.gridWidth = msToYears(this.mainChart.xScale.domain()[1] - this.mainChart.xScale.domain()[0]) * this.widthOfYear;
  this.mainChart.xScale.range([this.padding, this.padding + this.gridWidth]);

  // update axes
	this.mainChart.xAxisGroup.call(this.mainChart.xAxis);
  this.mainChart.gridGroup.call(this.mainChart.gridAxis);
  this.miniChart.xAxisGroup.call(this.miniChart.xAxis);

	if (mustChangeDomain) {
		var xChange = this.mainChart.xScale(0) - xTmp;
		// move all the existing items over
		this.mainChart.svg.itemsGroup.selectAll('g.item')
		.each(function(d, i) {
			var currentTransform = this.getAttribute('transform');
			var translation = currentTransform.match(/[-+]?((\d*\.\d+)|\d+)/g);

			this.setAttribute('transform', sprintf('translate(%%, %%)', _this.mainChart.xScale(_this.getStarTime(d)), translation[1]));
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
  this.mainChart.svg.attr({
    width: this.canvasWidth,
    height: this.canvasHeight,
    viewBox: sprintf("0 %% %% %%", -1*this.gridHeight, this.canvasWidth, this.canvasHeight)
  });
};
