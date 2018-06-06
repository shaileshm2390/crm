//function ValidateEmail(email) {
//    var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
//    return expr.test(email);
//};

//$(document).ready(function () {
//    $(".btn-Save").on('click', function () {

//        var flagFName = false;
//        var flagLName = false;
//        var flagEmail = false;
//        var flagContact = false;
//        var flagPassword = false;
//        var flagDepartment = false;

//        //First Name
//        if ($.trim($(".txtFName").val()).length == 0) {
//            $(".errorFName").html("Enter first name please");
//            flagFName = false;
//        }
//        else {
//            flagFName = true;
//            $(".errorFName").html("").hide();
//        }

//        //Last Name
//        if ($.trim($(".txtLName").val()).length == 0) {
//            $(".errorLName").html("Enter last name please");
//            flagLName = false;
//        }
//        else {
//            flagLName = true;
//            $(".errorLName").html("").hide();
//        }

//        //Email
//        if ($.trim($(".txtEmail").val()).length == 0) {
//            $(".errorEmail").html("Enter email please");
//            flagEmail = false;
//        }
//        else if (!ValidateEmail($(".txtEmail").val())) {
//            $(".errorEmail").html("Invalid email.please enter valid email id.");
//            flagEmail = false;
//        }
//        else {
//            flagEmail = true;
//            $(".errorEmail").html("").hide();
//        }

//        //Contact
//        if ($.trim($(".txtContact").val()).length == 0) {
//            $(".errorContact").html("Enter contact number please");
//            flagContact = false;

//        } else if ($.trim($(".txtContact").val()).length != 10) {
//            $(".errorContact").html("Contact number should be of length 10.");
//            flagContact = false;
//        }
//        else {
//            flagContact = true;
//            $(".errorContact").html("").hide();
//        }

//        //Password
//        if ($.trim($(".txtPassword").val()).length == 0) {
//            $(".errorPassword").html("Enter password please");
//            flagPassword = false;

//        } else if ($.trim($(".txtPassword").val()).length != 8) {
//            $(".errorPassword").html("Pawword should be 8 digit in length.");
//            flagPassword = false;
//        }
//        else {
//            flagPassword = true;
//            $(".errorPassword").html("").hide();
//        }

//        //Department
//        if ($.trim($(".txtDepartment").val()).length == 0) {
//            $(".errorDepartment").html("Select department name please");
//            flagDepartment = false;
//        }
//        else {
//            flagDepartment = true;
//            $(".errorDepartment").html("").hide();
//        }

//        return flagFName && flagLName && flagEmail && flagContact, flagPassword, flagDepartment;
      
//    });

//    //First Name
//    $(".txtFName").on("focusout", function () {
//        if ($.trim($(".txtFName").val()).length == 0) {
//            $(".errorFName").html("Enter first name please.").show();
//            flagFName = false;
//        }
//        else {
//            flagFName = true;
//            $(".errorFName").html("").hide();
//        }
//    });

//    $(".txtFName").on("keyup", function () {
//        $(".errorFName").html("");
//        if ($.trim($(".txtFName").val()).length == 0) {
//            $(".errorFName").html("Enter first name please").show();
//        }
//    });

//    //Last Name
//    $(".txtLName").on("focusout", function () {
//        if ($.trim($(".txtLName").val()).length == 0) {
//            $(".errorLName").html("Enter last name please.").show();
//            flagLName = false;
//        }
//        else {
//            flagLName = true;
//            $(".errorLName").html("").hide();
//        }
//    });

//    $(".txtLName").on("keyup", function () {
//        $(".errorLName").html("");
//        if ($.trim($(".txtLName").val()).length == 0) {
//            $(".errorLName").html("Enter last name please.").show();
//        }
//    });

//    //Email
//    $(".txtEmail").on("focusout", function () {

//        if ($.trim($(".txtEmail").val()).length == 0) {
//            $(".errorEmail").html("Enter email please").show();
//            flagEmail = false;
//        }
//        else if (!ValidateEmail($(".txtEmail").val())) {
//            $(".errorEmail").html("Invalid email.please enter valid email id.").show();
//            flagEmail = false;
//        }
//        else {
//            flagEmail = true;
//            $(".errorEmail").html("").hide();
//        }
//    });

//    $(".txtEmail").on("keyup", function () {
//        $(".errorEmail").html("");
//        if ($.trim($(".txtEmail").val()).length == 0) {
//            $(".errorEmail").html("Enter email please.").show();
//        }
//        else if (!ValidateEmail($(".txtEmail").val())) {
//            $(".errorEmail").html("Invalid email.please enter valid email id.");
//            //flagEmail = false;
//        }
//    });

//    //Contact
//    $(".txtContact").on("focusout", function () {
//        if ($.trim($(".txtContact").val()).length == 0) {
//            $(".errorContact").html("Enter contact number please.").show();
//            flagContact = false;
//        }
//        else if ($.trim($(".txtContact").val()).length != 10) {
//            $(".errorContact").html("Enter contact number of length 10 please").show();
//            flagContact = false;
//        }
//        else {
//            flagContact = true;
//            $(".errorContact").html("").hide();
//        }
//    });

//    $(".txtContact").on("keyup", function () {
//        $(".errorContact").html("");
//        if ($.trim($(".txtContact").val()).length == 0) {
//            $(".errorContact").html("Enter contact number please.").show();
//        }
//        else if ($.trim($(".txtContact").val()).length != 10) {
//            $(".errorContact").html("Enter contact number of length 10 please").show();
//            //flagContact = false;
//        }
//    });

//    //Password
//    $(".txtPassword").on("focusout", function () {
//        if ($.trim($(".txtPassword").val()).length == 0) {
//            $(".errorPassword").html("Enter password please.").show();
//            flagPassword = false;
//        }
//        else if ($.trim($(".txtPassword").val()).length != 8) {
//            $(".errorPassword").html("Enter contact number of length 8 please").show();
//            flagPassword = false;
//        }
//        else {
//            flagPassword = true;
//            $(".errorPassword").html("").hide();
//        }
//    });

//    $(".txtPassword").on("keyup", function () {
//        $(".errorPassword").html("");
//        if ($.trim($(".txtPassword").val()).length == 0) {
//            $(".errorPassword").html("Enter password please.").show();
//        }
//        else if ($.trim($(".txtPassword").val()).length != 8) {
//            $(".errorPassword").html("Enter contact number of length 8 please").show();
//            //flagPassword = false;
//        }
//    });

//    //Department
//    $(".txtDepartment").on("focusout", function () {
//        if ($.trim($(".txtDepartment").val()).length == 0) {
//            $(".errorDepartment").html("Select department please.").show();
//            flagDepartment = false;
//        }
//        else {
//            flagDepartment = true;
//            $(".errorDepartment").html("").hide();
//        }
//    });

//    $(".txtDepartment").on("change", function () {
//        $(".errorDepartment").html("");
//        if ($.trim($(".txtDepartment").val()).length == 0) {
//            $(".errorDepartment").html("Select department please.").show();
//        }
//    });
//});

// Wait for the DOM to be ready
setTimeout(function () {
    $(document).ready(function () {

        $(".myForm").validate({
            // Specify validation rules
            rules: {
                // The key name on the left side is the name attribute
                // of an input field. Validation rules are defined
                // on the right side
                firstname: {
                    required: true
                },
                lastname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 5
                },
                contact: {
                    required: true,
                    minlength: 10,
                    maxlength: 10
                },
                dropdown: {
                    required: true
                },
                //departmet
                name: {
                    required: true
                },
                //company
                company: {
                    required: true
                }
            },
            // Specify validation error messages
            messages: {
                firstname: "Please enter your firstname",
                lastname: "Please enter your lastname",
                password: {
                    required: "Please provide a password",
                    minlength: "Your password must be at least 5 characters long"
                },
                email: "Please enter a valid email address",
                contact: {
                    required: "Please enter your contact number",
                    minlength: "Your contact number must be of 10 digit.",
                    maxlength: "Your contact number must be less than 10 digit."
                },
                dropdown: "Please select any value from dropdown.",
                //departmet
                name: "Please enter name.",
                company: "Please enter company name"
            },

            // Make sure the form is submitted to the destination defined
            // in the "action" attribute of the form when valid

            //submitHandler: function (form) {
            //    console.log("my form  ->  " + form);
            //    form.submit();
            //}
        });
        // Initialize form validation on the registration form.
        // It has the name attribute "registration"
        $(".btn-Save").bind('click', function () {
            return $(".myForm").valid();
        });
    });
},2000);