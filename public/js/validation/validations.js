angular.element(document).ready(function () {

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
                },
                date: {
                    required: true,
                    date: true
                },
                rate: {
                    required: true
                },
                material: {
                    required: true
                },
                scrapRate: {
                    required: true
                },
                scrapRecovery: {
                    required: true
                },
                operation: {
                    required: true
                },
                machine: {
                    required: true
                },
                efficiency: {
                    required: true
                },
                parameter: {
                    required: true
                },
                details: {
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
                company: "Please enter company name",
                date: {
                    required: "Please select any date from date picker.",
                    date: "Can contain digits only"
                },
                rate: "Please enter rate.",
                material: "Please enter material.",
                scrapRate: "Please enter scrap rate.",
                scrapRecovery: "Please enter scrap recovery in %.",
                machine: "Please enter machine name.",
                operation: "Please enter operation.",
                efficiency: "Please enter efficiency.",
                parameter: "Please enter parameter.",
                details: "Please enter details.",

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
            //console.log($(".myForm").valid());
            return $(".myForm").valid();
        });
    });