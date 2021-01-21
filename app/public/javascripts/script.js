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

    // Upload confirm
    $("#upload-confirm").click(function (e) {
        e.preventDefault();
        uploadContent();
    });

    // Add new form to upload
    $("#add-upload-form").click(function (e) {
        var block = `
            <div>
                <label for="formFile">
                    Example file input
                    <input class="form-control-file" id="formFile" type="file" name="files" />
                </label>
                <span class="btn btn-danger remove-form-upload">-</span>
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
    var data = new FormData(form);
    //data.append("CustomField", "This is some extra data, testing");

    $.ajax(
        {
            type: "POST",
            enctype: "multipart/form-data",
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

/* Resource Feed */

var limitGetResource = 5;
var skipGetResource = 0;
var counterGetResource = 0;
var totalResource = 0;

if (location.pathname == "/")
    getResource();

window.addEventListener('scroll', () => {
	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	
	if(clientHeight + scrollTop >= scrollHeight - 5) {
		// show the loading animation
		showLoading();
	}
});

function showLoading() {
	document.querySelector('.loading').classList.add('show');
	
	// load more data
	setTimeout(getResource, 1000)
}

async function getResource() {
    counterGetResource++;
    skipGetResource = (counterGetResource == 1 ? 0 : skipGetResource + 5);

    if (skipGetResource <= totalResource) {
        const resourceResponse = await fetch(host + "/api/resources?skip=" + skipGetResource + "&lim=" + limitGetResource);
        const resourceData = await resourceResponse.json();
        const data = { resource: resourceData };
        totalResource = 2; /// !!!!!!! PRECISO DO TOTAL
        
        addDataToDOM(data);
    }
    else
        document.querySelector('.loading').classList.remove('show');
}

function addDataToDOM(data) {

    if (data.resource.length == 0) {
        $(".feed").append(`
            <div class='without-resources-box'>
                <p class='without-resources'> No resources yet! Be the first to post!</p>
                <a href="#">Here!</a>
            </div>`);
    }
    else { 
        data.resource.forEach(element => {
            const resourceElement = document.createElement('div');
            resourceElement.classList.add('resource-post');
    
            resourceElement.innerHTML = `
                <div class="resource-user-info">
                    <img src="../images/${element.image}" alt="${element.image}" />
                    <span>${element.author.name}</span>
                </div>
                <div class="resource-rating"><i class="fa fa-star"></i>/${element.rating.votes} Votes</div>
                <p class="resource-type-year">${element.type} - ${element.year}</p>
                <a class="resource-link" href="resource/${element._id}">
                    <h2 class="resource-title">${element.subject}</h2>
                    <p class="resource-description">${element.description}</p>
                </a>
                <p class="resource-tags">
                    ${Object.keys(element.tags).map(function (key) {
                        return "<a href='#" + element.tags[key] + "'" + ">#" + element.tags[key] + "</a>"      
                    }).join(" ")}
                </p>
            `;
            document.getElementById("feed").append(resourceElement);
        });        
    }
    document.querySelector('.loading').classList.remove('show');
}