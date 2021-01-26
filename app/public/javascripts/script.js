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
        registerUser();
    });
    $("#filter-confirm").click(function (e) {
        e.preventDefault();
        applyFilter();
    });

    // Upload confirm
    $("#upload-confirm").click(function (e) {
        e.preventDefault();
        uploadContent();
    });
    $("#tags").keyup(function (e) {
        var code = e.keyCode || e.which;
        if(code == 13 && ($("input[value='"+$.trim($(this).val())+"']").length==0) && $('.removeTag').length <5 && $.trim($(this).val())!= '') { //Enter keycode
            $("#tags").before('<label class="d-inline-flex mr-1 mb-0" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;background: #f0f2f5;padding: 0px 8px;border-radius: 10px;font-size:12px;"> <input type="hidden" name="tags[]" value="'+$(this).val()+'"><span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">'+$(this).val()+'</span> <span class="ml-1 removeTag" style="cursor:pointer;font-weight:bold">x</span></label>')
            $(this).val('')
        
        }
    });

    $(document).on('change','.fileInput',function() {
        var files = this.files;
        var extension = files[0].name.match(/\.(.*)/);
        
        var nomeDoc = "";
        if(files[0].name.length >= 10){
            nomeDoc = files[0].name.substring(0,10)+'...'+extension[0] 
        }else{
            nomeDoc = files[0].name;
        }
        $(this).parent().find('.iSpan').html('<span >' + nomeDoc + '</span>');
        $(".remove-form-upload").css({"right": "-10px"});
    });
    $(document).on('change','.imgInput',function() {
        var files = this.files;
        var extension = files[0].name.match(/\.(.*)/);
        
        var nomeDoc = "";
        if(files[0].name.length >= 10){
            nomeDoc = files[0].name.substring(0,10)+'...'+extension[0]
        }else{
            nomeDoc = files[0].name;
        }
        $(this).parent().find('.imgSpan').html('<span >' + nomeDoc + '</span>');
    });
   
    $(document).on('click','.slider',function() {
        if($(".slider").css('background-color') == 'rgb(52, 58, 64)')
            $(".cImage").css({"font-weight": "normal"});
        else{
            $(".cImage").css({"font-weight": "bold"});

        }
   });
    $(document).on('click','.removeTag',function() {
        console.log($(this).parent())
        $(this).parent().remove();
   });
    // Add new form to upload
    $("#add-upload-form").click(function (e) {
        var block = `
            <div class="mr-3" style="display: flex;align-items: center;position: relative;">
                <label class="mb-0" >
                    <span class="iSpan" style="font-size:12px">
                        <i class="fas fa-folder-plus" style="height: 100%;font-size: 39px;line-height: 40px;"></i>
                    </span>    
                    <input class="d-none fileInput form-control-file" type="file" name="files" accept="application/x-zip-compressed" />
                </label>
                <span class="btn btn-danger remove-form-upload fas fa-times"  style="padding: 0;position: absolute;top: 0px;background: transparent;border: 0;right:-9px;color: red;font-size: 12px;"></span>
            </div>
            `;

        $(".form-uploads").append(block)
    });

    // Remove form from uploads
    $('#form-upload').on('click','.remove-form-upload',function() {
        $(this).parent().remove();
   });
});

function registerUser() {
    var data = $("#form-register").serializeArray();

    $.ajax(
        {
            type: "POST",
            enctype: "multipart/form-data",
            url: host + "/api/users",
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
                        displayErrors("#form-register", errors);
                    },
                });
            },
            error: function (errors) {
                displayErrors("#form-register", errors);
            },
        },
        false,
    );
}

function uploadContent() {
    var form = $('#form-upload')[0];
    console.log(form)

    var data = new FormData(form);
    //data.append("CustomField", "This is some extra data, testing");

    $.ajax(
        {
            type: "POST",
            url: host + "/api/resources",
            data: data,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data);
            },
            error: function (errors) {
                console.log(errors);
            },
        },
        false,
    );
}
function applyFilter(){
    var data = $("#form-filter").serializeArray();
    console.log(data)
    var htmlFeed = '';
    $.ajax(
        {
            type: "GET",
            enctype: "multipart/form-data",
            url: host + "/api/resources/filters",
            data: data,
            success: function (data) {
                console.log(data)

                data.forEach(element => {
                    htmlFeed += `<span> `+element.subject +`</span>`
                    
                })
                $('#feed').html(htmlFeed)
            },
            error: function (errors) {
                console.log(errors)
            },
        },
        false,
    );
}

function editProfile(username) {
    var data = $("#form-edit-profile").serializeArray();

    $.ajax(
        {
            type: "PUT",
            enctype: "multipart/form-data",
            url: `${host}/api/users/${username}`,
            data: data,
            success: function (data) {
                removeErrors(); // Remove errors
            },
            error: function (errors) {
                displayErrors("#form-edit-profile", errors);
            },
        },
        false,
    );
}

function deleteAccount(username) {
    $.ajax({
        type: "DELETE",
        url: `${host}/api/users/${username}`,
        success: function () {
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location = "/";
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function displayErrors(formId, errors) {
    $(formId).addClass("was-validated"); // Display red boxes
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
