// Clock
function updateClock() {
    var now = new Date();
    var day = now.getDay();
    var month = now.getMonth();
    var dateNum = now.getDate();
    var year = now.getFullYear();
    var hour = now.getHours();
    var minutes = now.getMinutes();
    var second = now.getSeconds();

    Number.prototype.pad = function(digits) {
        for(var n = this.toString(); n.length < digits; n = 0 + n);
        return n;
    }

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ids = ["dayname", "month", "daynum", "year", "hour", "minutes", "seconds"];
    var values = [weekDays[day], months[month], dateNum.pad(2), year, hour.pad(2), minutes.pad(2), second.pad(2)];

    for(var i = 0; i < ids.length; i++) {
        document.getElementById(ids[i]).firstChild.nodeValue = values[i];
    }
}

function initClock() {
    updateClock();
    window.setInterval("updateClock()", 1);
}

//single page application stuff
$('#newappbutton').on('click', function() {
    $('#homepage').slideUp();
    $('#detailspage').slideUp();
    $('#newappointment').slideDown();
    $('#deleteappointment').slideUp();
})

$('#homebutton').on('click', function() {
    $('#detailspage').slideUp();
    $('#newappointment').slideUp();
    $('#homepage').slideDown();
    $('#deleteappointment').slideUp();
})

//details button
function buttonDetails(id) {
    $('#homepage').slideUp();
    $('#newappointment').slideUp();
    $('#detailspage').slideDown();

    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php?method=queryAppointmentById&param="+id,
        success: function(response) {
            $('#choiceLogResults').html('');
            $('#votingOptions').html('');
            $('#card-header').html('');
            $('#card-title').html('');
            $('#card-desc').html('');
            $('#showButtonsHere').html('');
            if(response['choice']) {
                for(i = 0; i < response['choice'].length; i++) {
                    var splitChoice = response['choice'][i][2].split('|');
                    for(j = 1; j < splitChoice.length; j++) {
                        var html = '<li>' + response['choice'][i][1] + ': ' + splitChoice[j] + '</li>';
                        $('#choiceLogResults').append(html);
                    }
                }
            }
            var startDate = new Date(response['appointment']['start_date']);
            var date = new Date();
                    var endDate = startDate.getTime() + (response['appointment']['duration']*60*60*1000);
                    endDate = new Date(endDate);

                    if(endDate < date) {
                        var status = "Inactive"; 
                    } else {
                        var status = "Active";
                    }

                    var endDateString = ("0" + endDate.getDate()).slice(-2) + "-" + ("0"+(endDate.getMonth()+1)).slice(-2) + "-" +
                                        endDate.getFullYear() + " " + ("0" + endDate.getHours()).slice(-2) + ":" + ("0" + endDate.getMinutes()).slice(-2);

                    var html = 'End Date: ' + endDateString
                    $('#card-header').append(html);
                    $("#alertTime").fadeIn(400, function(){
                        $(this).css('opacity', 1)
                    });

                    var html = response['appointment']['title'] + ', ' + response['appointment']['location'];
                    $('#card-title').append(html);

                    $('#card-desc').append(response['appointment']['description']);

                    var html = '<div class="col-xs-4">' +
                    '<input type="text" class="form-control" id="checkUsername" placeholder="Username" aria-label="username" aria-describedby="button-addon2"'+ (status === 'Inactive' ? 'disabled' : '""') + '>' +
                    '</div>' +
                    '<button type="button" id="submitChoice" class="btn btn-success" data-bs-toggle="tooltip" data-bs-placement="top" title="Submit" id="button-addon2" onclick="submitVote(' + response['appointment']['id'] + ');">Vote</button>' +
                    '<button type="button" class="btn btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Appointment" id="deleteApp" onclick="deleteAppointment(' + response['appointment']['id'] + ');">Delete Appointment</button>';
                    $('#showButtonsHere').append(html);

                    var splitAppointments = response['appointment']['appointments'].split('|');
                    for(j = 0; j < splitAppointments.length; j++) {
                        var html = '<span class="invalid-feedback" id="error_message_check">Please select at least one option</span>' +
                        '<li class="list-group-item">' +
                        '<input class="form-check-input me-1" id="checkVote" type="checkbox" data-choice="' + splitAppointments[j] + '" aria-label="..."'+ (status === 'Inactive' ? 'disabled' : '""') + '>' + splitAppointments[j] + '</li>'
                        $('#votingOptions').append(html)
                    }
        },
        fail: function(e) {
            console.log("An error has occured!");
        }
    });
}

//deletes appointment
function deleteAppointment(id) {
    $("#card-success").hide();
    $('#deleteappointment').slideUp();
    $("error_message_pass").hide();
    var error_password = true;

    $("#form-pass").focusout(function() {
        var pattern = /^[a-zA-Z0-9]*$/;
        var pass = $("#form-pass").val();
        if(pattern.test(pass) && pass !== '') {
            $("#error_message_pass").hide();
            error_password = false;
        } else {
            $("#error_message_pass").show();
            error_password = true;
        }
    });

    // hard coded password (very insecure)
    $("#deleteApp").on('click', function() {
        $('#detailspage').slideUp();
        $('#deleteappointment').slideDown();

        $("#proceedDeleteApp").on('click', function() {
            if($("#form-pass").val() === "password123") {
                $("#card-enter-pass").hide();
                $('#homepage').slideDown();
                $('#deleteappointment').slideUp();

                $.ajax({
                    type: "GET",
                    url: "../backend/serviceHandler.php?method=deleteAppointmentbyID&param="+id,
                    success: function(response) {
                        $('#homepage').slideDown();
                        $('#detailspage').slideUp();
                        $("#alertDeleted").fadeIn(400, function(){
                            $(this).css('opacity', 1)
                        });
                    },
                    fail: function(e) {
                        console.log("An error has occured!");
                    }
                });
            } else {
                $("#error_message_pass").show();
                error_password = true;
            }
        });
    });
}

// shows all appointments on home page
$.ajax({
    type: "GET",
    url: "../backend/serviceHandler.php?method=queryAppointment",
    success: function(response) {
        for(i = 0; i < response.length; i++) {
            var startDate = new Date(response[i]['start_date']);
            var date = new Date();
            var endDate = startDate.getTime() + (response[i]['duration']*60*60*1000);
            
            if(endDate < date) {
               var status = "Inactive"; 
            } else {
                var status = "Active";
            }
            endDate = new Date(endDate);
            var endDateString = ("0" + endDate.getDate()).slice(-2) + "-" + ("0"+(endDate.getMonth()+1)).slice(-2) + "-" +
                                endDate.getFullYear() + " " + ("0" + endDate.getHours()).slice(-2) + ":" + ("0" + endDate.getMinutes()).slice(-2);
            var html = '<tr>' +
                '<th scope="row">' + response[i]['id'] + '</th>' +
                    '<td>' + response[i]['username'] + '</td>' +
                    '<td>' + response[i]['title'] + '</td>' +
                    '<td>' + endDateString + '</td>' +
                    '<td '+ (status === 'Inactive' ? 'class="text-danger"' : 'class="text-success"') + '>' + status + '</td>' +
                    '<td>' +
                    '<button type="submit" class="btn btn-sm btn-secondary text-center" name="Details" onclick="buttonDetails('+ response[i]['id'] +');">Details</button>' +
                '</td>' +
            '</tr>';
            
            $('#allAppointments').append(html)
        }
    },
    fail: function(e) {
        console.log("An error has occured!");
    }
});

// form validation
$(function() {
    $("#error_message_username").hide();
    $("error_message_title").hide();
    $("error_message_location").hide();
    $("error_message_duration").hide();
    $("error_message_desc").hide();
    $("error_message_appointment").hide();

    var error_username = true;
    var error_title = true;
    var error_location = true;
    var error_duration = true;
    var error_desc = true;
    var error_appointment = true;

    $("#form-user").focusout(function() {
        var pattern = /^[a-zA-Z]*$/;
        var username = $("#form-user").val();
        if(pattern.test(username) && username !== '') {
            $("#error_message_username").hide();
            error_username = false;
        } else {
            $("#error_message_username").show();
            error_username = true;
        }
    });

    $("#form-title").focusout(function() {
        var pattern = /^[a-zA-Z( )]*$/;
        var title = $("#form-title").val();
        if(pattern.test(title) && title !== '') {
            $("#error_message_title").hide();
            error_title = false;
        } else {
            $("#error_message_title").show();
            error_title = true;
        }
    });

    $("#form-location").focusout(function() {
        var pattern = /^[a-zA-Z( )]*$/;
        var location = $("#form-location").val();
        if(pattern.test(location) && location !== '') {
            $("#error_message_location").hide();
            error_location = false;
        } else {
            $("#error_message_location").show();
            error_location = true;
        }
    });

    $("#form-duration").focusout(function() {
        var pattern = /^[1-9]\d*$/;
        var duration = $("#form-duration").val();
        if(pattern.test(duration) && duration !== '') {
            $("#error_message_duration").hide();
            error_duration = false;
        } else {
            $("#error_message_duration").show();
            error_duration = true;
        }
    });

    $("#form-desc").focusout(function() {
        var pattern = /^[a-zA-Z0-9( )]*$/;
        var desc = $("#form-desc").val();
        if(pattern.test(desc) && desc !== '') {
            $("#error_message_desc").hide();
            error_desc = false;
        } else {
            $("#error_message_desc").show();
            error_desc = true;
        }
    });

    $("#form-appointment").focusout(function() {
        var pattern = /^([0-9]{1,2}[.][0-9]{1,2}[.][0-9]{4}(, )[0-9]{1,2}[:][0-9]{1,2}[-][0-9]{1,2}[:][0-9]{1,2})*$/;
        var appointment = $("#form-appointment").val();
        if(pattern.test(appointment) && appointment !== '') {
            $("#error_message_appointment").hide();
            error_appointment = false;
        } else {
            $("#error_message_appointment").show();
            error_appointment = true;
        }
    });

    $("#newAppForm").submit(function() {
        if(error_username === false && error_title === false && error_location === false && error_duration === false && error_desc === false && error_appointment === false) {
            $('#newappointment').slideUp();
            $('#homepage').slideDown();
            $("#alertSuccess").fadeIn();
            $("#alertSuccess").fadeIn(400, function(){
                $(this).css('opacity', 1)
            });
            
            for(i = 0; i < allAppointments.length; i++) {
                if(i === 0)
                    saveAllAppointments += allAppointments[i];
                else
                    saveAllAppointments += '|' + allAppointments[i];
            }
            
            var user = $('#form-user').val();
            var title = $('#form-title').val();
            var location = $('#form-location').val();
            var duration = $('#form-duration').val();
            var desc = $('#form-desc').val();

            var sendObject = [user, title, location, duration, saveAllAppointments, desc];
            saveAppointment(sendObject);

            $('#form-user').val('');
            $('#form-title').val('');
            $('#form-location').val('');
            $('#form-duration').val('');
            $('#form-desc').val('');
            $('#form-appointment').val('');
            $('#appItem').remove();
            
            error_username = true;
            error_title = true;
            error_location = true;
            error_duration = true;
            error_desc = true;
            error_appointment = true;

            return true;
        } else {
            $('#newappointment').slideUp();
            $('#homepage').slideDown();
            $("#alertFail").fadeIn(400, function(){
                $(this).css('opacity', 1)
            });
            return false;
        }
    })
});

//submits user voting
function submitVote(id){
    var saveApps = "";

    $('#checkVote:checked').each(function() {
        saveApps += '|' + $(this).attr('data-choice');
    });

    var sendObject = [id, $('#checkUsername').val(), saveApps];

    $.ajax({
        url:"../backend/serviceHandler.php?method=checkDuplicateChoiceUser&param=" + JSON.stringify(sendObject),
        type: "GET",
        success: function (response){
            if(response) {
                $('#detailspage').slideUp();
                $('#homepage').slideDown();
                    if(saveApps !== "" && $('#checkUsername').val() !== '') {
                        saveVote(sendObject);
                        $("#alertLogSuccess").fadeIn(400, function(){
                            $(this).css('opacity', 1)
                        });
                    } else {
                        $("#alertLogFail").fadeIn(400, function(){
                            $(this).css('opacity', 1)
                        });
                    }
            } else {
                $("#alertLogFail").fadeIn(400, function(){
                    $(this).css('opacity', 1)
                });
            }
        },
        error: function (e){
            console.log("Error bro...")
        }
    });
};

//saves the voting
function saveVote(e) {
    $.ajax({
        url:"../backend/serviceHandler.php?method=writeChoiceLog&param=" + JSON.stringify(e),
        type: "GET",
        success: function (response){
                console.log(response);
        },
        error: function (e){
            console.log("An error has occured!");
        }
    });
}

//globa variables for communication between form and addItem()
var allAppointments = [];
var saveAllAppointments = "";

//append appointments to list
function addItem() {
    var pattern = /^([0-9]{1,2}[.][0-9]{1,2}[.][0-9]{4}(, )[0-9]{1,2}[:][0-9]{1,2}[-][0-9]{1,2}[:][0-9]{1,2})*$/;
    var appointment = $("#form-appointment").val();
    if(pattern.test(appointment) && appointment !== '') {
        e = $("#form-appointment").val();
        if(e !== '') {
            for(i = 0; i < allAppointments.length; i++) {
                if(allAppointments[i] === e) {
                    $("#error_message_appointment").show();
                    return false;
                }
            }
            $("#appointmentAdder").append('<li class="list-group-item" id="appItem">' + e + '<button type="button" class="close btn-close float-end" onclick="hideItem(this)"></button></li>');
            $('#form-appointment').val(''); 
            allAppointments.push(e);
            console.log("element added");
        }
    }
}

//removes item from list when clicking 'x'
function hideItem(element) {
    $(element).parents('li').remove();
}

// save appointment to database
function saveAppointment(e) {
    $.ajax({
        url:"../backend/serviceHandler.php?method=writeAppointment&param=" + JSON.stringify(e),
        type: "GET",
        success: function (response){
                console.log(response);
        },
        error: function (e){
            console.log("An error has occured!");
        }
    });
}

// save choice
function saveChoice(e) {
    $.ajax({
        url:"../backend/serviceHandler.php?method=writeChoiceLog&param=" + JSON.stringify(e),
        type: "GET",
        success: function (response){
            console.log(response);
        },
        error: function (e){
            console.log("An error has occured!");
        }
    });
}
