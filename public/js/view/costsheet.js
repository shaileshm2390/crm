﻿    $(document).ready(function () {
        var bindRemoveParameter = function () {
            $(".lnkRemove").on('click', function () {
                $(this).parent().parent().next().remove(".clearfix");
                $(this).parent().parent().next().remove("br");
                $(this).parent().parent().remove();

                if ($(".txtName").length == 0) {
                    $('.btnSubmit ').hide();
                } else {
                    $('.btnSubmit ').show();
                }
            });
        };
        bindRemoveParameter();
        var rfqId;

        var toTitleCase= function (str) {
            return str.replace(/(?:^|\s)\w/g, function (match) {
                return match.toUpperCase();
            });
        }

        var hdnQuotType, costSheetId;
        
        var createDynamicTextFields = function (callback) {

            var inputName = $("<input />", { class: 'txtName form-control', type: 'text', placeholder: 'Name', required: 'required' });
            var inputValue = $("<input />", { class: 'txtValue form-control', type: 'text', placeholder: 'Value', required: 'required' });

            var divCol5Name = $('<div>', { class: 'col col-lg-5' }).html(inputName);
            var divCol5Value = $('<div>', { class: 'col col-lg-5' }).html(inputValue);
            var divCol2Space = $('<div>', { class: 'col col-lg-2' }).html('<a href="#" class="btn btn-outline-danger lnkRemove pull-right" title="remove row"><span><i class="fa fa-minus-circle"></i></span></a >');

            var divRow = $('<div>', { class: 'row' }).append(divCol5Name, divCol5Value, divCol2Space);
            var divClear = $("<div>", { class: 'clear clearfix' });
            var breakLine = $("<br />");

            $(".pnlParameter").append(divRow, divClear, breakLine);
            bindRemoveParameter();
            typeof callback === 'function' && callback();
        };

        //ajax call to save qoute         
        var saveQuotation = function (data, quotType, costSheetId) {
            var dfd = $.Deferred();
            console.log({ UserId: window.user.id, data: data, RfqId: rfqId, type: quotType, CostSheetId: costSheetId });
            $.ajax({
                url: '/quotations/',
                method: "POST",
                data: { UserId: window.user.id, data: data, RfqId: rfqId, type: quotType, CostSheetId: costSheetId }
            }).done(function (response) {
                dfd.resolve(response);
                $(".lblMsg").html("<span>Saved successfully !!!</span>").removeClass("hide");
            });
            return dfd.promise();
        };

        // ajax call to save cost sheet
        var saveCostSheet = function (data) {
            var dfd = $.Deferred();
            $.ajax({
                url: '/costsheets/',
                method: "POST",
                data: { UserId: window.user.id, data: data, RfqId: rfqId, status: window.user.isAdmin ? "approved" : "pending" }
            }).done(function (response) {
                dfd.resolve(response);
                $(".lblMsg").html("<span>Saved successfully !!!</span>").removeClass("hide");
            });
            return dfd.promise();
        };

        setTimeout(
            function () {
                rfqId = $(".hdnRfqId").val();

                if ($(".quotType").length) {
                    var arr = window.location.href.split("/")
                    if (arr.length > -1) {
                        hdnQuotType = $(".hdnQuotType").val();
                        costSheetId = $(".hdnCostSheetId").val();
                        $(".quotType").html(toTitleCase(arr[arr.length - 1]));
                    }
                }

                // slider of images
                if ($(".elastislide").length > 0) {
                    $('.elastislide').elastislide();
                }
                // add dynamic fields to DOM
                $(".lnkAdd").on('click', function () {
                    createDynamicTextFields();
                    if ($(".txtName").length == 0) {
                        $('.btnSubmit ').hide();
                    } else {
                        $('.btnSubmit ').show();
                    }
                    return false;
                });

                // save cost sheet to db
                $(".btnSubmit").on('click', function (e) {
                    var $me = $(this);
                    var nameValuePair = {};
                    var totalRecord = $(".txtName").length;
                    var validField = [];

                    for (var index = 0; index < totalRecord; index++) {
                        if ($.trim($($(".txtName")[index]).val()) != "" && $.trim($($(".txtValue")[index]).val())) {
                            nameValuePair[$($(".txtName")[index]).val()] = $($(".txtValue")[index]).val();
                            $($(".txtName")[index]).css("border", "");
                            $($(".txtValue")[index]).css("border", "");
                            validField[index] = true;
                        }
                        else {
                            validField[index] = false;
                            if ($.trim($($(".txtName")[index]).val()) == "") {
                                $($(".txtName")[index]).css("border", "1px solid red");
                            } else {
                                $($(".txtName")[index]).css("border", "");
                            }
                            if ($.trim($($(".txtValue")[index]).val()) == "") {
                                $($(".txtValue")[index]).css("border", "1px solid red");
                            } else {
                                $($(".txtValue")[index]).css("border", "");
                            }
                        }
                    }
                    if ($.inArray(false, validField) < 0) {
                        if ($me.hasClass('btnQuotGeneration')) {
                            // save quotation
                            $.when(saveQuotation(JSON.stringify(nameValuePair), hdnQuotType, costSheetId)).then(function () {
                                //window.location.reload();
                                $(".pnlParameter, .lnkAdd, .btnSubmit").remove();
                            });
                        } else {
                            // save costsheet
                            $.when(saveCostSheet(JSON.stringify(nameValuePair))).then(function () {
                                window.location.reload();
                            });
                        }
                      
                    } else {
                        nameValuePair = {};
                    }
                    e.stopImmediatePropagation();
                    return false;
                });

                // copy data to modified it
                $(".btn-update").on('click', function () {
                    console.log($(this).data("parameter"));        
                    $(".pnlParameter").html("");
                    $(".create-costsheet").removeClass('hide');
                    var index = 0;
                    $.each($(this).data("parameter"), function (key, value) {
                        createDynamicTextFields();
                        $($(".txtName")[index]).val(key);
                        $($(".txtValue")[index]).val(value);
                        index++;
                    });
                    $('html, body').animate({
                        scrollTop: $(".txtName:first").offset().top
                    }, 800);
                });

                // status update of costsheet
                $(".lnkUpdateStatus").bind('click', function (e) {
                    if (confirm("You are going to change status to " + $(this).data("status") + ", sure?")) {
                        $.ajax({
                            url: '/costsheets/' + $(this).data("id"),
                            method: "PUT",
                            data: { status: $(this).data("status") }
                        }).done(function (response) {
                            window.location.reload();
                        });
                    }
                    return false;
                });

                $(".btnCancel").on('click', function () {
                    $(".pnlParameter").html("");
                    $(".create-costsheet").addClass('hide');
                });

                $(".btn-mail").on('click', function () {
                    $.ajax({
                        url: '/costsheets/mail/' + $(this).data("id"),
                        method: "POST",                        
                    }).done(function (response) {
                        console.log("Mail sent successfully", response);
                    });
                });
            }, 500);
    });
