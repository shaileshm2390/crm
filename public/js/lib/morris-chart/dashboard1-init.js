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
                    pointSize: 5,
                    lineWidth: 0,
                    resize: true,
                    fillOpacity: 0.5,
                    behaveLikeLine: true,
                    gridLineColor: '#e0e0e0',
                    hideHover: 'auto',
                    parseTime: false
                });
            });

/*
            // Basic Pie Chart
            var dom = document.getElementById("basic-Pie");
            var bpChart = echarts.init(dom);

            var app = {};
            option = null;
            option = {
                color: ['#62549a', '#4aa9e9', '#ff6c60', '#eac459', '#25c3b2'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: ['Direct', 'Mail', 'Affiliate', 'AD', 'Search']
                },
                calculable: true,
                series: [
                    {
                        name: 'Source',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            { value: 335, name: 'Direct' },
                            { value: 310, name: 'Mail' },
                            { value: 234, name: 'Affiliate' },
                            { value: 135, name: 'AD' },
                            { value: 1548, name: 'Search' }
                        ]
                    }
                ]
            };

            if (option && typeof option === "object") {
                bpChart.setOption(option, false);
            }*/
        }
    });