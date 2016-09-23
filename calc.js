$( function () {
  var chartSpaces    = {}
    , visualizations = [ "ISA", "Loan" ]
    , controls       = [{name : "Laptop Purchase ISA"},{name : "Living Stipend ISA"
      }
     ,{
        name : "Program ISA"
      }
     ,{}]

  var visData        = [{
        type    : "line"
       ,data    : {
          datasets : []
         ,labels   : [ 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000 ]
        }
       ,options : {}
      }
     ,{
        type    : "line"
       ,data    : {
          datasets : []
         ,labels   : [ 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000 ]
        }
       ,options : {}
      }]

  var calculator = {
    toggles: {
      stipend: {
          name: "Living Stipend ISA",
          theBool: false,
          value: Math.ceil( ( 1 - 0.925 ) * 1000 ) / 1000,
          max: 27692,
          min: 0,
          limitAt50k: true,
        }, // should be 7.5%
        tuition: {
          name: "Program ISA",
          theBool: false,
          value: Math.ceil( ( 1 - 0.875 ) * 1000 ) / 1000,
          max: 59500,
          min: 0,
          limitAt50k: true,
        }, // should be 12.5%
        laptop: {
          name: "Laptop purchase ISA",
          theBool: false,
          value: Math.floor( ( 1 - 0.99 ) * 1000 ) / 1000,
          max: 9000,
          min: 0,
          limitAt50k: true,
    }, // should be 1%
    calculate : function ( ) {

    }
  }}


  function ChartSpace ( spaceName, canvas, chart, controls ) {
    this.spaceName = spaceName
    this.canvas    = canvas.getContext( "2d" )
    this.chart     = chart
    this.controls  = controls
  }

  // on option change pass updateChart chart associated with that option

  function updateChart ( chart ) {
    chart.update()

    return "success"
  }

  visualizations.forEach(
    function ( visualization, index ) {
      var canvas = document.createElement( "canvas" )

      document.body.appendChild( canvas )

      chartSpaces[visualization] = new ChartSpace (
        visualization
       ,canvas
       ,new Chart ( canvas, visData[ index ] )
       ,controls[ index ]
      )

      for ( var prop in chartSpaces[visualization].controls) {
        var jawn = document.createElement( "p" )
        jawn.innerHTML = chartSpaces[visualization].controls[prop]
        document.body.appendChild( jawn )
      }

      updateChart( chartSpaces[visualization].chart )
    }
  )
})