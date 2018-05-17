$(document).ready(function () {
    $(".btn-Save").on('click', function () {
        if ($.trim($(".txtName").val()).length == 0) {
            $(".error").html("Enter name please");
            return false;
        }
        return true;
    });

    $(".txtName").on("keyup", function () {
        $(".error").html("");
        if ($.trim($(".txtName").val()).length == 0) {
            $(".error").html("Enter name please");
        }
    });
});