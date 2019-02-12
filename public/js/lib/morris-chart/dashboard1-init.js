   // Dashboard 1 Morris-chart
    $(function () {
        "use strict";
        if (typeof window.user !== 'undefined') {
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
            var morrisArea = Morris.Area({
                element: 'extra-area-chart',
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

            var displayChart = function (fromDate, toDate) {
                $.ajax({
                    url: '/dashboards/getRfqChartDetail',
                    method: "POST",
                    data: { fromDate: fromDate, toDate: toDate }
                }).done(function (obj) {
                    var result = convertResponseToMorrisData(obj);
                    morrisArea.setData(result);
                });

                $.ajax({
                    url: '/dashboards/getSiteSummary',
                    method: "POST",
                    data: { fromDate: fromDate, toDate: toDate }
                }).done(function (obj) {
                    console.log(obj);
                    $(".totalRfqCount").html(obj.TotalRqf);
                    $(".completedRfqCount").html(obj.CompletedRfq);
                    $(".pendingRfqCount").html(obj.PendingRqf);
                    $(".openRfqCount").html(obj.OpenRfq);
                    $(".openPercentage").html(obj.OpenPercentage);
                    $(".completedPercentage").html(obj.CompletedPercentage);
                    $(".pendingPercentage").html(obj.PendingPercentage);
                    $(".openPercentage-bar").css("width", obj.OpenPercentage + "%").removeClass('animated progress-animated').addClass('animated progress-animated');
                    $(".completedPercentage-bar").css("width", obj.CompletedPercentage + "%").removeClass('animated progress-animated').addClass('animated progress-animated');
                    $(".pendingPercentage-bar").css("width", obj.PendingPercentage + "%").removeClass('animated progress-animated').addClass('animated progress-animated');
                });



                $.ajax({
                    url: '/dashboards/getRfqPieChartDetail',
                    method: "POST",
                    data: { fromDate: fromDate, toDate: toDate }
                }).done(function (obj) {
                    // Basic Pie Chart            
                    var dom = document.getElementById("basic-Pie");
                    var bpChart = echarts.init(dom);

                    var option = null;
                    option = {
                        color: ['#62549a', '#4aa9e9', '#ff6c60', '#eac459', '#25c3b2'],
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b} : {c} ({d}%)'
                        },
                        legend: {
                            orient: 'horizontal',
                            x: 'left',
                            data: ['Costsheet Prepared', 'Quotation Given', 'Sample Submitted', 'PO Received', 'Developer Handover']
                        },
                        calculable: true,
                        series: [
                            {
                                name: 'Status',
                                type: 'pie',
                                radius: '75%',
                                center: ['50%', '60%'],
                                data: [
                                    { value: obj.CostsheetPrepared, name: 'Costsheet Prepared' },
                                    { value: obj.Quotations, name: 'Quotation Given' },
                                    { value: obj.SampleSubmitted, name: 'Sample Submitted' },
                                    { value: obj.POReceived, name: 'PO Received' },
                                    { value: obj.DeveloperHandovers, name: 'Developer Handover' }
                                ]
                            }
                        ]
                    };

                    if (option && typeof option === "object") {
                        bpChart.setOption(option, false);
                    }


                    // bar diagram
                    var domBar = document.getElementById("basic-bar");
                    var bChart = echarts.init(domBar);

                    var barOption = null;
                    barOption = {
                        color: ['#62549a'],
                        tooltip: {
                            trigger: 'item',
                            formatter: function (b) {
                                var name = '';
                                switch (b.name) {
                                    case 'CP': name = 'Costsheet Prepared'; break;
                                    case 'QG': name = 'Quotation Given'; break;
                                    case 'SS': name = 'Sample Submitted'; break;
                                    case 'PO': name = 'Purchase Order Received'; break;
                                    case 'DH': name = 'Developer Handover'; break;
                                }
                                return name + "<br />Count: " + b.data.value;
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        legend: {
                            data: ['Costsheet Prepared', 'Quotation Given', 'Sample Submitted', 'PO Received', 'Developer Handover']
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: ['CP', 'QG', 'SS', 'PO', 'DH'],
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: 'Status',
                                type: 'bar',
                                barWidth: '40%',
                                data: [
                                    { value: obj.CostsheetPrepared },
                                    { value: obj.Quotations },
                                    { value: obj.SampleSubmitted },
                                    { value: obj.POReceived },
                                    { value: obj.DeveloperHandovers }
                                ]
                            }
                        ],
                        graph: {
                            color: ['#d87c7c', '#919e8b', '#d7ab82', '#6e7074', '#61a0a8', '#efa18d', '#787464', '#cc7e63', '#724e58', '#4b565b']
                        }
                    };



                    if (barOption && typeof barOption === "object") {
                        bChart.setOption(barOption, false);
                    }

                });
            };// displayCharts()

            $('.flatpickr').flatpickr({
                wrap: true,
                mode: "range",
                onClose: function (selectedDates, dateStr, instance) {
                    if ($(".flatpickr input").val() !== "" && $(".flatpickr input").val().includes('to')) {
                        var dates = $(".flatpickr input").val().split(' to ');
                        displayChart(dates[0], dates[1]);
                    }
                }
            });

            $(".input-button").on('click', function () {
                if ($(".flatpickr input").val() !== "") {
                    $(".flatpickr input").val('');
                    displayChart('', '');
                }
            });

            displayChart('', '');
        }
    });