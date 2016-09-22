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

    // Baseline (never ceases to exist)
    config.data.datasets.push( {
      label: "Take-home Pay",
      data: calculator.takeHomeArray( calculator.userConfigStacked.xAxis )
    } );

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

          //newData.push( Math.ceil( this.userConfigStacked.xAxis[ xVal ] * this.userConfigStacked.toggles[ iterator ].value * 1000 ) / 1000 * this.timePeriod )
          newData.push( Math.ceil( pushVal * 1000 ) / 1000 )
            //debugger;
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
          //this.takeHomeArray(this.userConfigStacked.xAxis),
        }
        config.data.datasets.push( newDataset );
      }
    }
    /* TODO: Move me into my own function for OTHER graph
    var bankLoanDataSet = [];
    for (var i = 0; i < calculator.userConfigStacked.xAxis.length; i++) {
      bankLoanDataSet.push(50000);
    }

    config.data.datasets.push({
      label: "Bank Loan",
      data: bankLoanDataSet
    });
    */

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
        // Turn it into a whole number with 1 extra digit of precision (e.g. 7.5%), round it, then turn it back into a percentage.
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

// TODO: Put back into closure when done with debugging


// Dynamically generate user input options
( function () {

  var canvasList = [];

  // Abstract function
  var pushObject = {
    canvasLink: null,
    checkboxes: [],
    inputFields: [],
  };

  pushObject.canvasLink = $('#canvas').after( function() { return "<div class='DynamicInputStacked'></div>" })[0];
  canvasList.push( pushObject );
  pushObject.canvasLink = $( '#canvas2' ).after( function() { return "<div class='DynamicInputLoan'></div>" })[0];
  canvasList.push( pushObject );

  for ( var canvasIterator in canvasList ) {
    var i = 0;
    for ( var toggle in calculator.userConfigStacked.toggles ) {
      var pushBox = canvasList[ canvasIterator ].canvasLink.append( function() { return "<input type='checkbox' id='box" + i + "'></input>"; } )[0] );
      canvasList[ canvasIterator ].checkboxes.push( pushBox );
      $( "#box" + i ).before( $( "<p>" ).text( calculator.userConfigStacked.toggles[ toggle ].name ) );
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
      text: "Chart.js Line Chart - Stacked Area"
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
          function ( valuePayload ) {
            return Number( valuePayload.value ).toFixed( 2 ).replace( '.', ',' ) + '$';
          },
        }
      } ]
    }
  }
};

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
  calculator.calculate();
};


$( '#randomizeData' ).click( function () {
  calculator.calculate();
} );

$( '#addDataset' ).click( function () {
  var newDataset = {
    label: 'Dataset ' + config.data.datasets.length,
    borderColor: randomColor( 0.4 ),
    backgroundColor: randomColor( 0.5 ),
    pointBorderColor: randomColor( 0.7 ),
    pointBackgroundColor: randomColor( 0.5 ),
    pointBorderWidth: 1,
    data: [],
  };

  for ( var index = 0; index < config.data.labels.length; index++ ) {
    newDataset.data.push( randomScalingFactor() );
  }

  // Because config.data.dataset uses datasets that use randomize function
  // this pushes one of those randomized ones, thus, randomizing again
  // We need to pull from our own personal array if we want to push a new dataset.
  config.data.datasets.push( newDataset );
  window.myLine.update();
} );

$( '#addData' ).click( function () {
  if ( config.data.datasets.length > 0 ) {
    var month = MONTHS[ config.data.labels.length % MONTHS.length ];
    config.data.labels.push( month );

    $.each( config.data.datasets, function ( i, dataset ) {
      dataset.data.push( randomScalingFactor() );
    } );

    window.myLine.update();
  }
} );

$( '#removeDataset' ).click( function () {
  config.data.datasets.splice( 0, 1 );
  window.myLine.update();
} );

$( '#removeData' ).click( function () {
  config.data.labels.splice( -1, 1 ); // remove the label first

  config.data.datasets.forEach( function ( dataset, datasetIndex ) {
    dataset.data.pop();
  } );

  window.myLine.update();
} );
