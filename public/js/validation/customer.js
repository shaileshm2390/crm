function ValidateEmail(email) {
    var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return expr.test(email);
};
$(document).ready(function () {
    $(".btn-Save").on('click', function () {
        var flagEmail = false;
        var flagCompany = false;
        var flagName = false;
        var flagContact = false;

        //Email
        if ($.trim($(".txtEmail").val()).length == 0 ) {
            $(".errorEmail").html("Enter email please");
            flagEmail = false;
        }
        else if (!ValidateEmail($(".txtEmail").val())) {
            $(".errorEmail").html("Invalid email.please enter valid email id.");
            flagEmail = false;
        }
        else
        {
            flagEmail = true;
            $(".errorEmail").html("").hide();
        }

        //Company
        if ($.trim($(".txtCompany").val()).length == 0) {
            $(".errorCompany").html("Enter company name please");
            flagCompany = false;
        }
        else {
            flagCompany = true;
            $(".errorCompany").html("").hide();
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
        }
        else {
            flagContact = true;
            $(".errorContact").html("").hide();
        }

        return flagEmail && flagCompany && flagName && flagContact;
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

    $(".txtCompany").on("focusout", function () {
        if ($.trim($(".txtCompany").val()).length == 0) {
            $(".errorCompany").html("Enter company name please").show();
            flagCompany = false;
        }
        else {
            flagCompany = true;
            $(".errorCompany").html("").hide();
        }
    });

    $(".txtName").on("focusout", function () {
        if ($.trim($(".txtName").val()).length == 0) {
            $(".errorName").html("Enter name please").show();
            flagName = false;
        }
        else {
            flagName = true;
            $(".errorName").html("").hide();
        }
    });

    $(".txtContact").on("focusout", function () {
        if ($.trim($(".txtContact").val()).length == 0) {
            $(".errorContact").html("Enter contact number please").show();
            flagContact = false;
        }
        else {
            flagContact = true;
            $(".errorContact").html("").hide();
        }
    });
    //Name
    $(".txtName").on("keyup", function () {
        $(".errorName").html("");
        if ($.trim($(".txtName").val()).length == 0) {
            $(".errorName").html("Enter name please").show();
        }
    });

    //email
    $(".txtEmail").on("keyup", function () {
        $(".errorEmail").html("");
        if ($.trim($(".txtEmail").val()).length == 0) {
            $(".errorEmail").html("Enter email please").show();
        }
    });

    //company
    $(".txtCompany").on("keyup", function () {
        $(".errorCompany").html("");
        if ($.trim($(".txtCompany").val()).length == 0) {
            $(".errorCompany").html("Enter company name please").show();
        }
    });

    //contact
    $(".txtContact").on("keyup", function () {
        $(".errorContact").html("");
        if ($.trim($(".txtContact").val()).length == 0) {
            $(".errorContact").html("Enter contact number please").show();
        }
    });
});