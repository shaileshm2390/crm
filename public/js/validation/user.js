function ValidateEmail(email) {
    var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return expr.test(email);
};

$(document).ready(function () {
    $(".btn-Save").on('click', function () {

        var flagFName = false;
        var flagLName = false;
        var flagEmail = false;
        var flagContact = false;
        var flagPassword = false;
        var flagDepartment = false;

        //First Name
        if ($.trim($(".txtFName").val()).length == 0) {
            $(".errorFName").html("Enter first name please");
            flagFName = false;
        }
        else {
            flagFName = true;
            $(".errorFName").html("").hide();
        }

        //Last Name
        if ($.trim($(".txtLName").val()).length == 0) {
            $(".errorLName").html("Enter last name please");
            flagLName = false;
        }
        else {
            flagLName = true;
            $(".errorLName").html("").hide();
        }

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

        //Contact
        if ($.trim($(".txtContact").val()).length == 0) {
            $(".errorContact").html("Enter contact number please");
            flagContact = false;

        } else if ($.trim($(".txtContact").val()).length < 10) {
            $(".errorContact").html("Contact number should be of length 10.");
            flagContact = false;
        }
        else {
            flagContact = true;
            $(".errorContact").html("").hide();
        }

        //Password
        if ($.trim($(".txtPassword").val()).length == 0) {
            $(".errorPassword").html("Enter password please");
            flagPassword = false;

        } else if ($.trim($(".txtPassword").val()).length < 8) {
            $(".errorPassword").html("Pawword should be 8 digit in length.");
            flagPassword = false;
        }
        else {
            flagPassword = true;
            $(".errorPassword").html("").hide();
        }

        //Department
        if ($.trim($(".txtDepartment").val()).length == 0) {
            $(".errorDepartment").html("Select department name please");
            flagDepartment = false;
        }
        else {
            flagDepartment = true;
            $(".errorDepartment").html("").hide();
        }

        return flagFName && flagLName && flagEmail && flagContact, flagPassword, flagDepartment;
      
    });

    //First Name
    $(".txtFName").on("focusout", function () {
        if ($.trim($(".txtFName").val()).length == 0) {
            $(".errorFName").html("Enter first name please").show();
            flagFName = false;
        }
        else {
            flagFName = true;
            $(".errorFName").html("").hide();
        }
    });

    //Last Name
    $(".txtLName").on("focusout", function () {
        if ($.trim($(".txtLName").val()).length == 0) {
            $(".errorLName").html("Enter last name please").show();
            flagLName = false;
        }
        else {
            flagLName = true;
            $(".errorLName").html("").hide();
        }
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

    //Contact
    $(".txtContact").on("focusout", function () {
        if ($.trim($(".txtContact").val()).length == 0) {
            $(".errorContact").html("Enter contact number please").show();
            flagContact = false;
        }
        else if ($.trim($(".txtContact").val()).length < 10) {
            $(".errorContact").html("Enter contact number of length 10 please").show();
            flagContact = false;
        }
        else {
            flagContact = true;
            $(".errorContact").html("").hide();
        }
    });

    //Password
    $(".txtPassword").on("focusout", function () {
        if ($.trim($(".txtPassword").val()).length == 0) {
            $(".errorPassword").html("Enter password please").show();
            flagPassword = false;
        }
        else if ($.trim($(".txtPassword").val()).length < 8) {
            $(".errorPassword").html("Enter contact number of length 8 please").show();
            flagPassword = false;
        }
        else {
            flagPassword = true;
            $(".errorPassword").html("").hide();
        }
    });

    //Department
    $(".txtDepartment").on("focusout", function () {
        if ($.trim($(".txtDepartment").val()).length == 0) {
            $(".errorDepartment").html("Select department please").show();
            flagDepartment = false;
        }
        else {
            flagDepartment = true;
            $(".errorDepartment").html("").hide();
        }
    });
});