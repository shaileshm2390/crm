$(document).ready(function () {
    var validPurchaseOrderForm = function () {
        var flagGST = false, flagHSN = false;
        if ($.trim($(".txtGSTNumber").val()) != "") {
            flagGST = true;
            $(".txtGSTNumber").css("border", "");
        }
        else {
            flagGST = false;
            $(".txtGSTNumber").css("border", "1px solid red");
        };

        if ($.trim($(".txtHSNNumber").val()) != "") {
            flagHSN = true;
            $(".txtHSNNumber").css("border", "");
        }
        else {
            flagHSN = false;
            $(".txtHSNNumber").css("border", "1px solid red");
        };
        return flagGST && flagHSN;
    }
    var loadCode = setInterval(function () {
        $(".datepicker").datepicker({ format: 'dd/mm/yyyy' });
        var imagesArray = [];
        var rfqId;
        var selectedStatus;
        var selectedApplication;
        var imagesString;

        if ($(".elastislide").length > 0) {
            $(".elastislide").elastislide();
        }
        if ($(".elastislide1").length > 0) {
            $('.elastislide1').elastislide();
        }

        var getApprovedCostsheetByRfiIdAndPartId = function (partId) {
            var dfd = $.Deferred();
            $.ajax({
                url: '/rfq/costsheets/approved/' + $(".hdnRfqId").val() + "?partId=" + partId,
                method: "GET"
            }).done(function (response) {
                dfd.resolve(response);
            });
            return dfd.promise();
        },

            getApprovedCustomerCostsheetByRfiIdAndPartId = function (partId) {
                var dfd = $.Deferred();
                $.ajax({
                    url: '/rfq/costsheets/customer/' + $(".hdnRfqId").val() + "?partId=" + partId,
                    method: "GET"
                }).done(function (response) {
                    dfd.resolve(response);
                });
                return dfd.promise();
            },

            bindCostsheetDetails = function (result) {
                var strHtml = "";
                for (var i = 0; i <= result.length; i++) {
                    $.each(result[i], function (key, value) {
                        strHtml += "<div class='row' class='m-t-20 font-weight-bold'><div class='col col-lg-6'> <label>" + key + "</label></div ><div class='col col-lg-6'>" + value + "</div></div><hr />";
                    });
                }
                return strHtml;
            };

        $(".ddlPurchaseorder").val($(".hdnPurchaseorderStatus").val());
        $(".ddlApplication").val($(".hdnPurchaseorderApplication").val());

        if ($(".hdnRfqId").length > 0 && $(".hdnRfqId").val() != "") {
            clearInterval(loadCode);
            var myDropzone = new Dropzone('#myId', {
                url: "/purchaseorderimages/"
            });

            myDropzone.on("success", function (file, response) {
                imagesArray.push(response.pathFromRoot);
            });

            $(".btn-Save").on('click', function (e) {
                if (validPurchaseOrderForm()) {
                    var POPartDeatils = [];
                    $(this).html('<i class="fa fa-spinner fa-spin"></i>');
                    $(".hdnImages").val(imagesArray.join(",")).trigger('change');
                    rfqId = $(".hdnRfqId").val();
                    imagesString = imagesArray.join(",");
                    selectedStatus = $("#selectedStatus").val();
                    selectedApplication = $("#selectedApplication").val();
                    $('table.tblParts tbody tr').each(function (key, item) {
                        var itemObj = {};
                        var sampleSubmissionTargetDate, developerTargetDate;
                        if ($(item).find('.txtsampleSubmissionTargetDate').val() != "") {
                            var dateSplit = $(item).find('.txtsampleSubmissionTargetDate').val().split("/");
                            sampleSubmissionTargetDate = dateSplit[2] + "-" + dateSplit[1] + "-" + dateSplit[0] + " 00:00:00";
                        }
                        if ($(item).find('.txtdeveloperTargetDate').val() != "") {
                            var dateSplit = $(item).find('.txtdeveloperTargetDate').val().split("/");
                            developerTargetDate = dateSplit[2] + "-" + dateSplit[1] + "-" + dateSplit[0] + " 00:00:00";
                        }

                        itemObj.RfqId = $(".hdnRfqId").val();
                        itemObj.RfqPartId = $(item).attr('data-id');
                        itemObj.sampleSubmissionTargetDate = sampleSubmissionTargetDate;
                        itemObj.developerTargetDate = developerTargetDate;
                        POPartDeatils.push(itemObj);
                    });
                    
                    console.log("POPartDeatils" + POPartDeatils);
                    if ($('.hdnPurchaseorderId').val() === '') {
                            $.ajax({
                                url: '/purchaseorders/',
                                method: "POST",
                                data: { status: selectedStatus, imagesString: imagesString, RfqId: rfqId, application: selectedApplication, gstNum: $(".txtGSTNumber").val(), hsnNum: $(".txtHSNNumber").val(), isClosed: $('.chkIsClose').prop("checked"), reason: $('.txtReason').val(), POPartDeatils: JSON.stringify(POPartDeatils)}
                            }).done(function (response) {
                                $(".lblMsg").html("<span>Saved successfully !!!</span>").removeClass("hide");
                            });

                        }
                        else {
                            $.ajax({
                                url: '/rfq/purchaseorders/' + rfqId,
                                method: "PUT",
                                data: { status: selectedStatus, imagesString: imagesString, application: selectedApplication, gstNum: $(".txtGSTNumber").val(), hsnNum: $(".txtHSNNumber").val(), isClosed: $('.chkIsClose').prop("checked"), reason: $('.txtReason').val(), POPartDeatils: JSON.stringify(POPartDeatils) }
                            }).done(function (response) {
                            });
                        }
                        window.location.reload(true); 
                    
                }
                e.stopImmediatePropagation();
                //window.location.href = '/rfq/' + $('.hdnRfqId').val() + '/purchaseorder';
                return false;
            });

            $(".viewApprovedCostsheet").on('click', function () {
                var $me = $(this);
                $.when(getApprovedCostsheetByRfiIdAndPartId($me.attr('data-id'))).then(function (response) {
                    //console.log("response = " + response.length);
                    if (response.length > 0 && response[0].id > 0) {
                        $('.costsheetUserDetails').html(response[0].User.firstName + ' ' + response[0].User.lastName);
                        $('.costsheetUserEmail').html(response[0].User.email);
                        $('.costsheetcreatedAt').html("<i> - " + response[0].createdAt + "</i>");
                        $('.costsheetData').html(bindCostsheetDetails(response[0].data));
                        $('.pnlRecord').removeClass("d-none");
                        $('.lblNotFoundMsg').addClass("d-none");
                        return true;
                    } else {
                        $('.pnlRecord').addClass("d-none");
                        $('.lblNotFoundMsg').removeClass("d-none");
                        return false;
                    }

                });
            });

            $(".viewCustomerCostsheet").on('click', function () {
                var $me = $(this);
                $.when(getApprovedCustomerCostsheetByRfiIdAndPartId($me.attr('data-id'))).then(function (response) {
                    //console.log("response = " + response.length);
                    if (response.length > 0 && response[0].id > 0) {
                        $('.customerCostsheetUserDetails').html(response[0].User.firstName + ' ' + response[0].User.lastName);
                        $('.customerCostsheetUserEmail').html(response[0].User.email);
                        $('.customerCostsheetcreatedAt').html("<i> - " + response[0].createdAt + "</i>");
                        $('.customerCostsheetData').html(bindCostsheetDetails(response[0].data));
                        $('.pnlRecord').removeClass("d-none");
                        $('.lblNotFoundMsg').addClass("d-none");
                        return true;
                    } else {
                        $('.pnlRecord').addClass("d-none");
                        $('.lblNotFoundMsg').removeClass("d-none");
                        return false;
                    }

                });
            });
        }
    }, 500);
});
