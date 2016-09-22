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
  userConfig: {
    toggles: {
      Stipend: {
        name: "Living Stipend ISA",
        theBool: false,
        value: (1 - 0.925),
        max: 27692,
      }, // should be 7.5%
      Tuition: {
        name: "Program ISA",
        theBool: false,
        value: (1 - 0.875),
        max: 59500,
      }, // should be 12.5%
      Laptop: {
        name: "Laptop purchase ISA",
        theBool: false,
        value: (1 - 0.99),
        max: 9000,
      }, // should be 1%
    },
    xAxis: [40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000],
  },
  calculate: function() {
    config.data.datasets = [];

    var newDataset = {};
    for (var iterator in this.userConfig.toggles) {
      if (this.userConfig.toggles[iterator].theBool === true) {
        var newData = [];
        for (var xVal = 0; xVal < this.userConfig.xAxis.length; xVal++) {
          //var thisIterator = this.userConfig.toggles[iterator];
          //var nameMeVar = (thisIterator.value > thisIterator.max ? thisIterator.value : thisIterator.max );
          newData.push(Math.ceil(this.userConfig.xAxis[xVal] * this.userConfig.toggles[iterator].value * 1000) / 1000 * 3)
            //newData.push(Math.ceil(this.userConfig.xAxis[xVal] * nameMeVar * 1000) / 1000 * 3)
        }
        newDataset = {
          label: iterator,
          borderColor: randomColor(0.4),
          backgroundColor: randomColor(0.5),
          pointBorderColor: randomColor(0.7),
          pointBackgroundColor: randomColor(0.5),
          pointBorderWidth: 1,
          data: newData,
          fill: false,
          //this.takeHomeArray(this.userConfig.xAxis),
        }
        config.data.datasets.push(newDataset);
      }
    }
    var bankLoanDataSet = [];
    for (var i = 0; i < calculator.userConfig.xAxis.length; i++) {
      bankLoanDataSet.push(50000);
    }

    config.data.datasets.push({
      label: "Bank Loan",
      data: bankLoanDataSet
    });
    // Baseline (never ceases to exist)
    config.data.datasets.push({
      label: "Take-home Pay",
      data: calculator.takeHomeArray(calculator.userConfig.xAxis)
    });




    window.myLine.update();
  },
  takeHomePercentage: function() {
    var runningTotalPercent = 0;
    for (var iterator in this.userConfig.toggles) {
      if (this.userConfig.toggles[iterator].theBool === true) {
        // Turn it into a whole number with 1 extra digit of precision (e.g. 7.5%), round it, then turn it back into a percentage.
        runningTotalPercent = Math.ceil((runningTotalPercent + this.userConfig.toggles[iterator].value) * 1000) / 1000;
      }
    }
    return 1 - runningTotalPercent;
  },
  takeHome: function(salary) {
    return salary * this.takeHomePercentage(this.userConfig.toggles) * 3
  },
  tuition: function(salary) {
    var runningTotalPercent = 0;
    for (var iterator in this.userConfig.toggles) {
      if (this.userConfig.toggles[iterator].theBool === true) {
        // Turn it into a whole number with 1 extra digit of precision (e.g. 7.5%), round it, then turn it back into a percentage.
        runningTotalPercent = Math.ceil((runningTotalPercent + this.userConfig.toggles[iterator].value) * 1000) / 1000;
      }
    }
    return salary * runningTotalPercent;
  },
  takeHomeArray: function(arr) {
    var takeHomeArr = []
    var temp
    for (var i = 0; i < arr.length; i++) {
      temp = this.takeHome(arr[i])
      takeHomeArr.push(temp)
    }
    return takeHomeArr
  },
  tuitionArray: function(arr) {
    var tuitionArr = []
    var temp
    for (var i = 0; i < arr.length; i++) {
      temp = this.tuition(arr[i])
      tuitionArr.push(temp)
    }
    return tuitionArr
  }
};

(function() {
  $('body').append($("<div class='DynamicInput'></div>"));

  var i = 0;
  for (var toggle in calculator.userConfig.toggles) {
    $(".DynamicInput").append($("<input type='checkbox' id='box" + i + "'></input>"));
    $newParagraph = $("#box" + i).before($("<p>").text(calculator.userConfig.toggles[toggle].name));
    i++;
  }

})();


$("#box0").change(function() {
  if (document.getElementById('box0').checked) {
    calculator.userConfig.toggles.Stipend.theBool = true;
  } else {
    calculator.userConfig.toggles.Stipend.theBool = false;
  }
  calculator.calculate();
});

$("#box1").change(function() {
  if (document.getElementById('box1').checked) {
    calculator.userConfig.toggles.Tuition.theBool = true;
  } else {
    calculator.userConfig.toggles.Tuition.theBool = false;
  }
  calculator.calculate();
});

$("#box2").change(function() {
  if (document.getElementById('box2').checked) {
    calculator.userConfig.toggles.Laptop.theBool = true;
  } else {
    calculator.userConfig.toggles.Laptop.theBool = false;
  }
  calculator.calculate();
});

Chart.controllers.lineWithOverlay = Chart.controllers.line.extend({
  name: 'lineWithOverlay',
  draw: function(ease) {
    Chart.controllers.line.prototype.draw.apply(this, arguments);

    var width = this.chart.chart.width;
    var height = this.chart.chart.height;

    var ctx = this.chart.chart.ctx
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 0, 0, 1.0)';
    ctx.moveTo(width / 2, height / 2);
    ctx.lineTo((width / 2) + 10, (height / 2) + 10);
    ctx.stroke();
  }
});

var config = {
  type: 'lineWithOverlay',
  data: {
    // labels is the x-axis data-point labels
    //labels: ["January", "February", "March", "April", "May", "June", "July"],
    labels: [40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000],
    datasets: [{
      label: "Take-home Pay",
      data: calculator.takeHomeArray(calculator.userConfig.xAxis),
      fill: false,
    }, {
      label: "Tuition",
      data: calculator.tuitionArray(calculator.userConfig.xAxis),
      fill: false,
    }],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      // MAIN HEAD TITLE
      text: "Chart.js Line Chart - Stacked Area"
    },
    tooltips: {
      mode: 'label',
      ticks: {
        callback: function(label, index, labels) {
          return label / 1000 + 'k';
        },
      },
    },
    hover: {
      mode: 'label',
      ticks: {
        callback: function(label, index, labels) {
          return label / 1000 + 'k';
        },
      },
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Annual Income',
          ticks: {
            callback: function(label, index, labels) {
              return label / 1000 + 'k';
            },
          },
        },
      }],
      yAxes: [{
        ticks: {
          callback: function(label, index, labels) {
            return label / 1000 + 'k';
          }
        },
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'Amount Paid (3 YR)',
          function(valuePayload) {
            return Number(valuePayload.value).toFixed(2).replace('.', ',') + '$';
          },
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


$('#randomizeData').click(function() {
  calculator.calculate();
});
/*$.each(config.data.datasets, function(i, dataset) {
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

  for (var index = 0; index < config.data.labels.length; index++) {
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
