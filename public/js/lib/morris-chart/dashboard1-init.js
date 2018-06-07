   // Dashboard 1 Morris-chart
    $(function () {
        "use strict";
        if (typeof window.user != 'undefined') {
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

                convertResponseToMorrisData = function (obj) {
                    var result = [];
                    Object.keys(obj).forEach(function (key) {
                        if (obj[key].length > 0) {
                            for (var index = 0; index < obj[key].length; index++) {

                                if (result.some(function (o) { return o["period"] === obj[key][index].Month; })) {
                                    // if element already exists
                                    var existingItem = result.filter(function (o) { if (o["period"] === obj[key][index].Month) return o; }),
                                        existingIndex = result.indexOf(existingItem[0]);

                                    if (key == 'Open') {
                                        result[existingIndex].Open = obj[key][index].Count + existingItem[0].Open;
                                    } else if (key == 'Pending') {
                                        result[existingIndex].Pending = obj[key][index].Count + existingItem[0].Pending;
                                    } else if (key == 'Completed') {
                                        result[existingIndex].Completed = obj[key][index].Count + existingItem[0].Completed;
                                    }
                                }

                                else {
                                    if (key == 'Open') {
                                        result.push({ period: obj[key][index].Month, Open: obj[key][index].Count, Pending: 0, Completed: 0 });
                                    } else if (key == 'Pending') {
                                        result.push({ period: obj[key][index].Month, Open: 0, Pending: obj[key][index].Count, Completed: 0 });
                                    } else if (key == 'Completed') {
                                        result.push({ period: obj[key][index].Month, Open: 0, Pending: 0, Completed: obj[key][index].Count });
                                    }
                                }
                            }
                        }
                    });
                    return result;
                };

            $.ajax({
                url: '/dashboards/getRfqChartDetail',
                method: "GET",
            }).done(function (obj) {
                var result = convertResponseToMorrisData(obj);
                console.log(result);
                Morris.Area({
                    element: 'extra-area-chart',
                    data: result,
                    lineColors: ['#fc6180', '#ffb64d', '#26dad2'],
                    xkey: 'period',
                    ykeys: ['Open', 'Pending', 'Completed'],
                    labels: ['Open', 'Pending', 'Completed'],
                    xLabelFormat: function (x) { // <--- x.getMonth() returns valid index
                        var month = months[new Date(x.label).getMonth()];
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
                    hideHover: 'auto',
                    parseTime : false
                });
            });
        }
    });