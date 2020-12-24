var host = "http://localhost:3000";

// Errors forms boostrasp
(function () {
    "use strict";
    window.addEventListener(
        "load",
        function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName("needs-validation");
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener(
                    "submit",
                    function (event) {
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add("was-validated");
                    },
                    false,
                );
            });
        },
        false,
    );
})();

$(document).ready(function () {
    $("#register-confirm").click(function (e) {
        e.preventDefault();

        var data = $("#form-register").serializeArray();

        $.ajax(
            {
                type: "POST",
                enctype: "multipart/form-data",
                url: host + "/api/auth/register",
                data: data,
                success: function (data) {
                    removeErrors(); // Remove errors

                    // Create cookie and login
                    $.ajax({
                        type: "POST",
                        enctype: "multipart/form-data",
                        url: host + "/auth/login",
                        data: data,
                        success: function (d) {
                            window.location = host;
                        },
                        error: function (errors) {
                            displayErrors(errors);
                        },
                    });
                },
                error: function (errors) {
                    displayErrors(errors);
                },
            },
            false,
        );
    });
});

function displayErrors(errors) {
    $("#form-register").addClass("was-validated"); // Display red boxes
    removeErrors(); // Remove errors
    errors.responseJSON.generalErrors.forEach((element) => {
        $("div ." + element.field).append('<span class="error-format">' + element.msg + "</span>");
    });
}

function removeErrors() {
    $("div .first_name .error-format").empty();
    $("div .last_name .error-format").empty();
    $("div .email .error-format").empty();
    $("div .institution .error-format").empty();
    $("div .username .error-format").empty();
    $("div .password .error-format").empty();
    $("div .confirm_password .error-format").empty();
}
