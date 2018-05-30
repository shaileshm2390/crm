$(document).ready(function () {
    setTimeout(function () {

        var imagesArray = [];
        var rfqId;
        var selectedStatus;
        var imagesString;

        var myDropzone = new Dropzone('#myId', {
            url: "/samplesubmissionimages/"
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
                url: '/rfq/samplesubmissions/' + rfqId,
                method: "GET"
            }).done(function (response) {
                //console.log("ajax response to get sample submission by rfqId  -->  " + JSON.stringify(response) + rfqId);
                if ($.isEmptyObject(response)) {
                    console.log("response is empty");
                    $.ajax({
                        url: '/samplesubmissions/',
                        method: "POST",
                        data: { status: selectedStatus, imagesString: imagesString, RfqId: rfqId }
                    }).done(function (response) {
                        dfd.resolve(response);
                        $(".lblMsg").html("<span>Saved successfully !!!</span>").removeClass("hide");
                    });

                }
                else {
                    //console.log("response is not empty  " + selectedStatus);
                    $.ajax({
                        url: '/rfq/samplesubmissions/' + rfqId,
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

        $(".ddlSamplesubmission").val($(".hdnSamplesubmissionStatus").val());

    }, 500);
});