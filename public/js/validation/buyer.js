function ValidateEmail(email) {
    var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return expr.test(email);
};

$(document).ready(function () {
    $(".btnSave").on('click', function () {

        var flagEmail = false;
        var flagName = false;
        var flagContact = false;

        //Email
        if ($.trim($(".txtEmail").val()).length == 0) {
            $(".errorEmail").html("Enter email please");
            flagEmail = false;
        }
        else if (!ValidateEmail($(".txtEmail").val())) {
            $(".errorEmail").html("Invalid email.please enter valid email id.");
            flagEmail = false;
        }
        else {
            flagEmail = true;
            $(".errorEmail").html("").hide();
        }

        //Name
        if ($.trim($(".txtName").val()).length == 0) {
            $(".errorName").html("Enter name please");
            flagName = false;
        }
        else {
            flagName = true;
            $(".errorName").html("").hide();
        }

        //Contact
        if ($.trim($(".txtContact").val()).length == 0) {
            $(".errorContact").html("Enter contact number please");
            flagContact = false;

        } else if ($.trim($(".txtContact").val()).length != 10) {
            $(".errorContact").html("Contact number should be of length 10.");
            flagContact = false;
        }
        else {
            flagContact = true;
            $(".errorContact").html("").hide();
        }

        return flagEmail && flagName && flagContact;

    });

    //Email
    $(".txtEmail").on("focusout", function () {

        if ($.trim($(".txtEmail").val()).length == 0) {
            $(".errorEmail").html("Enter email please").show();
            flagEmail = false;
        }
        else if (!ValidateEmail($(".txtEmail").val())) {
            $(".errorEmail").html("Invalid email.please enter valid email id.").show();
            flagEmail = false;
        }
        else {
            flagEmail = true;
            $(".errorEmail").html("").hide();
        }
    });

    $(".txtEmail").on("keyup", function () {
        $(".errorEmail").html("");
        if ($.trim($(".txtEmail").val()).length == 0) {
            $(".errorEmail").html("Enter email please.").show();
        }
        else if (!ValidateEmail($(".txtEmail").val())) {
            $(".errorEmail").html("Invalid email.please enter valid email id.");
           // flagEmail = false;
        }
    });

    //Name
    $(".txtName").on("focusout", function () {
        if ($.trim($(".txtName").val()).length == 0) {
            $(".errorName").html("Enter name please.").show();
            flagName = false;
        }
        else {
            flagName = true;
            $(".errorName").html("").hide();
        }
    });

    $(".txtName").on("keyup", function () {
        $(".errorName").html("");
        if ($.trim($(".txtName").val()).length == 0) {
            $(".errorName").html("Enter name please.").show();
        }
    });


    //Contact
    $(".txtContact").on("focusout", function () {
        if ($.trim($(".txtContact").val()).length == 0) {
            $(".errorContact").html("Enter contact number please.").show();
            flagContact = false;
        }
        else if ($.trim($(".txtContact").val()).length != 10) {
            $(".errorContact").html("Enter contact number of length 10 please").show();
            flagContact = false;
        }
        else {
            flagContact = true;
            $(".errorContact").html("").hide();
        }
    });

    $(".txtContact").on("keyup", function () {
        $(".errorContact").html("");
        if ($.trim($(".txtContact").val()).length == 0) {
            $(".errorContact").html("Enter contact number please.").show();
        }
        else if ($.trim($(".txtContact").val()).length != 10) {
            $(".errorContact").html("Enter contact number of length 10 please").show();
           // flagContact = false;
        }
    });
 
});