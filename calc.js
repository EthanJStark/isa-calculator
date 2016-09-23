var randomScalingFactor = function () {
  return Math.round( Math.random() * 100 * ( Math.random() > 0.5 ? -1 : 1 ) );
};
var randomColorFactor = function () {
  return Math.round( Math.random() * 255 );
};
var randomColor = function ( opacity ) {
  return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + ( opacity || '1' ) + ')';
};

var calculator = {
  timePeriod: 3,
  userConfigStacked: {
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
  userConfigLoan: {
    toggles: {
      ISA: {
        name: "Living Stipend ISA",
        theBool: false,
        value: Math.ceil( ( 1 - 0.925 ) * 1000 ) / 1000,
        max: 27692,
        min: 0,
        limitAt50k: true,
      },
      Loan: {
        name: "Program ISA",
        theBool: false,
        value: Math.ceil( ( 1 - 0.875 ) * 1000 ) / 1000,
        max: 59500,
        min: 0,
        limitAt50k: true,
      },
    },
    xAxis: [ 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000 ],
  },
  calculate: function () {
    config.data.datasets = [];
    configLoan.data.datasets = [];

    // Baseline (never ceases to exist)
    config.data.datasets.push( {
      label: "Take-home Pay",
      data: calculator.takeHomeArray( calculator.userConfigStacked.xAxis )
    } );

    // configLoan.data.datasets.push( {
    //   label: "Take-home Pay",
    //   data: calculator.takeHomeArray( calculator.userConfigStacked.xAxis )
    // } );

    // configLoan.data.datasets.push( {
    //   label: "Loan",
    //   //data: calculator.getLoan(),
    // } );

    // Dynamic datasets
    var newDataset = {};
    for ( var iterator in this.userConfigStacked.toggles ) {
      if ( this.userConfigStacked.toggles[ iterator ].theBool === true ) {
        var newData = [];
        for ( var xVal = 0; xVal < this.userConfigStacked.xAxis.length; xVal++ ) {
          var thisIterator = this.userConfigStacked.toggles[ iterator ];
          var loopVal = thisIterator.value * this.userConfigStacked.xAxis[ xVal ] * this.timePeriod;
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

          if ( this.userConfigStacked.xAxis[ xVal ] < 50000 ) {
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
    for ( var iterator in this.userConfigStacked.toggles ) {
      if ( this.userConfigStacked.toggles[ iterator ].theBool === true ) {
        // Turn it into a whole number with 1 extra digit of precision (e.g. 7.5%), round it, then turn it back into a percentage.
        runningTotalPercent = Math.ceil( ( runningTotalPercent + this.userConfigStacked.toggles[ iterator ].value ) * 1000 ) / 1000;
      }
    }
    return 1 - runningTotalPercent;
  },
  takeHome: function ( salary ) {
    return salary * this.takeHomePercentage( this.userConfigStacked.toggles ) * this.timePeriod
  },
  tuition: function ( salary ) {
    var runningTotalPercent = 0;
    for ( var iterator in this.userConfigStacked.toggles ) {
      if ( this.userConfigStacked.toggles[ iterator ].theBool === true ) {
        runningTotalPercent = Math.ceil( ( runningTotalPercent + this.userConfigStacked.toggles[ iterator ].value ) * 1000 ) / 1000;
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

// Dynamically generate user input options
( function () {

  var canvasList = [];

  function ChartSection( canvasLink ) {
    this.canvasLink = canvasLink;
    this.checkboxes = [];
    this.inputFields = [];
  }

  canvasList.push( new ChartSection( $( '<div></div>' ).insertAfter( "#canvas" )[ 0 ] ) );
  canvasList.push( new ChartSection( $( '<div></div>' ).insertAfter( "#canvas2" )[ 0 ] ) );

  for ( var canvasIterator in canvasList ) {
    var i = 0;
    for ( var toggle in calculator.userConfigStacked.toggles ) {
      var pushBox = $( "<input type='checkbox' id='box" + i + "'></input>" ).appendTo( canvasList[ canvasIterator ].canvasLink )[ 0 ];
      canvasList[ canvasIterator ].checkboxes.push( pushBox );
      $( "<p id=" + toggle + "_" + canvasIterator + ">" ).text( calculator.userConfigStacked.toggles[ toggle ].name ).insertBefore( pushBox );
      i++;
    }

    i = 0;
    for ( var iterator in calculator.userConfigStacked ) {
      $( "#box" + i ).change( function () {
        if ( document.getElementById( 'box' + i ).checked ) {
          calculator.userConfigStacked.toggles.Stipend.theBool = true;
        } else {
          calculator.userConfigStacked.toggles.Stipend.theBool = false;
        }
        calculator.calculate();
      } );
      i++;
    }
    i = 0;
  }

} )();

var config = {
  type: 'line',
  data: {
    // labels is the x-axis data-point labels
    //labels: ["January", "February", "March", "April", "May", "June", "July"],
    labels: [ 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000 ],
    datasets: [],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      // MAIN HEAD TITLE
      text: "$ Spend"
    },
    tooltips: {
      mode: 'label',
      ticks: {
        callback: function ( label, index, labels ) {
          return label / 1000 + 'k';
        },
      },
    },
    hover: {
      mode: 'label',
      ticks: {
        callback: function ( label, index, labels ) {
          return label / 1000 + 'k';
        },
      },
    },
    scales: {
      xAxes: [ {
        scaleLabel: {
          display: true,
          labelString: 'Annual Income',
        },
        ticks: {
          callback: function ( label, index, labels ) {
            return label / 1000 + 'k';
          },
        },
      } ],
      yAxes: [ {
        ticks: {
          callback: function ( label, index, labels ) {
            return label / 1000 + 'k';
          }
        },
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'Amount Paid (3 YR)',

        }
      } ]
    }
  }
};

var configLoan = {
  type: 'line',
  data: {
    // labels is the x-axis data-point labels
    //labels: ["January", "February", "March", "April", "May", "June", "July"],
    labels: [ 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000 ],
    datasets: [],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      // MAIN HEAD TITLE
      text: "Loan Comparison"
    },
    tooltips: {
      mode: 'label',
      ticks: {
        callback: function ( label, index, labels ) {
          return label / 1000 + 'k';
        },
      },
    },
    hover: {
      mode: 'label',
      ticks: {
        callback: function ( label, index, labels ) {
          return label / 1000 + 'k';
        },
      },
    },
    scales: {
      xAxes: [ {
        scaleLabel: {
          display: true,
          labelString: 'Annual Income'
        },
        ticks: {
          callback: function ( label, index, labels ) {
            return label / 1000 + 'k';
          },
        },
      } ],
      yAxes: [ {
        ticks: {
          callback: function ( label, index, labels ) {
            return label / 1000 + 'k';
          }
        },
        stacked: false,
        scaleLabel: {
          display: true,
          labelString: 'Amount Paid (3 YR)'
        }
      } ]
    }
  }
};

// Serafin: HELP! How do I import other files like in C++ with header files!
// These objects above are WAY TO BIG to be taking up space in this JS file

//var fs = require('fs');
//var config = JSON.parse(fs.readFileSync('configStacked.json', 'utf8'));
//var configLoan = JSON.parse(fs.readFileSync('configLoan.json', 'utf8'));

// var configLoan = JSON.parse(fs.readFileSync('configStacked.json', 'utf8'));

$.each( config.data.datasets, function ( i, dataset ) {
  var color = randomColor( 1 );
  dataset.borderColor = color;
  dataset.backgroundColor = color;
  dataset.pointBorderColor = color;
  dataset.pointBackgroundColor = color;
  dataset.pointBorderWidth = 1;
} );

window.onload = function () {
  var ctx = document.getElementById( "canvas" ).getContext( "2d" );
  // IMPORTANT - this is where the chart is instantiated.
  window.myLine = new Chart( ctx, config );
  var ctx2 = document.getElementById( "canvas2" ).getContext( "2d" );
  // IMPORTANT - this is where the chart is instantiated.
  window.myLine2 = new Chart( ctx2, configLoan );
  calculator.calculate();
};
