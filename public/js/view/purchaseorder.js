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

            $(".ddlParts").on('change', function () {
                if ($(this).val()) {
                    window.location.href = "/rfq/" + $(".hdnRfqId").val() + "/purchaseorder/" + $(this).val();
                } else {
                    $(".purchaseOrderSection").hide();
                }
            });

            $(".btn-Save").on('click', function (e) {
                if (validPurchaseOrderForm()) {
                    $(this).html('<i class="fa fa-spinner fa-spin"></i>');
                    $(".hdnImages").val(imagesArray.join(",")).trigger('change');
                    rfqId = $(".hdnRfqId").val();
                    imagesString = imagesArray.join(",");
                    selectedStatus = $("#selectedStatus").val();
                    selectedApplication = $("#selectedApplication").val();
                    //$.ajax({
                    //    url: '/rfq/purchaseorders/' + rfqId + "?partId=" + $('.ddlParts').val(),
                    //    method: "GET"
                    //}).done(function (response) {
                    if ($('.hdnPurchaseorderId').val() === '') {
                            $.ajax({
                                url: '/purchaseorders/',
                                method: "POST",
                                data: { status: selectedStatus, imagesString: imagesString, RfqId: rfqId, application: selectedApplication, gstNum: $(".txtGSTNumber").val(), hsnNum: $(".txtHSNNumber").val(), RfqPartId: parseInt($('.ddlParts').val()) }
                            }).done(function (response) {
                                $(".lblMsg").html("<span>Saved successfully !!!</span>").removeClass("hide");
                            });

                        }
                        else {
                            $.ajax({
                                url: '/rfq/purchaseorders/' + rfqId + "?partId=" + $('.ddlParts').val(),
                                method: "PUT",
                                data: { status: selectedStatus, imagesString: imagesString, application: selectedApplication, gstNum: $(".txtGSTNumber").val(), hsnNum: $(".txtHSNNumber").val() }
                            }).done(function (response) {
                            });
                        }
                        //window.location.reload(true); 
                    //});
                }
                e.stopImmediatePropagation();
                window.location.href = '/rfq/' + $('.hdnRfqId').val() + '/purchaseorder/' + $('.ddlParts').val();
                return false;
            });
        }
    }, 500);
});
