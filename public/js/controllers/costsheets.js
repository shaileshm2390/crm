'use strict';

var app = angular.module('mean.costsheets').controller('CostSheetsController', ['$scope', '$stateParams', 'Global', 'CostSheets', '$state', '$window', '$http', '$sce', function ($scope, $stateParams, Global, CostSheets, $state, $window, $http, $sce) {
    $scope.global = Global;
    $scope.partId = $stateParams.partId || 0; 

    $scope.trustAsHtml = function (html) {
        return $sce.trustAsHtml(html);
    }

    $scope.findByRfqId = function () {
        $http.get("/rfq/costsheets/" + $stateParams.rfqId + "?partId=" + $stateParams.partId)
            .then(function (response) {
                $scope.costsheets = response.data;
            }, function (error) {
            });
    };

    $scope.findApprovedCostSheetByRfqId = function () {
        $http.get("/rfq/costsheets/approved/" + $stateParams.rfqId + "?partId=" + $scope.partId)
            .then(function (response) {
                $scope.costsheet = response.data;
            }, function (error) {
            });
    };
}]);

app.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

//$(document).ready(function () {
//    var bindRemoveParameter = function () {
//        $(".lnkRemove").on('click', function () {
//            //$(this).parent().parent().parent().next().remove(".clearfix");
//            //$(this).parent().parent().parent().next().remove("br");
//            var $target = $(this).parent().parent().parent();
//            $target.hide("slow", function () {
//                $target.remove();
//            });
//        });
//    };
//    bindRemoveParameter();
//    var rfqId;

//    var toTitleCase = function (str) {
//        return str.replace(/(?:^|\s)\w/g, function (match) {
//            return match.toUpperCase();
//        });
//    };

//    var calculateRmCost = function ($ele) {
//        var rate = $ele.parent().parent().find(".txtRate").val().replace(/[^\d.]/g, ''),
//            scrapRate = $ele.parent().parent().find(".txtScrapRate").val().replace(/[^\d.]/g, ''),
//            scrapRecovery = $ele.parent().parent().find(".txtScrapRecovery").val().replace(/[^\d.]/g, ''),
//            grWt = $ele.parent().parent().find(".txtGrWt").val().replace(/[^\d.]/g, ''),
//            netWt = $ele.parent().parent().find(".txtNetWt").val().replace(/[^\d.]/g, '');

//        if ($ele.parent().parent().find(".ddlRawMaterial").val() != "" && grWt != "" && netWt != "" && rate != "" && scrapRate != "" && scrapRecovery != "" &&
//            !(isNaN(grWt) && isNaN(netWt) && isNaN(rate) && isNaN(scrapRate) && isNaN(scrapRecovery))) {

//            var rmCost = Math.ceil(((grWt * rate) / 1000) * 100) / 100;
//            var netRmCost = rmCost - ((((grWt - netWt) * scrapRate) / 1000) * (scrapRecovery / 100));

//            $ele.parent().parent().find(".txtRmCost").val("Rs " + rmCost.toFixed(2));
//            $ele.parent().parent().find(".txtNetRmCost").val("Rs " + (Math.ceil(netRmCost * 100) / 100).toFixed(2));
//        } else {
//            $ele.parent().parent().find(".txtRmCost").val('');
//            $ele.parent().parent().find(".txtNetRmCost").val('');
//        }

//        var totalRmCost = 0;
//        $(".txtNetRmCost").each(function (key, value) {
//            if ($(value).val() != "") {
//                totalRmCost += parseFloat($(value).val().replace(/[^\d.]/g, ''));
//            }
//        });
//        $(".txtTotalRmCost").val("Rs " + totalRmCost.toFixed(2));
//        calculateProfitRmCost();
//        calculateProfitConversionCost();
//        calculateTotalProfit();
//    },

//        calculateConversionCost = function ($ele) {
//            var rate = $ele.parent().parent().find(".txtConversionRate").val().replace(/[^\d.]/g, ''),
//                efficiency = $ele.parent().parent().find(".txtConversionEfficiency").val().replace(/[^\d.]/g, ''),
//                cycleTime = $ele.parent().parent().find(".txtCycleTime").val().replace(/[^\d.]/g, '');

//            if ($ele.parent().parent().find(".ddlMachine").val() != "" && efficiency != "" && cycleTime != "" && rate &&
//                !(isNaN(efficiency) && isNaN(cycleTime) && isNaN(rate))) {

//                var conversionCost = Math.ceil((((cycleTime * rate) / 3600) * (efficiency / 100)) * 10) / 10;

//                $ele.parent().parent().find(".txtConversionCost").val("Rs " + conversionCost.toFixed(2));
//            } else {
//                $ele.parent().parent().find(".txtConversionCost").val('');
//            }
//            var totalConversionCost = 0;
//            $(".txtConversionCost").each(function (key, value) {
//                if ($(value).val() != "") {
//                    totalConversionCost += parseFloat($(value).val().replace(/[^\d.]/g, ''));
//                }
//            });
//            $(".txtTotalConversionCost").val("Rs " + totalConversionCost.toFixed(2));

//            calculateProfitRmCost();
//            calculateProfitConversionCost();
//            calculateTotalProfit();
//        },

//        calculateHtStCost = function ($ele) {
//            var rate = $ele.parent().parent().find(".txtHtStRate").val().replace(/[^\d.]/g, ''),
//                netWt = $ele.parent().parent().find(".txtNetWt").val().replace(/[^\d.]/g, '');

//            if ($ele.parent().parent().find(".ddlHtSt").val() != "" && netWt != "" &&
//                !(isNaN(netWt) && isNaN(rate))) {
//                var htStCost = Math.ceil((((netWt * rate) / 1000)) * 100) / 100;
//                $ele.parent().parent().find(".txtHtStCost").val("Rs " + htStCost.toFixed(2));
//            } else {
//                $ele.parent().parent().find(".txtHtStCost").val('');
//            }
//            var totalHtStCost = 0;
//            $(".txtHtStCost").each(function (key, value) {
//                if ($(value).val() != "") {
//                    totalHtStCost += parseFloat($(value).val().replace(/[^\d.]/g, ''));
//                }
//            });
//            $(".txtTotalHtStCost").val("Rs " + totalHtStCost.toFixed(2));

//            calculateProfitRmCost();
//            calculateProfitConversionCost();
//            calculateTotalProfit();
//        },

//        calculatePackingAndForwardingCost = function ($ele) {
//            var rate = $ele.parent().parent().find(".txtPackingAndForwardingRate").val().replace(/[^\d.]/g, ''),
//                netWt = $ele.parent().parent().find(".txtNetWt").val().replace(/[^\d.]/g, '');

//            if ($ele.parent().parent().find(".ddlPackingAndForwarding").val() != "" && netWt != "" &&
//                !(isNaN(netWt) && isNaN(rate))) {
//                var packingAndForwardingCost = Math.ceil((((netWt * rate) / 1000)) * 100) / 100;
//                $ele.parent().parent().find(".txtPackingAndForwardingCost").val("Rs " + packingAndForwardingCost.toFixed(2));
//            } else {
//                $ele.parent().parent().find(".txtPackingAndForwardingCost").val('');
//            }
//            var totalPackingAndForwardingCost = 0;
//            $(".txtPackingAndForwardingCost").each(function (key, value) {
//                if ($(value).val() != "") {
//                    totalPackingAndForwardingCost += parseFloat($(value).val().replace(/[^\d.]/g, ''));
//                }
//            });
//            $(".txtTotalPackingAndForwardingCost").val("Rs " + totalPackingAndForwardingCost.toFixed(2));

//            calculateProfitRmCost();
//            calculateProfitConversionCost();
//            calculateTotalProfit();
//        },

//        calculateProfitRmCost = function () {
//            var totalCost = $(".txtNetRmCost").val().replace(/[^\d.]/g, ''),
//                profitPercentage = $(".txtInputRmCostProfit").val().replace(/[^\d.]/g, '');
//            if (totalCost != "" && profitPercentage != "" &&
//                !(isNaN(totalCost) && isNaN(profitPercentage))) {
//                var profit = Math.ceil(((totalCost * profitPercentage) / 100) * 100) / 100;
//                $(".txtRmCostProfit").val("Rs " + profit.toFixed(2));
//            } else {
//                $(".txtRmCostProfit").val("");
//            }
//        },

//        calculateProfitConversionCost = function () {
//            var totalCost = $(".txtConversionCost").val().replace(/[^\d.]/g, ''),
//                profitPercentage = $(".txtInputConversionCostProfit").val().replace(/[^\d.]/g, '');
//            if (totalCost != "" && profitPercentage != "" &&
//                !(isNaN(totalCost) && isNaN(profitPercentage))) {
//                var profit = Math.ceil(((totalCost * profitPercentage) / 100) * 100) / 100;
//                $(".txtConversionCostProfit").val("Rs " + profit.toFixed(2));
//            } else {
//                $(".txtConversionCostProfit").val("");
//            }
//        },

//        calculateTotalProfit = function () {
//            var rmProfit = $(".txtRmCostProfit").val().replace(/[^\d.]/g, ''),
//                conversionProfit = $(".txtConversionCostProfit").val().replace(/[^\d.]/g, ''),
//                txtTotalRmCost = $(".txtTotalRmCost").val().replace(/[^\d.]/g, ''),
//                txtTotalConversionCost = $(".txtTotalConversionCost").val().replace(/[^\d.]/g, ''),
//                txtTotalHtStCost = $(".txtTotalHtStCost").val().replace(/[^\d.]/g, ''),
//                txtTotalPackingAndForwardingCost = $(".txtTotalPackingAndForwardingCost").val().replace(/[^\d.]/g, '');

//            if ($(".txtTotalPackingAndForwardingCost").val() === "") {
//                $(".txtTotalPackingAndForwardingCost").val("Rs 0.00");
//                txtTotalPackingAndForwardingCost = "0";
//            }

//            if (rmProfit != "" && conversionProfit != "" && txtTotalRmCost != "" && txtTotalConversionCost != "" && txtTotalHtStCost != "" && txtTotalPackingAndForwardingCost != "" &&
//                !(isNaN(rmProfit) && isNaN(conversionProfit) && isNaN(txtTotalRmCost) && isNaN(txtTotalConversionCost) && isNaN(txtTotalHtStCost) && isNaN(txtTotalPackingAndForwardingCost))) {
//                var profit = Math.ceil(((parseFloat(rmProfit) + parseFloat(conversionProfit) + parseFloat(txtTotalRmCost) + parseFloat(txtTotalConversionCost) + parseFloat(txtTotalHtStCost) + parseFloat(txtTotalPackingAndForwardingCost))) * 100) / 100;
//                $(".txtTotal").val("Rs " + profit.toFixed(2)).addClass("total-success");
//            } else {
//                $(".txtTotal").val("").removeClass("total-success");
//            }
//        },

//        createDynamicTextFields = function ($ele, callback) {
//            var width = $ele.data('width') || "12";
//            var inputName = $("<input />", { class: 'txtName form-control', type: 'text', placeholder: 'Name', required: 'required' });
//            var inputValue = $("<input />", { class: 'txtValue form-control', type: 'text', placeholder: 'Value', required: 'required' });

//            var divCol5Name = $('<div>', { class: 'col col-lg-5' }).html(inputName);
//            var divCol5Value = $('<div>', { class: 'col col-lg-5' }).html(inputValue);
//            var divCol2Space = $('<div>', { class: 'col col-lg-2' }).html('<a href="#" class="btn btn-danger lnkRemove pull-right" title="remove row"><span><i class="fa fa-minus-circle"></i></span></a >');

//            var divRow = $('<div>', { class: 'row' }).append(divCol5Name, divCol5Value, divCol2Space);
//            var divColWidth = $('<div>', { class: 'col col-' + width + ' animated fadeInDown m-b-5' }).append(divRow);

//            $ele.parents('.cost-sheet-form').find(".pnlParameter").append(divColWidth);
//            bindRemoveParameter();
//            typeof callback === 'function' && callback();
//        };

//    // ajax call to save cost sheet
//    var saveCostSheet = function (data) {
//        var dfd = $.Deferred();
//        $.ajax({
//            url: '/costsheets/',
//            method: "POST",
//            data: { UserId: window.user.id, data: data, RfqId: rfqId, status: window.user.isAdmin ? "approved" : "pending", RfqPartId: parseInt($('.ddlParts').val()), TotalCost: $('.txtTotal').val() }
//        }).done(function (response) {
//            $(".lblMsg").html("<span>Saved successfully !!!</span>").removeClass("hide").show().delay(3000).fadeOut();
//            $('html, body').animate({
//                scrollTop: $(".lblMsg").offset().top
//            }, 500);
//            dfd.resolve(response);
//        });
//        return dfd.promise();
//    };

//    var loadCode = setInterval(function () {
//        rfqId = $(".hdnRfqId").val();

//        // slider of images
//        if ($(".elastislide").length > 0) {
//            $('.elastislide').elastislide();
//        }
//        // add dynamic fields to DOM
//        $(".lnkAdd").on('click', function (e) {
//            createDynamicTextFields($(this));
//            if ($(".txtName").length == 0) {
//                $('.btnSubmit ').hide();
//            } else {
//                $('.btnSubmit ').show();
//            }
//            e.stopImmediatePropagation();
//            return false;
//        });

//        // save cost sheet to db
//        $(".btnSubmit").on('click', function (e) {
//            //consol.log("1");
//            var $me = $(this);
//            var nameValuePair = [];
//            var totalRecord = $(".txtName").length;
//            var validField = [], validPredefinedField = [];


//            for (var index = 0; index < totalRecord; index++) {
//                console.log("totalRecord : " + totalRecord);
//                var itemObj = {};
//                if ($.trim($($(".txtName")[index]).val()) != "" && $.trim($($(".txtValue")[index]).val())) {
//                    itemObj[$($(".txtName")[index]).val()] = $($(".txtValue")[index]).val();
//                    $($(".txtName")[index]).css("border", "");
//                    $($(".txtValue")[index]).css("border", "");
//                    validField[index] = true;
//                    nameValuePair.push(itemObj);
//                }
//                else {
//                    validField[index] = false;
//                    if ($.trim($($(".txtName")[index]).val()) == "") {
//                        $($(".txtName")[index]).css("border", "1px solid red");
//                    } else {
//                        $($(".txtName")[index]).css("border", "");
//                    }
//                    if ($.trim($($(".txtValue")[index]).val()) == "") {
//                        $($(".txtValue")[index]).css("border", "1px solid red");
//                    } else {
//                        $($(".txtValue")[index]).css("border", "");
//                    }
//                }
//            }
//            $me.parents(".cost-sheet-form").find(".head-row").each(function (key, row) {
//                if ($(row).find(".txtPredefinedValue").length) {
//                    var itemObj = {};
//                    for (var index = 0; index < $(row).find(".txtPredefinedValue").length; index++) {
//                        if ($.trim($($(row).find(".txtPredefinedValue")[index]).val())) {
//                            itemObj[$($(row).find(".txtPredefinedName")[index]).text()] = $($(row).find(".txtPredefinedValue")[index]).val();
//                            $($(row).find(".txtPredefinedValue")[index]).css("border", "");
//                            validPredefinedField[index] = true;
//                        }
//                        else {
//                            validPredefinedField[index] = false;
//                            $($(row).find(".txtPredefinedValue")[index]).css("border", "1px solid red");
//                        }
//                    }
//                    nameValuePair.push(itemObj);
//                }
//            });
//            console.log("validField.length = " + $.inArray(false, validPredefinedField) < 0);
//            if ((validField.length > 0 && $.inArray(false, validField) < 0) || $.inArray(false, validPredefinedField) < 0) {
//                // save costsheet
//                console.log("nameValuePair = " + JSON.stringify(nameValuePair));
//                $.when(saveCostSheet(JSON.stringify(nameValuePair))).then(function () {
//                    //window.location.href = '/rfq/' + $('.hdnRfqId').val() + '/costsheet/prepare';
//                });
//            } else {
//                nameValuePair = [];
//            }
//            e.stopImmediatePropagation();
//            return false;
//        });

//        // copy data to modified it
//        $(".btn-update").on('click', function () {
//            $me = $(this);
//            $me.parents('.cost-sheet-form').find(".pnlParameter").html("");
//            $(".create-costsheet").removeClass('hide');
//            var index = 0;
//            $.each($(this).data("parameter"), function (key, value) {
//                createDynamicTextFields($me);
//                $($(".txtName")[index]).val(key);
//                $($(".txtValue")[index]).val(value);
//                index++;
//            });
//            $('html, body').animate({
//                scrollTop: $(".txtName:first").offset().top
//            }, 800);
//        });

//        // status update of costsheet
//        $(".lnkUpdateStatus").bind('click', function (e) {
//            e.stopImmediatePropagation();
//            if (window.user.isAdmin && confirm("You are going to change status to " + $(this).data("status") + ", sure?")) {
//                $.ajax({
//                    url: '/costsheets/' + $(this).data("id"),
//                    method: "PUT",
//                    data: { status: $(this).data("status") }
//                }).done(function (response) {
//                    window.location.reload();
//                });
//            }
//            return false;
//        });

//        $(".btnCancel").on('click', function () {
//            $(".pnlParameter").html("");
//            $(".create-costsheet").addClass('hide');
//        });

//        $(".btn-mail").on('click', function () {
//            if (window.user.isAdmin) {
//                $.ajax({
//                    url: '/costsheets/mail/' + $(this).data("id"),
//                    method: "POST",
//                }).done(function (response) {
//                    console.log("Mail sent successfully", response);
//                });
//            }
//        });

//        var bindCalculationEvent = function () {
//            /*********************************** RAW MATERIAL CALCULATION****************************************/
//            $(".ddlRawMaterial").on('change', function (e) {
//                var $me = $(this);
//                if ($(this).val() != "") {
//                    $me.parent().parent().find('.txtRate').val($me.find('option:selected').data("rate").toFixed(2));
//                    $me.parent().parent().find('.txtScrapRate').val($me.find('option:selected').data("scrap-rate").toFixed(2));
//                    $me.parent().parent().find('.txtScrapRecovery').val($me.find('option:selected').data("scrap-recovery").toFixed(2));

//                    calculateRmCost($me);
//                } else {
//                    $me.parent().parent().find('.txtRate').val('');
//                    $me.parent().parent().find('.txtScrapRate').val('');
//                    $me.parent().parent().find('.txtScrapRecovery').val('');
//                    $me.parent().parent().find('.txtRmCost').val('');
//                    $me.parent().parent().find('.txtNetRmCost').val('');
//                }
//                calculateProfitRmCost();
//                calculateProfitConversionCost();
//                calculateTotalProfit();
//                e.stopImmediatePropagation();
//            });

//            $(".txtCalculateCost").on('keyup', function () {
//                var $me = $(this);
//                if ($me.parents('.Rawmaterial').length)
//                    calculateRmCost($me);
//                if ($me.parents('.HtSt').length)
//                    calculateHtStCost($me);
//                if ($me.parents('.PackingAndForwarding').length)
//                    calculatePackingAndForwardingCost($me);
//            });

//            /*********************************** CONVERSION CALCULATION****************************************/

//            $(".ddlOperation").bind('change', function () {
//                var $me = $(this);
//                $me.parent().parent().find(".txtConversionRate").val('');
//                $me.parent().parent().find(".txtConversionEfficiency").val('');
//                $me.parent().parent().find(".txtConversionCost").val('');
//                calculateProfitRmCost();
//                calculateProfitConversionCost();
//                calculateTotalProfit();
//            });

//            $(".ddlMachine").on('change', function () {
//                var $me = $(this);
//                if ($me.val() != "") {
//                    $me.parent().parent().find(".txtConversionRate").val("Rs " + $me.find('option:selected').data("rate").toFixed(2));
//                    $me.parent().parent().find(".txtConversionEfficiency").val($me.find('option:selected').data("efficiency").toFixed(2) + "%");
//                    calculateConversionCost($me);
//                } else {
//                    $me.parent().parent().find(".txtConversionRate").val('');
//                    $me.parent().parent().find(".txtConversionEfficiency").val('');
//                    $me.parent().parent().find(".txtConversionCost").val('');
//                }
//                calculateProfitRmCost();
//                calculateProfitConversionCost();
//                calculateTotalProfit();
//            });

//            $(".txtCycleTime").on('keyup', function () {
//                $me = $(this);
//                calculateConversionCost($me);
//            });

//            /*********************************** HTST CALCULATION****************************************/
//            $(".ddlHtSt").on('change', function () {
//                var $me = $(this);
//                if ($me.val() != '') {
//                    $me.parent().parent().find(".txtHtStRate").val("Rs " + $me.find('option:selected').data("rate").toFixed(2));
//                }
//                else {
//                    $me.parent().parent().find(".txtHtStRate").val("");
//                }
//                calculateHtStCost($me);
//                calculateProfitRmCost();
//                calculateProfitConversionCost();
//                calculateTotalProfit();
//            });

//            $(".txtHtStRate").on('keyup', function () {
//                calculateHtStCost($me);
//                calculateProfitRmCost();
//                calculateProfitConversionCost();
//                calculateTotalProfit();
//            });

//            /*********************************** Packing & Forwarding CALCULATION****************************************/
//            $(".ddlPackingAndForwarding").on('change', function () {
//                var $me = $(this);
//                if ($me.val() != '') {
//                    $me.parent().parent().find(".txtPackingAndForwardingRate").val("Rs " + $me.find('option:selected').data("rate").toFixed(2));
//                }
//                else {
//                    $me.parent().parent().find(".txtPackingAndForwardingRate").val("");
//                }
//                calculatePackingAndForwardingCost($me);
//                calculateProfitRmCost();
//                calculateProfitConversionCost();
//                calculateTotalProfit();
//            });

//            $(".txtPackingAndForwardingRate").on('keyup', function () {
//                calculatePackingAndForwardingCost($me);
//                calculateProfitRmCost();
//                calculateProfitConversionCost();
//                calculateTotalProfit();
//            });

//            /***************************************TOTAL RM COST PROFIT****************************************************/
//            $(".txtInputRmCostProfit").on('keyup', function () {
//                calculateProfitRmCost();
//                calculateTotalProfit();
//            });

//            /***************************************TOTAL Converion COST PROFIT****************************************************/
//            $(".txtInputConversionCostProfit").on('keyup', function () {
//                calculateProfitConversionCost();
//                calculateTotalProfit();
//            });

//            /*********************************************Autogenerated value on key up********************************************************/
//            $(".txtAutogenerated").on('keyup', function () {
//                $me = $(this);
//                if ($me.parents('.Rawmaterial').length)
//                    calculateRmCost($me);
//                if ($me.parents('.Conversion').length)
//                    calculateConversionCost($me);
//                if ($me.parents('.HtSt').length)
//                    calculateHtStCost($me);
//                if ($me.parents('.PackingAndForwarding').length)
//                    calculatePackingAndForwardingCost($me);
//                calculateProfitRmCost();
//                calculateProfitConversionCost();
//                calculateTotalProfit();
//            });

//            $(".txtCostField").on('keyup', function () {
//                calculateTotalProfit();
//            });

//            $(".txtNetRmCost").on('keyup', function () {
//                var totalRmCost = 0;
//                $(".txtNetRmCost").each(function (key, value) {
//                    if ($(value).val() != "") {
//                        totalRmCost += parseFloat($(value).val().replace(/[^\d.]/g, ''));
//                    }
//                });
//                $('.txtTotalRmCost').val("Rs " + totalRmCost.toFixed(2)).trigger('keyup');
//            });

//            $(".txtConversionCost").on('keyup', function () {
//                var totalConversionCost = 0;
//                $(".txtConversionCost").each(function (key, value) {
//                    if ($(value).val() != "") {
//                        totalConversionCost += parseFloat($(value).val().replace(/[^\d.]/g, ''));
//                    }
//                });
//                $('.txtTotalConversionCost').val("Rs " + totalConversionCost.toFixed(2)).trigger('keyup');
//            });

//            $(".txtHtStCost").on('keyup', function () {
//                var totalHtStCost = 0
//                $(".txtHtStCost").each(function (key, value) {
//                    if ($(value).val() != "") {
//                        totalHtStCost += parseFloat($(value).val().replace(/[^\d.]/g, ''));
//                    }
//                });
//                $(".txtTotalHtStCost").val("Rs " + totalHtStCost.toFixed(2)).trigger('keyup');
//            });

//            $(".txtPackingAndForwardingCost").on('keyup', function () {
//                var totalPackingAndForwardingCost = 0
//                $(".txtPackingAndForwardingCost").each(function (key, value) {
//                    if ($(value).val() != "") {
//                        totalPackingAndForwardingCost += parseFloat($(value).val().replace(/[^\d.]/g, ''));
//                    }
//                });
//                $(".txtTotalPackingAndForwardingCost").val("Rs " + totalPackingAndForwardingCost.toFixed(2)).trigger('keyup');
//            });


//            $(".ddlParts").on('change', function () {
//                if ($(this).val()) {
//                    window.location.href = "/rfq/" + $(".hdnRfqId").val() + "/costsheet/prepare/" + $(this).val();
//                } else {
//                    $(".section-costsheet").hide();
//                }
//            });
//        },

//            bindRemoveRowEvent = function () {
//                $(".row-remove").bind('click', function () {
//                    var $target = $(this).parents('.removable-row');
//                    $target.hide('slow', function () {
//                        $target.remove();
//                        $(".txtNetRmCost").trigger('keyup');
//                        $(".txtConversionCost").trigger('keyup');
//                        $(".txtHtStCost").trigger('keyup');
//                    });
//                });
//            };

//        $(".lnkAddPanel").on('click', function (e) {
//            $me = $(this);
//            $.get($(this).data('url'), function (response) {
//                angular.element(document).injector().invoke(function ($compile) {
//                    var obj = $("." + $me.data('class')); // get wrapper
//                    var scope = obj.scope(); // get scope
//                    // generate dynamic content
//                    obj.append($compile(response)(scope));
//                    setTimeout(function () {
//                        bindCalculationEvent();
//                        bindRemoveRowEvent();
//                    }, 1000);
//                });
//            });
//            e.stopImmediatePropagation();
//        });

//        bindCalculationEvent();
//        bindRemoveRowEvent();
//        if ($(".hdnRfqId").length > 0 && $(".hdnRfqId").val() != "") {
//            clearInterval(loadCode);
//            $(".ng-hide").remove();

//            setTimeout(function () {
//                $(".hdnOperation").each(function () {
//                    if ($(this).val() != "") {
//                        $(this).parent().find(".ddlOperation").val($(this).val()).trigger('change');
//                        var $me = $(this);
//                        $me.parent().parent().find(".ddlMachine").val($me.parent().parent().find(".hdnMachine").val());
//                    }
//                });
//                $(".ddlMachine").trigger("change");
//                $(".ddlRawMaterial").trigger("change");
//                $(".ddlHtSt").trigger("change");
//                $(".ddlPackingAndForwarding").trigger("change");
//            }, 10000);
//        }
//    }, 500);
//});