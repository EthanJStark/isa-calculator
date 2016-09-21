var randomScalingFactor = function() {
  return Math.round(Math.random() * 100 * (Math.random() > 0.5 ? -1 : 1));
};
var randomColorFactor = function() {
  return Math.round(Math.random() * 255);
};
var randomColor = function(opacity) {
  return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '1') + ')';
};

var calculator = {
}

var config = {
  type: 'line',
  data: {
      // labels is the x-axis data-point labels
    //labels: ["January", "February", "March", "April", "May", "June", "July"],
    labels: ["$50k", "$60k", "$70k", "$80k", "$90k", "$100k", "$110k"],
    datasets: [{
      label: "Sample 1",
      data: [1,5,15,40,100,250],
    }, {
      label: "Sample 2",
      data: [1,5,15,40,100,250]
      }
    ]
  },
  options: {
    responsive: true,
    title:{
      display:true,
      // MAIN HEAD TITLE
      text:"Chart.js Line Chart - Stacked Area"
    },
    tooltips: {
      mode: 'label',
    },
    hover: {
      mode: 'label'
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Income'
        }
      }],
      yAxes: [{
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'Gross'
        }
      }]
    }
  }
};

$.each(config.data.datasets, function(i, dataset) {
  var color = randomColor(1);
  dataset.borderColor = color;
  dataset.backgroundColor = color;
  dataset.pointBorderColor = color;
  dataset.pointBackgroundColor = color;
  dataset.pointBorderWidth = 1;
});

window.onload = function() {
  var ctx = document.getElementById("canvas").getContext("2d");
  // IMPORTANT - this is where the chart is instantiated.
  window.myLine = new Chart(ctx, config);
};

/*  RANDOMIZE
$('#randomizeData').click(function() {
  $.each(config.data.datasets, function(i, dataset) {
    dataset.data = dataset.data.map(function() {
      return randomScalingFactor();
    });

  });

  window.myLine.update();
});
*/

$('#addDataset').click(function() {
  var newDataset = {
    label: 'Dataset ' + config.data.datasets.length,
    borderColor: randomColor(0.4),
    backgroundColor: randomColor(0.5),
    pointBorderColor: randomColor(0.7),
    pointBackgroundColor: randomColor(0.5),
    pointBorderWidth: 1,
    data: [],
  };

  for (var index = 0; index < config.data.labels.length; ++index) {
    newDataset.data.push(randomScalingFactor());
  }

  // Because config.data.dataset uses datasets that use randomize function
  // this pushes one of those randomized ones, thus, randomizing again
  // We need to pull from our own personal array if we want to push a new dataset.
  config.data.datasets.push(newDataset);
  window.myLine.update();
});

$('#addData').click(function() {
  if (config.data.datasets.length > 0) {
    var month = MONTHS[config.data.labels.length % MONTHS.length];
    config.data.labels.push(month);

    $.each(config.data.datasets, function(i, dataset) {
      dataset.data.push(randomScalingFactor());
    });

    window.myLine.update();
  }
});

$('#removeDataset').click(function() {
  config.data.datasets.splice(0, 1);
  window.myLine.update();
});

$('#removeData').click(function() {
  config.data.labels.splice(-1, 1); // remove the label first

  config.data.datasets.forEach(function(dataset, datasetIndex) {
    dataset.data.pop();
  });

  window.myLine.update();
});
