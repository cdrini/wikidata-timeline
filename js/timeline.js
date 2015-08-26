function setParam(principal, secondary, key, defaultValue) {
	if(typeof(secondary[key]) == 'undefined') {
		principal[key] = defaultValue;
	} else {
		principal[key] = secondary[key];
	}
}

function msToYears(ms) {
  return ms / 3.15569e10;
}

function sprintf() {
  var str = arguments[0];
  var args = arguments;
  var i = 1;
  return str.replace(/%%/g, function() { return args[i++];});
}

var sampleItem = {
  name: 'Leave it to Beaver',
  start: '+1957-10-04T00:00:00Z', // actually, timestamp :)
  end: '+1963-06-20T00:00:00Z'
};

/**
 *
 */
function Timeline(items, opts) {
  this.items = items;
  opts = opts || {};

  setParam(this, opts, 'widthOfYear',                     20); //px
  setParam(this, opts, 'itemHeight',                      20); //px
  setParam(this, opts, 'itemSpacing',                      2); //px
  setParam(this, opts, 'startDate',                        0); // start of epoch
  setParam(this, opts, 'endDate',     (new Date()).getTime()); // present
  setParam(this, opts, 'padding',                          5);
  setParam(this, opts, 'axisLabelSize',                   20); //px
  setParam(this, opts, 'itemColor',                 '#ffdd55');
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

Timeline.prototype.draw = function(HTMLContainer) {
  this.container = HTMLContainer;
  if (!this.svg) {
    this.init();

  }

  this._drawGrid();
  this._drawItems();
};

/**
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
      x:      0,
      y:      0,
      width:  function(d)    {return _this.xScale(!d.end && d.end !== 0 ? (new Date()).getTime() : d.end) - _this.xScale(d.start)},
      height: _this.itemHeight,
    });
  groups.append('text')
    .attr({
      x: function(d)    {return (_this.xScale(!d.end && d.end !== 0 ? (new Date()).getTime() : d.end) - _this.xScale(d.start))/2 },
      y: _this.itemHeight / 2
    })
    .style({
      fill: '#000',
      'text-anchor': 'middle',
      'alignment-baseline': 'central'
    })
    .text(function(d) { return d.name; });
};
