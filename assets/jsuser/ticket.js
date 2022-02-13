$('#ticket-form').submit(function (e) {
    var Alert = document.getElementById("TicketAlert");
    var ID = "TWECT" + Date.now();
    var today = new Date().toLocaleString('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    e.preventDefault();
    firebase.database().ref('Tickets/' + ID).set({
        ID: ID,
        Roll_No: $('#u_roll').val(),
        Message: $('#u_message').val(),
        Date: today,
        Attachment: $('#t_url').val() || "No Attachment",
        Status: "Pending",
    });
    $('#ticket-form')[0].reset();
    document.getElementById("TicketAlert").classList.remove("d-none");
    AlertText = `<div class="alert alert-success alert-dismissible fade show text-center" role="alert">
                    <strong>Record Added Successfully!</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
    Alert.innerHTML = AlertText;
    document.getElementById("TicketSubmittedButton").value = "Submitted";
    Toast.fire({
        icon: 'success',
        title: 'Ticket Submitted Successfully.'
    })
});

getTicketsDetails();
// Retrive Students Data
function getTicketsDetails() {
    firebase.database().ref('Tickets').on('value', function (snapshot) {
        document.getElementById("tickets-table").innerHTML = "";
        var e = 1;
        snapshot.forEach(function (childSnapshot) {
            data = childSnapshot.val();
            key = childSnapshot.key;
            if (data.Roll_No == $('#u_roll').val()) {
                if (data.Attachment == "No Attachment" || data.Attachment == "" || data.Attachment == null) {
                    file = `-`;
                }
                else {
                    file = `<a class="table_button" href="${data.Attachment}" target="_blank"><span class="fa fa-link"></span></a>`;
                }
                row =
                    `<tr>
                    <td>${e}</td>
                    <td>${data.ID}</td>
                    <td>${data.Date}</td>
                    <td>${data.Message}</td>
                    <td>${file}</td>
                    <td>${data.Status}</td>
                </tr>`;
                document.getElementById("tickets-table").innerHTML += row;
            }
        });
    });
}

function ticketFileUpload() {
    var Alert = document.getElementById("TicketAlert");
    var file = document.getElementById("ticket-file").files[0];
    if (file !== undefined) {
        var storageRef = firebase.storage().ref('Tickets/' + file.name);
        var task = storageRef.put(file);
        task.on('state_changed',
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                AlertText = `
                <div class="mb-3">
                    <progress value="${percentage}" max="100" style="width:100%;"></progress>
                </div>`;
                Alert.innerHTML = AlertText;
                console.log(percentage);
            }
        );
        task.then(function (snapshot) {
            console.log('File Upload Successfully');
            storageRef
                .getDownloadURL()
                .then(function (url) {
                    console.log(url);
                    AlertText = `
                <div class="alert alert-secondary  alert-dismissible fade show mb-1" role="alert">
                    <strong>File Uploaded Successfully</strong>
                    <a href="${url}" class="btn btn-primary btn-sm" target="_blank" style="float:right">View</a>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
                    Alert.innerHTML = AlertText;
                    document.getElementById("t_url").value = url;
                    document.getElementById("fileUploadPart").classList.add("d-none");
                })
                .catch(function (error) {
                    AlertText = `
                <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                    <strong>${error.message}</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
                    Alert.innerHTML = AlertText;
                });
        }
        );
    }
    else {
        AlertText = `
                <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                    <strong>Enter a Valid Reference or Choose a Valid File</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
        Alert.innerHTML = AlertText;
    }
}