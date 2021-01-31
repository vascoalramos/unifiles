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
    $('.x[data-show-id]').each(function(index){
        var $el = $(this);
        $el.html(mydiff($el.attr('data-show-id')));
    });
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
    $(document).on("change keyup", "#tags", function (e) {
        var code = e.keyCode || e.which;
       
        if (
            code == 13 &&
            $("input[value='" + $.trim($(this).val()) + "']").length == 0 &&
            $(".removeTag").length < 5 &&
            $.trim($(this).val()) != ""
            || e.type=="change"
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

    $(document).on("click", ".reply-comment-confirm", function (e) {
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

    // Delete comments
    $(document).on("click", ".delete-comment", function (e) {
        e.preventDefault();
        deleteComments($(this).attr('id'));
    });
});

function deleteComments(commentId) {
    var _id = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
    var data = { resource_id: _id }

    $.ajax(
        {
            type: "DELETE",
            enctype: "multipart/form-data",
            url: host + "/api/resources/comments/" + commentId,
            data: data,
            success: function (result) {
                updateScrollComments(result);
            },
            error: function (errors) {
                console.log(errors);
            },
        },
        false,
    );
}

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
            success: function (data) {
                alert("Inserido com sucesso");
                location.reload();
            },
            error: function (errors) {
                displayErrors("#form-upload", errors);           
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
                updateScrollComments(data);
                if(id=="form-add-comment"){
                    $("#comment").val('');
                }
                
            },
            error: function (errors) {
                alert(errors.responseJSON.generalErrors[0].msg);
            },
        },
        false,
    );
}

function updateScrollComments(data) {
    $(".scroll-comments").find(".resource-comment").remove();
    $(".scroll-comments").find(".resource-comment-date").remove();
    $(".scroll-comments").find("form").remove();
    $(".commentsTotal").text(
        data.data.comments.reduce((acc, e) => {
            return acc + e.comments.length;
        }, data.data.comments.length) + " comments",
    );

    var index = 0;
    var index_reply = 0;
    var _id = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);

    data.data.comments.forEach((element) => {
        var commentDate = new Date(element.date);
        var showmdiff = mydiff(commentDate.getTime())

        var idForm = "form-reply-comment-" + index;

        var Htmlaux = $("<span></span>").text(element.description);
        $(".scroll-comments").append(`
            <div class='resource-comment'>
                `+
                    (data.user_id == element.author._id
                        ? `<span class="dropdown-menu-comments dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></span>
                           <div class="dropdown-menu dropdown-comments-options"><span class="delete-comment" id=${index}>Delete</span></div>` 
                        : `` 
                    )
                +
                `<div class='resource-comment-info'>
                    <p class='resource-comment-author'>${element.author.name}</p>
                    <span class='resource-general-color'>`+$(Htmlaux).html()+`</span>
                </div>
            </div>
            <span class='resource-comment-date'>${showmdiff} ago</span>
            
        `);
        
        element.comments.forEach((el) => {
            var Htmlauxsub = $("<span></span>").text(el.description);
            var commentDatesub = new Date(el.date);
            var showmdiff = mydiff(commentDatesub.getTime())
            
            $(".scroll-comments").append(`
                    <div class="resource-comment resource-comment-reply">
                        `+
                            (data.user_id == el.author._id
                                ? `<span class="dropdown-menu-comments dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></span>
                                <div class="dropdown-menu dropdown-comments-options"><span class="delete-comment" id=${index + '-' + index_reply}>Delete</span></div>` 
                                : `` 
                            )
                        +
                        `<div class="resource-comment-info">
                            <p class="resource-comment-author">${el.author.name}</p>
                            <span class="resource-general-color">`+$(Htmlauxsub).html()+`</span>
                        </div>
                    </div>
                    <span class="resource-comment-date reply-date">${showmdiff} ago</span>
                </div>
            `);
            index_reply++;
        });
        $(".scroll-comments").append(`<form class="needs-validation" id=${idForm} method="POST" enctype="multipart/form-data" novalidate="">
        <div class="form-group reply_comment">
            <input type="hidden" name="comment_index" value="${index}"/>
            <input type="hidden" name="user_id" value="${data.user_id}"/>
            <input type="hidden" name="user_name" value="${data.name}"/>
            <input type="hidden" name="resource_id" value="${_id}"/>
            <div class="input-group mb-3">
                <input class="reply-comment form-control" id="comment${idForm}" type="text" placeholder="Reply ..." name="comment" required="" />
                <div class="input-group-append">
                    <button class="btn btn-bottom btn-outline-secondary reply-comment-confirm">
                        <i class="fa fa-chevron-right"></i>
                    </button>
                </div>
            </div>
    </form>`)
        index++;
    });
    
    document.getElementById("collapseComments").scrollTop = document.getElementById(
        "collapseComments",
    ).scrollHeight;
}

function mydiff(date1) {
    var second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7;
    date1 = new Date(date1).getTime();
    date2 = new Date().getTime();
    var timediff = date2 - date1;
    if (isNaN(timediff)) return NaN;
    var showdiff=0;
    showdiffWeek = Math.floor(timediff / week);
    showdiffDay = Math.floor(timediff / day); 
    cshowdiffHour = Math.floor(timediff / hour); 
    showdiffMinute = Math.floor(timediff / minute);
    showdiffSecond = Math.floor(timediff / second);

    if(showdiffSecond <= 59)
        showdiff = showdiffSecond + " seconds";
    else if(showdiffMinute <= 59)
        showdiff = showdiffMinute + " minutes";
    else if(cshowdiffHour < 24)
        showdiff = cshowdiffHour + " hours";
    else if(showdiffDay <= 7)
        showdiff = showdiffDay + " days";
    else if(showdiffWeek > 7)
        showdiff = showdiffWeek + " weeks"; 
    else
        showdiff = undefined
    
    return showdiff;
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
    console.log(errors.responseJSON)
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
    //creat content
    $("div .type .error-format").empty();
    $("div .subject .error-format").empty();
    $("div .tags .error-format").remove();
    $("div .year .error-format").empty();
    $("div .files .error-format").remove();
    $("div .description .error-format").empty();




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
$(document).on("click", ".customheaderside", function () {
    $(".rightmenu").toggleClass("show");
    $(".maincontainer").toggleClass("hide");
});
$(document).on("click", ".maincontainer", function () {
    $(".rightmenu.show").toggleClass("show");
    $(".maincontainer.hide").toggleClass("hide");
});
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
            var pathImg="";
            if(element.image == "/images/ResourceDefault.png")
                pathImg = "/images/ResourceDefault.png"
            else
                pathImg = "/api/resources/"+element._id+"/image"

            
            resourceElement.innerHTML = `
            <div class="" style="width: 100%;display: flex;flex-direction: column;">
                <div class="resource-user-info">
                    <div class="d-flex" style="align-items:center">
                        <img src="${element.author.avatar}" />
                        <div class="d-flex ml-1" style="flex-direction:column">
                            <span class="m-0">${element.author.first_name + " " +element.author.last_name}</span>
                            <p class="resource-type-year m-0">${element.type}, ${element.year}</p>
                        </div>
                    </div>
                
                    <div class="d-flex" >
                        <div class="resource-rating mr-2" style="font-size:14px">
                            ${overallRating}<i class="fa fa-star"> </i>(${element.rating.votes})
                        </div>

                        <div class="dropdown dropleft" style="font-size: 26px;line-height: 25px;">
                            <button class="dropdown-toggle p-0 m-0 customDropLeft" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="background:transparent;border:0;outline:none!important;">
                                <i class="fal fa-ellipsis-v"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="/api/resources/${element._id}/download">Download</a>
                                <a class="dropdown-item" href="#">Another action</a>
                                <a class="dropdown-item" href="#">Something else here</a>
                            </div>
                        </div>
                    </div>
                </div>
                <img src="${pathImg}"  class="card-img-top mt-4" style="margin: 0 auto;width:50%;" alt="${element.image}">

            <div class="card-body">
                <a class="resource-link" href="resources/${element._id}">
                    <h2 class="resource-title card-title">${element.subject}</h2>
                    <p class="resource-description card-text">${element.description}</p>
                </a>
            </div>
            </div>`+
                // <div class="resource-user-info">
                //     <img src="/api/resources/${element._id}/image" alt="${element.image}" />
                //     <span>${element.author.name}</span>
                // </div>
                `
                
               
                <div class="resource-tags m-0 float-none text-right">
                    ${Object.keys(element.tags)
                        .map(function (key) {
                            return "<a style='font-size:14px;' href='#" + element.tags[key] + "'" + ">#" + element.tags[key] + "</a>";
                        })
                        .join(" ")}
                       
                </div>
            `;
            document.getElementById("feed").append(resourceElement);
        });
    }
    document.querySelector(".loading").classList.remove("show");
}
