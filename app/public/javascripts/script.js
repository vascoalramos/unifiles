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
    $("#login-confirm").click(function (e) {
        e.preventDefault();
        loginUser();
    });

    $("#register-confirm").click(function (e) {
        e.preventDefault();
        registerUser();
    });

    $("#filter-confirm").click(function (e) {
        e.preventDefault();
        applyFilter();
    });

    $("#recover-password-confirm").click(function (e) {
        e.preventDefault();
        recoverPassword();
    });

    $("#recover-password-update-confirm").click(function (e) {
        e.preventDefault();
        confirmRecoverPassword();
    });

    // Upload confirm
    $("#upload-confirm").click(function (e) {
        e.preventDefault();
        uploadContent();
    });

    $("#tags").keyup(function (e) {
        var code = e.keyCode || e.which;
        if (
            code == 13 &&
            $("input[value='" + $.trim($(this).val()) + "']").length == 0 &&
            $(".removeTag").length < 5 &&
            $.trim($(this).val()) != ""
        ) {
            //Enter keycode
            $("#tags").before(
                '<label class="d-inline-flex mr-1 mb-0" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;background: #f0f2f5;padding: 0px 8px;border-radius: 10px;font-size:12px;"> <input type="hidden" name="tags[]" value="' +
                    $(this).val() +
                    '"><span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' +
                    $(this).val() +
                    '</span> <span class="ml-1 removeTag" style="cursor:pointer;font-weight:bold">x</span></label>',
            );
            $(this).val("");
        }
    });

    $(document).on("change", ".fileInput", function () {
        var files = this.files;
        var extension = files[0].name.match(/\.(.*)/);

        var nomeDoc = "";
        if (files[0].name.length >= 10) {
            nomeDoc = files[0].name.substring(0, 10) + "..." + extension[0];
        } else {
            nomeDoc = files[0].name;
        }
        $(this)
            .parent()
            .find(".iSpan")
            .html("<span >" + nomeDoc + "</span>");
        $(".remove-form-upload").css({ right: "-10px" });
    });

    $(document).on("change", ".imgInput", function () {
        var files = this.files;
        var extension = files[0].name.match(/\.(.*)/);

        var nomeDoc = "";
        if (files[0].name.length >= 10) {
            nomeDoc = files[0].name.substring(0, 10) + "..." + extension[0];
        } else {
            nomeDoc = files[0].name;
        }
        $(this)
            .parent()
            .find(".imgSpan")
            .html("<span >" + nomeDoc + "</span>");
    });

    $(document).on("click", ".slider", function () {
        if ($(".slider").css("background-color") == "rgb(52, 58, 64)") $(".cImage").css({ "font-weight": "normal" });
        else {
            $(".cImage").css({ "font-weight": "bold" });
        }
    });

    $(document).on("click", ".removeTag", function () {
        $(this).parent().remove();
    });

    $(document).on("click", "#comment-confirm", function (e) {
        e.preventDefault();
        replyCommentResource("form-add-comment");
    });

    $(document).on("click", "#reply-comment-confirm", function (e) {
        e.preventDefault();
        replyCommentResource($(this).parent().parent().parent().parent().attr("id"));
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

        $(".form-uploads").append(block);
    });

    // Remove form from uploads
    $("#form-upload").on("click", ".remove-form-upload", function () {
        $(this).parent().remove();
    });

    // Click on the stars
    $(".rating").on("click", "input:radio[name=rating]", function () {
        applyRating($('input:radio[name=rating]:checked').val())
    });
});

function applyRating(value) {
    var _id = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
    var data = { rating: value, resource_id: _id }
    $.ajax(
        {
            type: "PUT",
            enctype: "multipart/form-data",
            url: host + "/api/resources/comments/rating",
            data: data,
            success: function (result) {
                $(".rating").children().bind('click', function(){ return false; }); // lock rating
            },
            error: function (errors) {
                console.log(errors);
            },
        },
        false,
    );
}

function loginUser() {
    var data = $("#form-login").serializeArray();

    // Create cookie and login
    $.ajax(
        {
            type: "POST",
            enctype: "multipart/form-data",
            url: host + "/auth/login",
            data: data,
            success: function (d) {
                window.location = host;
            },
            error: function (errors) {
                displayErrors("#form-login", errors);
            },
        },
        false,
    );
}

function confirmRecoverPassword() {
    var data = $("#form-recover-confirm-password").serializeArray();

    $.ajax(
        {
            type: "PUT",
            enctype: "multipart/form-data",
            url: host + "/api/users/confirmRecoverPassword",
            data: data,
            beforeSend: function() {
                // Adicionar Modal!!! Load
            },
            success: function (data) {
                removeErrors(); // Remove errors

                // Adicionar Modal!!! Click Ok vai para o login
                
            },
            error: function (errors) {
                displayErrors("#form-recover-confirm-password", errors);
            },
        },
        false,
    );
}

function recoverPassword() {
    var data = $("#form-recover-password").serializeArray();

    $.ajax(
        {
            type: "POST",
            enctype: "multipart/form-data",
            url: host + "/api/users/recoverPassword",
            data: data,
            beforeSend: function() {
                // Adicionar Modal!!! Load
            },
            success: function (data) {
                removeErrors(); // Remove errors

                // Adicionar Modal!!! "Check your email address!"
            },
            error: function (errors) {
                displayErrors("#form-recover-password", errors);
            },
        },
        false,
    );
}

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
    var form = $("#form-upload")[0];
    var data = new FormData(form);

    $.ajax(
        {
            type: "POST",
            url: host + "/api/resources",
            data: data,
            processData: false,
            contentType: false,
            xhrFields: {
                withCredentials: true,
            },
            success: function (data) {},
            error: function (errors) {
                console.log(errors);
            },
        },
        false,
    );
}

function applyFilter() {
    var data = $("#form-filter").serializeArray();
    var htmlFeed = "";
    $.ajax(
        {
            type: "GET",
            enctype: "multipart/form-data",
            url: host + "/api/resources/filters",
            data: data,
            success: function (data) {
                $("#feed").empty();
                addDataToDOM({ resource: data });
            },
            error: function (errors) {
                console.log(errors);
            },
        },
        false,
    );
}

function replyCommentResource(id) {
    var data = $("#" + id).serializeArray();

    $.ajax(
        {
            type: "PUT",
            enctype: "multipart/form-data",
            url: host + "/api/resources/comments",
            data: data,
            xhrFields: {
                withCredentials: true,
            },
            success: function (data) {
                removeErrors(); // Remove errors

                $(".scroll-comments").find(".resource-comment").remove();
                $(".scroll-comments").find(".resource-comment-date").remove();
                $(".scroll-comments").find("form").remove();
                $(".commentsTotal").text(
                    data.data.comments.reduce((acc, e) => {
                        return acc + e.comments.length;
                    }, data.data.comments.length) + " comments",
                );

                var today = new Date();
                var index = 0;
                var _id = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);

                data.data.comments.forEach((element) => {
                    var commentDate = new Date(element.date);
                    var diffTime = today.getTime() - commentDate.getTime();
                    var diffInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    var idForm = "form-reply-comment-" + index;

                    $(".scroll-comments").append(`
                        <div class='resource-comment'>
                            <div class='resource-comment-info'>
                                <p class='resource-comment-author'>${element.author.name}</p>
                                <span class='resource-general-color'>${element.description}</span>
                            </div>
                        </div>
                        <span class='resource-comment-date'>${diffInDays} day(s)</span>
                        <form class="needs-validation" id=${idForm} method="POST" enctype="multipart/form-data" novalidate="">
                            <div class="form-group reply_comment">
                                <input type="hidden" name="comment_index" value="${index}"/>
                                <input type="hidden" name="user_id" value="${data.user_id}"/>
                                <input type="hidden" name="user_name" value="${data.name}"/>
                                <input type="hidden" name="resource_id" value="${_id}"/>
                                <div class="input-group mb-3">
                                    <input class="reply-comment form-control" id="comment" type="text" placeholder="Reply ..." name="comment" required="" />
                                    <div class="input-group-append">
                                        <button class="btn btn-bottom btn-outline-secondary" id="reply-comment-confirm">
                                            <i class="fa fa-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                    `);
                    element.comments.forEach((el) => {
                        el.date = diffInDays + " day(s)";

                        $(".scroll-comments").append(`
                                <div class="resource-comment resource-comment-reply">
                                    <div class="resource-comment-info">
                                        <p class="resource-comment-author">${el.author.name}</p>
                                        <span class="resource-general-color">${el.description}</span>
                                    </div>
                                </div>
                                <span class="resource-comment-date reply-date">${el.date}</span>
                            </div>
                        </form>
                        `);
                    });

                    index++;
                });

                document.getElementById("collapseComments").scrollTop = document.getElementById(
                    "collapseComments",
                ).scrollHeight;
            },
            error: function (errors) {
                alert(errors.responseJSON.generalErrors[0].msg);
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
            xhrFields: {
                withCredentials: true,
            },
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
        xhrFields: {
            withCredentials: true,
        },
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

    if (errors.responseJSON.error != undefined) {
        errors.responseJSON.error.generalErrors.forEach((element) => {
            $("div ." + element.field).append('<span class="error-format">' + element.msg + "</span>");
        });
    } else if (errors.responseJSON.generalErrors != undefined) {
        errors.responseJSON.generalErrors.forEach((element) => {
            $("div ." + element.field).append('<span class="error-format">' + element.msg + "</span>");
        });
    }
}

function removeErrors() {
    $("div .first_name .error-format").empty();
    $("div .last_name .error-format").empty();
    $("div .email .error-format").empty();
    $("div .institution .error-format").empty();
    $("div .username .error-format").empty();
    $("div .password .error-format").empty();
    $("div .confirm_password .error-format").empty();
    $("div .error-format").empty();
}

/* Resource Feed */

var limitGetResource = 5;
var skipGetResource = 0;
var counterGetResource = 0;
var totalResource = 0;

if (location.pathname == "/") getResource();

window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (clientHeight + scrollTop >= scrollHeight - 5) {
        if (location.pathname == "/")
            // show the loading animation
            showLoading();
    }
});

function showLoading() {
    document.querySelector(".loading").classList.add("show");

    // load more data
    setTimeout(getResource, 1000);
}

async function getResource() {
    counterGetResource++;
    skipGetResource = counterGetResource == 1 ? 0 : skipGetResource + 5;

    if (skipGetResource <= totalResource) {
        const resourceResponse = await fetch(
            host + "/api/resources?skip=" + skipGetResource + "&lim=" + limitGetResource,
        );
        const resourceData = await resourceResponse.json();
        const data = { resource: resourceData.resources };
        totalResource = resourceData.total;

        addDataToDOM(data);
    } else document.querySelector(".loading").classList.remove("show");
}

function addDataToDOM(data) {
    if (data.resource.length == 0) {
        $(".feed").append(`
            <div class='without-resources-box'>
                <p class='without-resources'> No resources yet! Be the first to post!</p>
            </div>`);
    } else {
        data.resource.forEach((element) => {
            const resourceElement = document.createElement("div");
            resourceElement.classList.add("resource-post");
            var overallRating = (element.rating.votes == 0 ? 0 : (element.rating.score / element.rating.votes).toFixed(1));

            resourceElement.innerHTML = `
                <div class="resource-user-info">
                    <img src="/api/resources/${element._id}/image" alt="${element.image}" />
                    <span>${element.author.name}</span>
                </div>
                <div class="resource-rating">${overallRating} <i class="fa fa-star"> </i>(${element.rating.votes})</div>
                <p class="resource-type-year">${element.type} - ${element.year}</p>
                <a class="resource-link" href="resources/${element._id}">
                    <h2 class="resource-title">${element.subject}</h2>
                    <p class="resource-description">${element.description}</p>
                </a>
                <p class="resource-tags">
                    ${Object.keys(element.tags)
                        .map(function (key) {
                            return "<a href='#" + element.tags[key] + "'" + ">#" + element.tags[key] + "</a>";
                        })
                        .join(" ")}
                </p>
            `;
            document.getElementById("feed").append(resourceElement);
        });
    }
    document.querySelector(".loading").classList.remove("show");
}
