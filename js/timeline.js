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
 * @param {Array<Object>} items items to plot on timeline. Objects must have name, start, and end defined.
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

	                     // param name                   // default value
	setParam(this, opts, 'widthOfYear',                     20); //px
	setParam(this, opts, 'itemHeight',                      20); //px
	setParam(this, opts, 'itemSpacing',                      2); //px
	setParam(this, opts, 'startDate',                        0);
	setParam(this, opts, 'endDate',     (new Date()).getTime()); //present
	setParam(this, opts, 'padding',                         10); //px
	setParam(this, opts, 'axisLabelSize',                   20); //px
	setParam(this, opts, 'miniChartHeight',                 80); //px

	return this;
}

/*************************
 ****** Public Methods
 *************************/

 /**
  * Tells if the timeline has been drawn yet.
  * @return {Boolean}
  */
Timeline.prototype.isDrawn = function() {
	return !!this.mainChart;
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
		d3.min(itemsArr, this.itemStart.bind(this)),
		d3.max(itemsArr, this.itemEnd.bind(this))
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
	this.mainChart.grid.width = msToYears(this.mainChart.xScale.domain()[1] - this.mainChart.xScale.domain()[0]) * this.widthOfYear;
	this.mainChart.xScale.range([0, this.mainChart.grid.width]);

	// update axes
	this.mainChart.xAxisGroup.call(this.mainChart.xAxis);
	this.mainChart.grid.axis.group.call(this.mainChart.grid.axis);
	this.miniChart.xAxisGroup.call(this.miniChart.xAxis);

	if (mustChangeDomain) {
		var xChange = this.mainChart.xScale(0) - xTmp;
		// move all the existing items over
		this.mainChart.svg.itemsGroup.selectAll('g.item')
		.each(function(d, i) {
			var transform = d3.transform(this.getAttribute('transform'));
			transform.translate = [_this.mainChart.xScale(_this.itemStart(d)), transform.translate[1]];
			this.setAttribute('transform', transform.toString());
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

/*************************
 ****** Timeline Items
 *************************/

Timeline.ItemTypes = {
	Invalid: -1,
	Range:    1,
	Point:    2
};

Timeline.prototype.itemType = function(d) {
	if (this.getStartTime(d) !== this.getEndTime(d)) {
		return Timeline.ItemTypes.Range;
	}
	else {
		return Timeline.ItemTypes.Point;
	}
};

Timeline.prototype.itemStart = function(d) {
	return this.getStartTime(d);
};

Timeline.prototype.itemEnd = function(d) {
	return this.getEndTime(d);
};

/**
 * @private
 * returns the start timestamp if its defined
 * @param {object} d
 * @returns {timestamp}
 */
Timeline.prototype.getStartTime = function(d) {
	var start;
	if (this.customGetStartTime) {
		start = this.customGetStartTime(d);
	} else {
		start = d.start;
	}

	if (!start && start !== 0) {
		throw "ERR: Unable to find starttime";
	}

	return start.getTime();
};

/**
 * @private
 * returns the end timestamp
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

	if (!end && end !== 0) {
		throw "ERR: Unable to find endtime";
	}
	return end.getTime();
};

/**
 * @private
 * returns the name
 * @param {object} d
 * @returns {string}
 */
Timeline.prototype.getName = function(d) {
	if (this.customGetName) return this.customGetName(d);
	else return d.name;
};

/**
 * @private
 * returns the url
 * @param {object} d
 * @returns {string}
 */
Timeline.prototype.getUrl = function(d) {
	if (this.customGetUrl) return this.customGetUrl(d);
	else return d.url || d.href;
};
/*************************
 ****** Drawing Methods
 *************************/

/** Creates the timeline and appends it to HTMLContainer
* @param{HTMLElement} HTMLContainer
*/
Timeline.prototype.draw = function(HTMLContainer) {
	var _this = this;

	this.container = HTMLContainer;
	this.container.style.paddingBottom = this.miniChartHeight + 'px';

	// scale setup
	var timeMin = d3.min(this.items, this.itemStart.bind(this) );
	var timeMax = d3.max(this.items, this.itemEnd.bind(this) );

	// {svg, xScale, xAxis, xAxisGroup, grid, itemsGroup, container}
	this.mainChart = {};

	// { axis, width, height }
	this.mainChart.grid = {};
	this.mainChart.grid.width = msToYears(timeMax - timeMin) * this.widthOfYear;
	this.mainChart.grid.height = 0;

	// chart container
	this.mainChart.container = d3.select(this.container).append('div')
		.attr('class', 'main-chart-container');
	this.mainChart.container.rect = this.mainChart.container.node().getBoundingClientRect();

	// the svg
	this.mainChart.svg = this.mainChart.container.append('svg')
		.attr("version", 1.1)
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.classed('main-chart', true);

	this.mainChart.xScale = d3.time.scale()
		.domain([timeMin, timeMax])
		.range([0, this.mainChart.grid.width]);

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
	this.mainChart.grid.axis = d3.svg.axis()
		.scale(this.mainChart.xScale)
		.ticks(100)
		.tickFormat('')
		.orient("bottom")
		.tickSize(-1*this.mainChart.grid.height, 0);
	this.mainChart.grid.axis.group = this.mainChart.svg.append('g')
		.attr('class', 'grid')
		.call(this.mainChart.grid.axis);

	// the items
	this.mainChart.svg.itemsGroup = this.mainChart.svg.append('g').classed('items', true);

	// these rows store the items in each row of the timeline, sorted. Used to
	// pack events in the _drawItems method.
	this.rows = [];
	this.nextRow = 0;

	// miniChart (to control main chart viewfield)
	this.miniChart = {};
	this.miniChart.svg = d3.select(this.container).append('svg')
		.classed('mini-chart', true)
		.attr({
			width: '100%',
			height: _this.miniChartHeight
		});

	this.miniChart.xScale = d3.time.scale()
		.domain([timeMin, timeMax])
		.range([0, this.container.clientWidth]);
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
			width: (this.mainChart.container.rect.width / this.mainChart.container.node().scrollWidth) * this.mainChart.container.rect.width,
			height: (this.mainChart.container.rect.height / this.mainChart.container.node().scrollHeight) * this.miniChartHeight
		});

	// events
	this.mainChart.container.on('scroll', function() {
		_this.miniChart.viewfieldRect.attr({
			transform: sprintf('translate(%%, %%)',
				(this.scrollLeft / this.scrollWidth) * _this.mainChart.container.rect.width,
				(this.scrollTop / this.scrollHeight) * _this.miniChartHeight)
		});
	});

	d3.select(window).on('resize', Timeline.prototype._resizeHandler.bind(this));

	this._setupViewfieldRectDrag();

	this._drawItems();
};

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

	groups.each(function(d, i) {
		var type = _this.itemType(d);
		switch(type) {
			case Timeline.ItemTypes.Range: _this._drawRangeItem(d3.select(this), d, i); break;
			case Timeline.ItemTypes.Point: _this._drawPointItem(d3.select(this), d, i); break;
		};
	});

	// position the items
	groups.attr('transform',  function(d, i) {
		var defaultY = - (_this.nextRow+1) * _this.itemHeight;
		var finalY = defaultY;
		var bbox = this.getBBox();

		var itemStart = _this.mainChart.xScale(_this.itemStart(d));
		var xRange = {
			start: itemStart + bbox.x,
			end:   itemStart + bbox.x + bbox.width,
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
				finalY = - (rowWithRoom+1) * _this.itemHeight;

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

		return sprintf('translate(%%, %%)', itemStart, finalY);
	});

	this._updateMiniChart();

	// Add anchors (where appropriate)
	groups.each(function(d) {
		if (_this.getUrl(d)) {
			var group = d3.select(this);
			// move all the groups children into the anchor
			var anchor = group.append('a')
			.attr({
				'class': 'main-link',
				'xlink:href': function(d) { return _this.getUrl(d); },
				'xlink:show': 'new'
			});

			var a = anchor.node();
			while(this.firstChild != this.lastChild) {
				a.appendChild(this.firstChild);
			}
		}
	});

	// the height has probably changed because of stacking; should shrink doc
	var bbox = this.mainChart.svg.itemsGroup.node().getBBox();
	var axisTicks = Math.floor(bbox.width / 100);
	this.mainChart.grid.height = bbox.height;
	this.mainChart.grid.axis.innerTickSize(-1*this.mainChart.grid.height); // FIXME: put me in better place T_T
	this._updateSVGSize();
	this.mainChart.grid.axis.ticks(axisTicks);
	this.mainChart.xAxis.ticks(axisTicks);
	this.mainChart.grid.axis.group.call(this.mainChart.grid.axis);
	this.mainChart.xAxisGroup.call(this.mainChart.xAxis);

	this._resizeHandler();
};

Timeline.prototype._updateMiniChart = function() {
	var _this = this;
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
						start: this.getStartTime(d),
						end: this.getEndTime(d)
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
	}
	else {
		var miniItemHeight = this.miniChartHeight / this.rows.length;
		for(var r = 0; r < this.rows.length; ++r) {
			for(var i = 0; i < this.rows[r].length; ++i) {
				var d = this.rows[r][i].item;

				var bounds = {
					start: this.getStartTime(d),
					end: this.getEndTime(d)
				};

				var miniYPos = r * miniItemHeight + miniItemHeight / 2;
				miniItemsD += sprintf(' M %%,%% H %%', this.miniChart.xScale(bounds.start), -miniYPos,
																							 this.miniChart.xScale(bounds.end));
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
};

/**
 * @param {d3.selection} group
 * @param {object} d datum
 * @param {integer} i index
 */
Timeline.prototype._drawRangeItem = function(group, d, i) {
	var _this = this;

	// Rect
	group.append('rect')
		.attr({
			x:      0,
			y:      1,
			width:  _this.mainChart.xScale(_this.getEndTime(d)) - _this.mainChart.xScale(_this.getStartTime(d)),
			height: _this.itemHeight -2,
		});

	// Item text
	group.append('text')
		.attr({
			x: (_this.mainChart.xScale(_this.getEndTime(d)) - _this.mainChart.xScale(_this.getStartTime(d)))/2,
			y: _this.itemHeight / 2
		})
		.append('tspan')
			.text(this.getName(d))
			.style({
				fill: '#000',
				'text-anchor': 'middle',
				'alignment-baseline': 'central'
			});

};

/**
 * @param {d3.selection} group
 * @param {object} d datum
 * @param {integer} i index
 */
Timeline.prototype._drawPointItem = function(group, d, i) {
	var _this = this;

	// Rect
	group.append('circle')
		.attr({
			cx:      0,
			cy:      _this.itemHeight / 2,
			r:       _this.itemHeight / 3 - 3
		});

	// Item text
	group.append('text')
		.attr({
			x: _this.itemHeight / 3, // mind the circle
			y: _this.itemHeight / 2
		})
		.append('tspan')
			.text(this.getName(d))
			.style({
				fill: '#000',
				'text-anchor': 'left',
				'alignment-baseline': 'central'
			});

};

Timeline.prototype._updateSVGSize = function() {
	var componentBBoxes = [
		this.mainChart.svg.itemsGroup.node().getBBox(),
		this.mainChart.xAxisGroup.node().getBBox()
	];

	var bounds = {
		left:   Infinity,
		right:  -Infinity,
		top:    Infinity,
		bottom: -Infinity
	};
	for(var i = 0; i < componentBBoxes.length; ++i) {
		var bbox = componentBBoxes[i];
		bounds.left   = Math.min(bounds.left, bbox.x);
		bounds.right  = Math.max(bounds.right, bbox.x + bbox.width);
		bounds.top    = Math.min(bounds.top, bbox.y);
		bounds.bottom = Math.max(bounds.bottom, bbox.y + bbox.height);
	}

	var width  = bounds.right - bounds.left + 2*this.padding;
	var height = bounds.bottom - bounds.top + 2*this.padding;

	this.mainChart.svg.attr({
		width: width,
		height: height,
		viewBox: sprintf("%% %% %% %%",
			bounds.left - this.padding,
			bounds.top - this.padding,
			width,
			height)
	});
};

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

		_this.miniChart.svg.on('mouseup',    endViewfieldRectDrag);
		_this.miniChart.svg.on('mouseleave', endViewfieldRectDrag);
		_this.miniChart.svg.on('touchend',   endViewfieldRectDrag);
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

		boxPos.x = Math.min(boxPos.x, _this.mainChart.container.rect.width - _this.miniChart.viewfieldRect.attr('width'));
		boxPos.y = Math.min(boxPos.y, _this.miniChartHeight - _this.miniChart.viewfieldRect.attr('height'));

		// move box
		_this.miniChart.viewfieldRect.attr({
			transform: sprintf('translate(%%, %%)', boxPos.x, boxPos.y)
		});
		// move view in mainChart
		_this.mainChart.container.node().scrollTop = (boxPos.y / _this.miniChartHeight) * _this.mainChart.container.node().scrollHeight;
		_this.mainChart.container.node().scrollLeft = (boxPos.x / _this.mainChart.container.rect.width) * _this.mainChart.container.node().scrollWidth;
	};

	this.miniChart.svg.on('mousedown', startViewfieldRectDrag);
	this.miniChart.svg.on('touchstart', startViewfieldRectDrag);
};

/**
 * Call on resize / on scrollWidth/Height changes to keep variables accurate
 */
Timeline.prototype._resizeHandler = function() {
	this.mainChart.container.rect = this.mainChart.container.node().getBoundingClientRect();
	this.miniChart.viewfieldRect
		.attr({
			width: (this.mainChart.container.rect.width / this.mainChart.container.node().scrollWidth) * this.mainChart.container.rect.width,
			height: (this.mainChart.container.rect.height / this.mainChart.container.node().scrollHeight) * this.miniChartHeight
		});

	// resize miniChart
	var oldRange = this.miniChart.xScale.range();
	var widthChangeRatio = this.mainChart.container.rect.width / oldRange[1];  //FIXME: padding :/

	var transform = d3.transform(this.miniChart.items.attr('transform'));
	transform.scale = [transform.scale[0] * widthChangeRatio, 1];
	this.miniChart.items.attr('transform', transform.toString());

	this.miniChart.xScale
		.range([0, this.mainChart.container.rect.width]);
	this.miniChart.xAxisGroup.call(this.miniChart.xAxis);
};

/*************************
 ****** Setup Methods
 *************************/

/**
 * Define how to get the startime from a datum
 * @param {Function} given a datum, should return a Date object
 * @return {Timeline} this
 */
Timeline.prototype.startTime = function(fn) {
	this.customGetStartTime = fn;
	return this;
};

/**
 * Define how to get the endtime from a datum
 * @param {Function} given a datum, should return a Date object
 * @return {Timeline} this
 */
Timeline.prototype.endTime = function(fn) {
	this.customGetEndTime = fn;
	return this;
};

/**
 * Define how to get the name from a datum
 * @param {Function} given a datum, should return a string
 * @return {Timeline} this
 */
Timeline.prototype.name = function(fn) {
	this.customGetName = fn;
	return this;
};

/**
 * Define how to get the url from a datum
 * @param {Function} given a datum, should return a URL string
 * @return {Timeline} this
 */
Timeline.prototype.url = function(fn) {
	this.customGetUrl = fn;
	return this;
};
