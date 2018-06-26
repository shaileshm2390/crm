    $(document).ready(function () {
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
               
        var bindRemoveHeadingParameter = function () {
            $(".lnkHeadingRemove").on('click', function () {
                $(this).parent().parent().next().remove(".clearfix");
                $(this).parent().parent().next().remove("br");
                $(this).parent().parent().remove();

                if ($(".txtHeading").length == 0) {
                    $('.btnSubmit ').hide();
                } else {
                    $('.btnSubmit ').show();
                }
            });
        };

        bindRemoveParameter();
        bindRemoveHeadingParameter();
        var rfqId;

        var toTitleCase= function (str) {
            return str.replace(/(?:^|\s)\w/g, function (match) {
                return match.toUpperCase();
            });
        }

        var hdnQuotType, costSheetId;
        

        var createDynamicHeadingTextFields = function (callback) {

            var inputName = $("<input />", { class: 'txtHeading form-control', type: 'text', placeholder: 'Heading', required: 'required' });

            var divCol10Name = $('<div>', { class: 'col col-lg-10' }).html(inputName);
            var divCol2Space = $('<div>', { class: 'col col-lg-2' }).html('<a href="#" class="btn btn-outline-danger lnkHeadingRemove pull-right" title="remove row"><span><i class="fa fa-minus-circle"></i></span></a >');

            var divRow = $('<div>', { class: 'row' }).append(divCol10Name, divCol2Space);
            var divClear = $("<div>", { class: 'clear clearfix' });
            var breakLine = $("<br />");

            $(".pnlHeading").append(divRow, divClear, breakLine);
            bindRemoveHeadingParameter();
            typeof callback === 'function' && callback();
        };


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

        var createDynamicTableheading = function (callback) {
            var tr = $("<tr>");
            $.each($(".txtHeading"), function (key, value) { 
                var th = $("<th>").html(value);
                tr.append(th);
            });
            
            var table = $("<table>", { class: 'table table-hover table-quot' }).append(tr);
            $(".create-heading").hide();
            $(".pnlQuotTable").append(table).removeClass("hide");
            $(".lnkBackToHeadingCreation").on('click', function (e) {
                $(".pnlQuotTable").addClass("hide");
                $(".create-heading").show();
            });
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

        var loadCode = setInterval(function () {
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

                $(".lnkAddHeading").on('click', function () {
                    createDynamicHeadingTextFields();
                    if ($(".txtHeading").length == 0) {
                        $('.btnSubmit ').hide();
                    } else {
                        $('.btnSubmit ').show();
                    }
                    return false;
                });

                // save quotation to db
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
                        // save quotation
                        $.when(saveQuotation(JSON.stringify(nameValuePair), hdnQuotType, costSheetId)).then(function () {
                            //window.location.reload();
                            $(".pnlParameter, .lnkAdd, .btnSubmit").remove();
                        });

                    } else {
                        nameValuePair = {};
                    }
                    e.stopImmediatePropagation();
                    return false;
                });


                
                $(".btnSubmitHeading").on('click', function (e) {
                    var $me = $(this);
                    var headingField = [];
                    var totalRecord = $(".txtHeading").length;
                    var validField = [];

                    for (var index = 0; index < totalRecord; index++) {
                        if ($.trim($($(".txtHeading")[index]).val()) != "") {
                            headingField.push($($(".txtHeading")[index]).val());
                            $($(".txtHeading")[index]).css("border", "");
                            validField[index] = true;
                        }
                        else {
                            validField[index] = false;
                            if ($.trim($($(".txtHeading")[index]).val()) == "") {
                                $($(".txtHeading")[index]).css("border", "1px solid red");
                            } else {
                                $($(".txtHeading")[index]).css("border", "");
                            }                           
                        }
                    }
                    if ($.inArray(false, validField) < 0) {
                        createDynamicTableheading();
                    } else {
                        headingField = [];
                    }
                    e.stopImmediatePropagation();
                    return false;
                });

                $(".btnCancel").on('click', function () {
                    $(".pnlParameter").html("");
                    $(".create-costsheet").addClass('hide');
                });
                if ($(".hdnRfqId").length > 0 && $(".hdnRfqId").val() != "") {
                    clearInterval(loadCode);
                }
            }, 500);
    });
