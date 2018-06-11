$(document).ready(function () {

    var isValidForm = function () {
        var flagTargetDate = false,
            flagStartDate = false,
            flagStatus = false,
            isValidDateRange = true;

        if ($(".ddlSamplesubmission").val() == "") {
            $(".errorStatus").html("please select status").show("slow");
        } else {
            flagStatus = true;
            $(".errorStatus").html("").hide();
        }

        if ($.trim($("#sampleStatusStartDate").val()).length == 0) {
            $(".errorStartDate").html("please select start date").show("slow");

        } else {
            flagStartDate = true;
            $(".errorStartDate").hide().html("");
        }

        if ($.trim($("#sampleStatusTargetDate").val()).length == 0) {
            $(".errorDate").html("please select target date").show("slow");

        } else {
            flagTargetDate = true;
            $(".errorDate").hide().html("");
        }

        if ($.trim($("#sampleStatusStartDate").val()).length > 0 && $.trim($("#sampleStatusTargetDate").val()).length > 0) {
            if (new Date($("#sampleStatusStartDate").val()) > new Date($("#sampleStatusTargetDate").val())) {//compare end <=, not >=
                $(".errorStartDate").html("start date should be lesser than target date").show("slow");
                isValidDateRange = false;
            } else {
                $(".errorStartDate").hide().html("");
                isValidDateRange = true;
            }
        }

        return flagStartDate && flagTargetDate && flagStatus && isValidDateRange;
    },
        imagesArray = [],
        rfqId,
        process,
        status,
        imagesString;

    setTimeout(function () {


        $(".btnChangeStatus").on("click", function () {
            $(".pnlStatusUpdate").toggle();
            $(".btnChangeStatus").text(($(".pnlStatusUpdate:visible").length ? "Cancel" : "Add Process"));
        });

        $(".datepicker").datepicker();

        var myDropzone = new Dropzone('#myId', {
            url: "/samplesubmissionimages/"
        });

        myDropzone.on("success", function (file, response) {
            imagesArray.push(response.pathFromRoot);
        });

        $(".btn-Save").on('click', function () {
            if (isValidForm()) {

                $(".hdnImages").val(imagesArray.join(",")).trigger('change');
                rfqId = $(".hdnRfqId").val();
                imagesString = $("#imagesString").val();
                targetDate = $("#sampleStatusTargetDate").val();
                startDate = $("#sampleStatusStartDate").val();
                status = "To do";
                process = $("#selectedStatus").find("option:selected").text();
                $.ajax({
                    url: '/rfq/samplesubmissions/' + rfqId,
                    method: "GET"
                }).done(function (response) {
                    if ($.isEmptyObject(response)) {
                        $.ajax({
                            url: '/samplesubmissions/',
                            method: "POST",
                            data: { process: process, status: status, startDate: startDate, targetDate: targetDate, imagesString: imagesString, RfqId: rfqId }
                        }).done(function (response) {
                            dfd.resolve(response);
                            $(".lblMsg").html("<span>Saved successfully !!!</span>").removeClass("hide");
                        });

                    }
                    else {
                        $.ajax({
                            url: '/rfq/samplesubmissions/' + rfqId,
                            method: "PUT",
                            data: { process: process, status: status, startDate: startDate, targetDate: targetDate, imagesString: imagesString }
                        }).done(function (response) {
                            window.location.reload();
                        });
                    }
                    window.location.reload(true);
                });
            }
            return false;
        });

        if ($(".elastislide").length > 0) {
            $(".elastislide").elastislide();
        }
        if ($(".elastislide1").length > 0) {
            $('.elastislide1').elastislide();
        }

        //$(".ddlSamplesubmission").val($(".hdnSamplesubmissionStatus").val());

        if ($(".hdnUserId").val() != "") {
            $(".ddlUser option[selected]").remove();
            $(".ddlUser").val($(".hdnUserId").val());
        }
    }, 500);
});