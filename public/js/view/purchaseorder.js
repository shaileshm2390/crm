$(document).ready(function () {
    
    var loadCode = setInterval(function () {

        var imagesArray = [];
        var rfqId;
        var selectedStatus;
        var imagesString;
       
        if ($(".elastislide").length > 0) {
            $(".elastislide").elastislide();
        }
        if ($(".elastislide1").length > 0) {
            $('.elastislide1').elastislide();
        }

        $(".ddlPurchaseorder").val($(".hdnPurchaseorderStatus").val());

        if ($(".hdnRfqId").length > 0 && $(".hdnRfqId").val() != "") {
            clearInterval(loadCode);
            var myDropzone = new Dropzone('#myId', {
                url: "/purchaseorderimages/"
            });

            myDropzone.on("success", function (file, response) {
                imagesArray.push(response.pathFromRoot);
            });

            $(".btn-Save").on('click', function (e) {
                $(".hdnImages").val(imagesArray.join(",")).trigger('change');
                rfqId = $(".hdnRfqId").val();
                imagesString = imagesArray.join(",");
                selectedStatus = $("#selectedStatus").val();
                $.ajax({
                    url: '/rfq/purchaseorders/' + rfqId,
                    method: "GET"
                }).done(function (response) {
                    if ($.isEmptyObject(response)) {
                        $.ajax({
                            url: '/purchaseorders/',
                            method: "POST",
                            data: { status: selectedStatus, imagesString: imagesString, RfqId: rfqId }
                        }).done(function (response) {
                            $(".lblMsg").html("<span>Saved successfully !!!</span>").removeClass("hide");
                        });

                    }
                    else {
                        $.ajax({
                            url: '/rfq/purchaseorders/' + rfqId,
                            method: "PUT",
                            data: { status: selectedStatus, imagesString: imagesString }
                        }).done(function (response) {
                        });
                    }
                    window.location.reload(true);
                });
                e.stopImmediatePropagation();
                return false;
            });
        }
    }, 500);
});
