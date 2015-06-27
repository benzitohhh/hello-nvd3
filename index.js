var N         = 5;
var sliderX   = $('#sliderX');
var sliderY   = $('#sliderY');
var labelX    = $('#labelX');
var labelY    = $('#labelY');
var container = d3.select('#chart svg');

function getData(state) {
  return [
    {
      key: "series a",
      values: d3.range(N).map(function(d, i) { return [i, 3 * i * state.x + 2]; })
    },
    {
      key: "series b",
      values: d3.range(N).map(function(d, i) { return [i, i * i * state.y]; })
    }
  ];
}

function getState() {
  var x = parseFloat(sliderX.val());
  var y = parseFloat(sliderY.val());
  return { x: x, y: y };
}

function getChart() {
  var chart = nv.models.stackedAreaChart()
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1]; })
        .useInteractiveGuideline(true)
        .showControls(false)
        .transitionDuration(0)
        .yDomain([0, 100])  // fix the y-axis range
  ;
  chart.yAxis
    .tickFormat(d3.format('d'))
    .showMaxMin(false)
  ;
  chart.xAxis
    .tickFormat(d3.format('d'))
    .showMaxMin(false)
  ;
  return chart;
}

var data = getData(getState());
var chart = getChart();

// Add the chart
nv.addGraph(function() {
  container
    .datum(data)
    .call(chart);
  nv.utils.windowResize(chart.update);
  return chart;
});

// Slider handler
$('.slider').on('input', function() {
  var state = getState();
  var data  = getData(state);

  container.datum(data); // update chart
  chart.update();

  labelX.text(state.x); // update slider labels
  labelY.text(state.y);  
});





































