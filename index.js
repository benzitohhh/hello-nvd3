var N = 100,
    SLIDER_TEMPLATE = ' \
      <div class="slider-holder"> \
        <input class="slider" id="{{id}}" type="range" value="{{value}}" min="{{min}}" max="{{max}}" step="{{step}}" /> \
        <label>{{id}}: <span id="{{id}}_label">{{value}}</span></label> \
      </div> \
      ',
    container = d3.select('#chart svg'),
    controls = {
      mean1: { id: 'mean1', min: 0, max: 100, step: 1, value: 45 },
      sdev1: { id: 'sdev1', min: 1, max: 50,  step: 1, value: 20 },
      mean2: { id: 'mean2', min: 1, max: 100, step: 1, value: 33 },
      sdev2: { id: 'sdev2', min: 1, max: 50,  step: 1, value: 20 }
    }
;

function normal(x, mean, sd) {
  return Math.pow(Math.E, -Math.pow(x - mean, 2) / (2 * (sd * sd)));
}

function getData(controls) {
  return [
    {
      key: "series 1",
      values: d3.range(N).map(function(d, i) { return [i, normal(i, controls.mean1.value, controls.sdev1.value)]; })
    },
    {
      key: "series 2",
      values: d3.range(N).map(function(d, i) { return [i, normal(i, controls.mean2.value, controls.sdev2.value)]; })
    }
  ];
}

function getChart() {
  var chart = nv.models.stackedAreaChart()
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1]; })
        .useInteractiveGuideline(true)
        .showControls(false)
        .transitionDuration(0)
        .yDomain([0, 2])  // fix the y-axis range
  ;
  chart.yAxis
    .showMaxMin(false)
  ;
  chart.xAxis
    .tickFormat(d3.format('d'))
    .showMaxMin(false)
  ;
  return chart;
}

function renderSlider(slider) {
  var html = Mustache.render(SLIDER_TEMPLATE, slider);
  $('.controls').append($(html));
}

function renderControls(controls) {
  for (var key in controls) {
    renderSlider(controls[key]);    
  };
}

// =============================
// On page load
// =============================

// Render the chart
var data = getData(controls);
var chart = getChart();
nv.addGraph(function() {
  container
    .datum(data)
    .call(chart);
  nv.utils.windowResize(chart.update);
  return chart;
});

// Render the controls
renderControls(controls);

// Slider handler
$('.slider').on('input', function() {
  var el = $(this);
  var id = el.attr('id');
  var value = el.val();
  controls[id] = $.extend(controls[id], { value: value }); // update controls (model)
  $('#' + id + '_label').text(value); // update slider labels
  
  var data = getData(controls);
  container.datum(data); // rebind data
  chart.update(); // update chart
});
