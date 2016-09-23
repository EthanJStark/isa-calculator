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
  timePeriod: 3,
  userConfig: {
    toggles: {
      Stipend: {
        name: "Living Stipend ISA",
        theBool: false,
        value: Math.ceil( ( 1 - 0.925 ) * 1000 ) / 1000,
        max: 27692,
        min: 0,
        limitAt50k: true,
      }, // should be 7.5%
      Tuition: {
        name: "Program ISA",
        theBool: false,
        value: Math.ceil( ( 1 - 0.875 ) * 1000 ) / 1000,
        max: 59500,
        min: 0,
        limitAt50k: true,
      }, // should be 12.5%
      Laptop: {
        name: "Laptop purchase ISA",
        theBool: false,
        value: Math.floor( ( 1 - 0.99 ) * 1000 ) / 1000,
        max: 9000,
        min: 0,
        limitAt50k: true,
      }, // should be 1%
    },
    xAxis: [ 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000 ],
  },
  calculate: function () {
    config.data.datasets = [];

    // Baseline (never ceases to exist)
    config.data.datasets.push( {
      label: "Take-home Pay",
      data: calculator.takeHomeArray( calculator.userConfig.xAxis )
    } );

    // Dynamic datasets
    var newDataset = {};
    for ( var iterator in this.userConfig.toggles ) {
      if ( this.userConfig.toggles[ iterator ].theBool === true ) {
        var newData = [];
        for ( var xVal = 0; xVal < this.userConfig.xAxis.length; xVal++ ) {
          var thisIterator = this.userConfig.toggles[ iterator ];
          var loopVal = thisIterator.value * this.userConfig.xAxis[ xVal ] * this.timePeriod;
          var pushVal;
          if ( loopVal < thisIterator.max ) {
            if ( loopVal < thisIterator.min ) {
              pushVal = thisIterator.min;
            } else {
              pushVal = loopVal;
            }
          } else {
            pushVal = thisIterator.max;
          }

          if ( this.userConfig.xAxis[ xVal ] < 50000 ) {
            if ( thisIterator.limitAt50k ) {
              pushVal = 0;
            }
          }

          newData.push( Math.ceil( pushVal * 1000 ) / 1000 )
        }
        newDataset = {
          label: iterator,
          borderColor: randomColor( 0.4 ),
          backgroundColor: randomColor( 0.5 ),
          pointBorderColor: randomColor( 0.7 ),
          pointBackgroundColor: randomColor( 0.5 ),
          pointBorderWidth: 1,
          data: newData,
          fill: true,
        }
        config.data.datasets.push( newDataset );
      }
    }

    window.myLine.update();
  },
  takeHomePercentage: function () {
    var runningTotalPercent = 0;
    for ( var iterator in this.userConfig.toggles ) {
      if ( this.userConfig.toggles[ iterator ].theBool === true ) {
        // Turn it into a whole number with 1 extra digit of precision (e.g. 7.5%), round it, then turn it back into a percentage.
        runningTotalPercent = Math.ceil( ( runningTotalPercent + this.userConfig.toggles[ iterator ].value ) * 1000 ) / 1000;
      }
    }
    return 1 - runningTotalPercent;
  },
  takeHome: function ( salary ) {
    return salary * this.takeHomePercentage( this.userConfig.toggles ) * this.timePeriod
  },
  tuition: function ( salary ) {
    var runningTotalPercent = 0;
    for ( var iterator in this.userConfig.toggles ) {
      if ( this.userConfig.toggles[ iterator ].theBool === true ) {
        runningTotalPercent = Math.ceil( ( runningTotalPercent + this.userConfig.toggles[ iterator ].value ) * 1000 ) / 1000;
      }
    }
    return salary * runningTotalPercent;
  },
  takeHomeArray: function ( arr ) {
    var takeHomeArr = []
    var temp
    for ( var i = 0; i < arr.length; i++ ) {
      temp = this.takeHome( arr[ i ] )
      takeHomeArr.push( temp )
    }
    return takeHomeArr
  },
  tuitionArray: function ( arr ) {
    var tuitionArr = []
    var temp
    for ( var i = 0; i < arr.length; i++ ) {
      temp = this.tuition( arr[ i ] )
      tuitionArr.push( temp )
    }
    return tuitionArr
  }
};

(function() {
  $('body div').append($("<div class='DynamicInput'></div>"));

  var i = 0;
  for (var toggle in calculator.userConfig.toggles) {
    $(".DynamicInput").append($("<input type='checkbox' id='box" + i + "'></input>"));
    $newParagraph = $("#box" + i).before($("<p>").text(calculator.userConfig.toggles[toggle].name));
    i++;
  }

  $("<p>Number of Years</p>").appendTo(".DynamicInput");
    var $inputYears = $("<input type='text' id='years'></input>").appendTo(".DynamicInput");

  $("#years").change(function() {
    calculator.timePeriod = Number($("#years").val());
    calculator.calculate();
  });

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

})();

var config = {
  type: 'line',
  data: {
    labels: ["40k"," 50k"," 60k"," 70k"," 80k"," 90k", "100k", "110k", "120k", "130k", "140k", "150k"],
    datasets: [{
      label: "Take-home Pay",
      data: calculator.takeHomeArray(calculator.userConfig.xAxis),
      fill: true,
    }, {
      label: "Tuition",
      data: calculator.tuitionArray(calculator.userConfig.xAxis),
      fill: true,
    }],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "ISA Takehome Calculator"
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
  calculator.calculate();
};

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

  config.data.datasets.push(newDataset);
  window.myLine.update();
});
