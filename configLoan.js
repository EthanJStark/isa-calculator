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
        stacked: false,
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
}
