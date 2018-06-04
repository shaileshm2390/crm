// Dashboard 1 Morris-chart
$( function () {
	"use strict";

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


	// Extra chart
	Morris.Area( {
		element: 'extra-area-chart',
		data: [ {
				period: '2017-12',
				open: 0,
				pending: 0,
				completed: 90
        }, {
                period: '2018-1',
                open: 10,
                pending: 60,
                completed: 40
        }, {
                period: '2018-2',				
                open: 90,
                pending: 30,
                completed: 50
        }, {
                period: '2018-3',
                open: 120,
                pending: 0,
                completed: 0
        }, {
                period: '2018-4',
                open: 0,
                pending: 150,
                completed: 0
        }, {
                period: '2018-5',
                open: 30,
                pending: 60,
                completed: 90
        }, {
                period: '2018-6',
                open: 40,
                pending: 60,
                completed: 30
        }


        ],
        lineColors: ['#fc6180', '#ffb64d', '#26dad2' ],
		xkey: 'period',
		ykeys: [ 'open', 'pending', 'completed' ],
        labels: ['Open', 'Pending', 'Completed'],
        xLabelFormat: function (x) { // <--- x.getMonth() returns valid index
            var month = months[x.getMonth()];
            return month;
        },
        dateFormat: function (x) {
            var month = months[new Date(x).getMonth()];
            return month;
        },
		pointSize: 0,
		lineWidth: 0,
		resize: true,
		fillOpacity: 0.8,
		behaveLikeLine: true,
		gridLineColor: '#e0e0e0',
		hideHover: 'auto'

	} );



} );
