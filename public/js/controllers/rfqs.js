'use strict';

var app = angular.module('mean.rfqs').controller('RfqsController', ['$scope', '$stateParams', 'Global', 'Rfqs', '$state', '$window', '$http', '$sce', '$location', function ($scope, $stateParams, Global, Rfqs, $state, $window, $http, $sce, $location) {
    $scope.global = Global;
    $scope.validatePermission = false;
    $scope.globalCheckFeasibility = true;
    $scope.currentUrl = $location.url();
    $scope.fromDate = "";
    $scope.toDate = "";
    $scope.reports = [];
    $scope.partId = $stateParams.partId;

    $scope.trustAsHtml = function (html) {
        return $sce.trustAsHtml(html);
    }

    $scope.findByBuyer = function () {
        $http.get("/buyersrfqs/" + $stateParams.buyerId)
            .then(function (response) {
                $scope.rfqs = response.data;
            }, function (error) {
                console.log(error, $stateParams.buyerId);
            });
    };

    $scope.RemoveSpaceFromKey = function (arr) {
        // Iterate over array
        arr.forEach(function (e, i) {
            // Iterate over the keys of object
            Object.keys(e).forEach(function (key) {

                // Copy the value
                var val = e[key],
                    newKey = key.replace(/\s+/g, '').replace(/\//g, '').replace("&", "");

                // Remove key-value from object
                delete arr[i][key];

                // Add value with new key
                arr[i][newKey] = val;
            });
        });
        return arr;
    };


    $scope.findOneByRfqId = function () {
        var url = "/rfqs/" + $stateParams.rfqId;
        if (typeof $scope.partId !== "undefined" && $scope.partId !== "" && $scope.partId !== null) {
            url += "?partId=" + $scope.partId;
        }
        $scope.rfq = { id: $stateParams.rfqId };
        $http.get(url)
            .then(function (response) {
                if (response.data !== null) {
                    $scope.rfq = response.data;
                    var currentUrl = "customer/" + $scope.rfq.Buyer.CustomerId + "/buyer/" + $scope.rfq.BuyerId + "/rfq/" + $scope.rfq.id;
                    if ($scope.isFeasibilityChecked($scope.rfq) || window.location.href.indexOf(currentUrl) > -1) {
                        var isDownloadable = false;
                        for (var index = 0; index < $scope.rfq.RfqImages.length; index++) {
                            if ($scope.rfq.RfqImages[index].imagePath.indexOf(".pdf") > -1) {
                                $scope.rfq.RfqImages[index].displayPath = '/img/pdf.png';
                            } else if ($scope.rfq.RfqImages[index].imagePath.indexOf(".xls") > -1) {
                                $scope.rfq.RfqImages[index].displayPath = '/img/excel.png';
                                isDownloadable = true;
                            } else {
                                $scope.rfq.RfqImages[index].displayPath = $scope.rfq.RfqImages[index].imagePath;
                            }
                            $scope.rfq.RfqImages[index].isDownloadable = isDownloadable;
                        }
                        if ($scope.rfq.CostSheets.length > 0) {
                            $scope.rfq.LatestCostsheet = $scope.rfq.CostSheets[$scope.rfq.CostSheets.length - 1];
                            $scope.rfq.LatestCostsheet.data = JSON.parse($scope.rfq.LatestCostsheet.data);
                            var costSheetData = $scope.RemoveSpaceFromKey($scope.rfq.LatestCostsheet.data);
                            var RawMaterial = new Array(), Conversion = new Array(), HtSt = new Array(), PackingForwarding = new Array();
                            $.each(costSheetData, function (key, data) {
                                if (data.hasOwnProperty('RawMaterial')) {
                                    RawMaterial.push(data);
                                } else if (data.hasOwnProperty('Operation')) {
                                    Conversion.push(data);
                                }
                                else if (data.hasOwnProperty('HTST')) {
                                    HtSt.push(data);
                                } else if (data.hasOwnProperty('PackingForwardings')) {
                                    PackingForwarding.push(data);
                                }
                                else if (data.hasOwnProperty("PercentageRMCost")) {
                                    $scope.rfq.LatestCostsheet.PercentageRMCost = data.PercentageRMCost;
                                    $scope.rfq.LatestCostsheet.ProfitonRMCost = data.ProfitonRMCost;
                                    $scope.rfq.LatestCostsheet.PercentageConversionCost = data.PercentageConversionCost;
                                    $scope.rfq.LatestCostsheet.ProfitonConversionCost = data.ProfitonConversionCost;
                                } else if (data.hasOwnProperty("Total")) {
                                    $scope.rfq.LatestCostsheet.Total = data.Total;
                                }
                            });
                            $scope.rfq.LatestCostsheet.RawMaterial = RawMaterial;
                            $scope.rfq.LatestCostsheet.Conversion = Conversion;
                            $scope.rfq.LatestCostsheet.HtSt = HtSt;
                            $scope.rfq.LatestCostsheet.PackingForwarding = PackingForwarding;
                        }

                        $scope.validatePermission = true;
                        if ($scope.rfq.HandoverSubmitted !== null && $scope.rfq.HandoverSubmitted.id != null && $scope.rfq.DeveloperHandovers != null && $scope.rfq.DeveloperHandovers.length > 0) {
                            var testDate = new Date();
                            var onlydate = new Date($scope.rfq.HandoverSubmitted.createdAt.split("T")[0]);
                            $scope.ExpectedLeadDate = testDate.setDate(onlydate.getDate() + ($scope.rfq.DeveloperHandovers[0].expectedLeadTime * 7));
                        }
                    } else {
                        window.location.href = currentUrl;
                    }

                }
            }, function (error) {
                console.log(error, $stateParams.rfqId);
            });
    };

    $scope.displaySampleSubmission = function (rfq) {
        if (typeof (rfq) != "undefined" && typeof (rfq.CostSheets) != "undefined") {
            return rfq.CostSheets.length && rfq.CostSheets.some(function (o) { return o['status'] == 'approved' });
        }
        return false;
    };

    $scope.displayReceivePO = function (rfq) {
        if (typeof (rfq) != "undefined" && typeof (rfq.Quotations) != "undefined") {
            return rfq.Quotations.length;
        }
        return false;
    };


    $scope.isFeasibilityChecked = function (rfq) {
        if (typeof (rfq) != "undefined" && typeof (rfq.RfqFeasibilities) != "undefined") {
            return rfq.RfqFeasibilities.length;
        }
        return false;
    };

    $scope.isPoReceived = function (rfq) {
        if (typeof (rfq) != "undefined" && typeof (rfq.PurchaseOrders) != 'undefined') {
            return rfq.PurchaseOrders.length && rfq.PurchaseOrders.some(function (o) { return o['status'] == "Completed" });
        }
        return false;
    };

    $scope.assignToMeRfq = function (rfqId) {
        $http.put('/rfqs/' + rfqId, { UserId: $window.user.id, id: rfqId }).then(function (response) {
            $scope.findOneByRfqId();
        });
    };

    $scope.findReports = function (numberOfMonths) {
        if ($scope.fromDate == "" || $scope.toDate == "") {
            $scope.fromDate = new Date(new Date().setMonth(new Date().getMonth() - numberOfMonths)).toJSON().slice(0, 10).replace('T', ' ');
            $scope.toDate = new Date().toJSON().slice(0, 10).replace('T', ' ');
        }
        var body = { fromDate: $scope.fromDate, toDate: $scope.toDate };
        $http({ method: 'post', url: "/rfqs/report", params: body }).then(function (response) {
            $scope.reports = response.data;
            var index = 0;
            $.each($scope.reports, function (key, rfq) {
                if (rfq.data != null && rfq.data.length > 0) {
                    var costSheetData = JSON.parse(rfq.data);
                    $.each(costSheetData, function (key, data) {
                        if (data.hasOwnProperty("Total")) {
                            $scope.reports[index].Total = data.Total;
                        }
                    });
                }
                index++;
            });
            console.log($scope.reports);
        });
    };

    $scope.canAccess = function (key) {
        var marketingAccess = ['prepare costsheet', 'quotation', 'PO', 'costsheet'];
        var devAccess = ['sample submission', 'inspection report', 'developer handover', 'costsheet'];
        var currentUserRole = $window.user.role;

        if (currentUserRole === 'Dev' && devAccess.includes(key)) {
            return true;
        } else if (currentUserRole === 'Marketing' && marketingAccess.includes(key)) {
            return true;
        } else if (currentUserRole === 'Admin') {
            return true;
        }
        return false;
    };

    $scope.isCurrentRole = function (key) {
        var currentUserRole = $window.user.role;
        return currentUserRole == key;
    }

}]);

app.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    //var actions = 
    // Append table with add row form on add new button click

    var savePartDetails = function (partDetails) {
        var dfd = $.Deferred();
        $.ajax({
            url: '/rfqParts/',
            method: "POST",
            data: { RfqId: $(".hdnRfqId").val(), records: partDetails }
        }).done(function (response) {
            $("#lblPartMsg").html('Part data saved successfully');
            $("#lblPartMsg").show().delay(5000).fadeOut();
            dfd.resolve(response);
        });
        return dfd.promise();
    },

        deletePartDetails = function (id) {
            $.ajax({
                url: '/rfqParts/' + id,
                method: "DELETE"
            }).done(function (response) {
                $("#lblPartMsg").html('Part has been deleted successfully');
                $("#lblPartMsg").show().delay(5000).fadeOut();
            });
        };
    
    $(document).on("click", ".add-new", function () {
        $(this).attr("disabled", "disabled");
        var index = $("table.tblParts tbody tr:last-child").index();
        var row = '<tr>' +
            '<td><input type="text" class="form-control" name="name" id="name"></td>' +
            '<td><a class="add addParts" data-id="0" title="Add" data-toggle="tooltip"><i class="fa fa-save" style="color:#27C46B;"></i></a><a class="edit editParts" data-id="0" title="Edit" data-toggle="tooltip"><i class="fa fa-pencil" style="color:#FF922B;"></i></a><a class="delete deleteParts" data-id="0" title="Delete" data-toggle="tooltip"><i class="fa fa-trash" style="color:#E34724;"></i></a></td>' +
            '</tr>';
        $("table.tblParts").append(row);
        $("table.tblParts tbody tr").eq(index + 1).find(".add, .edit").toggle();
        $('[data-toggle="tooltip"]').tooltip();
    });
    // Add row on add button click
    $(document).on("click", ".add", function () {
        var empty = false, $me = $(this);
        var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function () {
            if (!$(this).val()) {
                $(this).addClass("error");
                empty = true;
            } else {
                var obj = {}, partDetails = [];
                    obj.partName = $.trim($(this).val());
                obj.id = parseInt($me.attr("data-id"));
                partDetails.push(obj)
                $.when(savePartDetails(partDetails)).then(function (response) {
                    if (response > 0) {
                        $me.parent().find(".addParts").data('id', "'" + response + "'");
                        $me.parent().find(".editParts").data('id', "'" + response + "'");
                        $me.parent().find(".deleteParts").data('id', "'" + response + "'");
                    }
                });
                ;
                $(this).removeClass("error");
            }
        });
        $(this).parents("tr").find(".error").first().focus();
        if (!empty) {
            input.each(function () {
                $(this).parent("td").html($(this).val());
            });
            $(this).parents("tr").find(".add, .edit").toggle();
            $(".add-new").removeAttr("disabled");
        }
    });
    // Edit row on edit button click
    $(document).on("click", ".edit", function () {
        $(this).parents("tr").find("td:not(:last-child)").each(function () {
            $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
        });
        $(this).parents("tr").find(".add, .edit").toggle();
        $(".add-new").attr("disabled", "disabled");
    });
    // Delete row on delete button click
    $(document).on("click", ".delete", function () {
        if (parseInt($(this).attr('data-id')) !== 0) {
            deletePartDetails(parseInt($(this).attr('data-id')));
        }
        $(this).parents("tr").remove();
        $(".add-new").removeAttr("disabled");
    });
});