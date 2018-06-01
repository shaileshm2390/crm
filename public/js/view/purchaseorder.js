$(document).ready(function () {
    
    setTimeout(function () {

        var imagesArray = [];
        var rfqId;
        var selectedStatus;
        var imagesString;

        var myDropzone = new Dropzone('#myId', {
            url: "/purchaseorderimages/"
        });

        myDropzone.on("success", function (file, response) {
            imagesArray.push(response.pathFromRoot);
        });

        $(".btn-Save").on('click', function () {
            $(".hdnImages").val(imagesArray.join(",")).trigger('change');
            rfqId = $(".hdnRfqId").val();
            imagesString = $("#imagesString").val();
            selectedStatus = $("#selectedStatus").find("option:selected").text();
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
                        dfd.resolve(response);
                        $(".lblMsg").html("<span>Saved successfully !!!</span>").removeClass("hide");
                    });

                }
                else {
                    $.ajax({
                        url: '/rfq/purchaseorders/' + rfqId,
                        method: "PUT",
                        data: { status: selectedStatus, imagesString: imagesString }
                    }).done(function (response) {
                        //window.location.reload();
                    });
                }
                window.location.reload(true);
            });
            return false;
        });
        if ($(".elastislide").length > 0) {
            $(".elastislide").elastislide();
        }
        if ($(".elastislide1").length > 0) {
            $('.elastislide1').elastislide();
        }

        $(".ddlPurchaseorder").val($(".hdnPurchaseorderStatus").val());

    }, 500);
});
