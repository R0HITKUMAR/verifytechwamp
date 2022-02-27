// Retrive Tickets Data
function getTickets() {
    firebase.database().ref('Tickets').on('value', function (snapshot) {
        document.getElementById("tickets-table").innerHTML = "";
        var e = 0;
        snapshot.forEach(function (childSnapshot) {
            key = childSnapshot.key;
            firebase.database().ref('Students/' + childSnapshot.val().Roll_No).on('value', function (ssnapshot) {
                const data = extend({}, childSnapshot.val(), ssnapshot.val());
                if (data.Attachment == "No Attachment" || data.Attachment == "" || data.Attachment == null) {
                    file = `-`;
                }
                else {
                    file = `<a class="table_button" onclick="ShowAttachment('${data.Attachment}')"><i class="fa fa-link"></i></a>`;
                }
                row =
                    `<tr>
                    <td>${++e}</td>
                    <td>${data.ID}</td>
                    <td>${data.Date}</td>
                    <td>${data.Name}</td>
                    <td>${data.Roll_No}</td>
                    <td>${data.Message}</td>
                    <td>${data.Status}</td>
                    <td>${file}</td>
                    <td>
                        <a href="#" class="table_button" onclick="editTicket('${data.Name}','${key}')"><i class="fa fa-edit"></i></a>
                    </td>
                    <td>
                        <a href="#" class="table_button" onclick="deleteTicket('${key}')"><i class="fa fa-trash"></i></a>
                    <td>
                </tr>`;
                document.getElementById("tickets-table").innerHTML += row;
            });
        });
    });
}

// Edit Student
function editTicket(Name, key) {
    $('#ticketForm').collapse('show');
    $('html, body').animate({
        scrollTop: $("#tickets-section").offset().top
    }, 500);
    firebase.database().ref('Tickets/' + key).on('value', function (snapshot) {
        data = snapshot.val();
        if (data.Attachment == "No Attachment" || data.Attachment == "" || data.Attachment == null) {
            button = `<button class="btn btn-primary btn-sm" onclick="closeTicket()">Close Ticket</button>`;
        }
        else {
            button = `<button class="btn btn-primary mr-2 btn-sm" onclick="closeTicket()">Close Ticket</button><a class="btn btn-primary btn-sm" href="#" onclick="ShowAttachment('${data.Attachment}')">Attachment</a>`;
        }
        document.getElementById("tid").value = data.ID;
        document.getElementById("tname").value = Name;
        document.getElementById("troll").value = data.Roll_No;
        document.getElementById("TDescription").value = data.Message;
        document.getElementById("TStatus").value = data.Status;
        document.getElementById("ticket-button").innerHTML = button;
        document.getElementById("ticketSubmitButton").classList.add("d-none");
        document.getElementById("ticketUpdateButton").classList.remove("d-none");
    });
}

function closeTicket() {
    document.getElementById("TStatus").value = "Closed";
    document.getElementById("TStatus").disabled = true;
    updateTicket();
}

//Update Student
function updateTicket() {
    if ($('#TStatus').val() != "" && $('#tid').val() != "") {
        var Key = $('#tid').val();
        firebase.database().ref('Tickets/' + Key).update({
            Status: $('#TStatus').val(),
        });
        Toast.fire({
            icon: 'success',
            title: 'Ticket Updated Successfully.'
        })
        getTickets();
        $('#ticketUpdate')[0].reset();
        $('#ticketForm').collapse('hide');
    }
    else{
        Toast.fire({
            icon: 'error',
            title: 'Please Fill All Fields.'
        })
    }

}

function deleteTicket(key) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-2',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You want to Delete this Ticket!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            firebase.database().ref('Tickets/' + key).on('value', function (snapshot) {
                data = snapshot.val();
                if (data.Status == "Closed") {
                    firebase.database().ref('Tickets/' + key).remove();
                    swalWithBootstrapButtons.fire(
                        'Deleted Successfully!',
                        'Record Deleted Successfully.',
                        'success'
                    )
                    getTickets();
                }
                else {
                    swalWithBootstrapButtons.fire(
                        'Restricted!',
                        'Operation Not Allowed.',
                        'error'
                    )
                }

            });
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Cancelled by User',
                'error'
            )
        }
    })
    //Reload After Some time
    setTimeout(function () {
        window.location.reload();
    }, 5000);

}
