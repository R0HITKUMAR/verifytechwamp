$('#ticketform').submit(function (e) {
    e.preventDefault();
    var messagesRef = firebase.database().ref('Tickets-Requests');
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
        name: $('#ticket-name').val(),
        phone: $('#ticket-number').val(),
        email: $('#ticket-email').val(),
        message: $('#ticket-message').val(),
        attachment: $('#ticket-url').val() || "No Attachments",
        status: "Submitted"
    });
    $('#ticketalert').show();
    document.getElementById("ticket-alert").innerHTML += "Your ticket number is: " + newMessageRef.key;
    $('#ticketform')[0].reset();
});


function getTicketsstatus() {
    var c = 0;
    const ticket_no = document.getElementById('ticket-id').value;
    firebase.database().ref('Tickets-Requests').on('value', function (snapshot) {
        snapshot.forEach(function (gettstatus) {
            ticket_status = gettstatus.val();
            ticket_id = gettstatus.key;
            if (ticket_id == ticket_no) {
                c = c+1;
                document.getElementById("ticketstatusalert").style.display = "block";
                document.getElementById('ticket-status-alert').innerHTML = ticket_status.status;
                document.getElementById("ticket-status-alert-id").innerHTML = ticket_no;
                document.getElementById('ticket-status-alert-name').innerHTML = ticket_status.name;
                document.getElementById('ticket-status-alert-number').innerHTML = ticket_status.phone;
                document.getElementById('ticket-status-alert-email').innerHTML = ticket_status.email;
                document.getElementById('ticket-status-alert-message').innerHTML = ticket_status.message;
                return;
            }
        });
        if (c== 0) {
            document.getElementById("ticketstatusalert").style.display = "block";
            document.getElementById('ticketstatusalert').innerHTML = '<b><center>' + 'No Ticket Found'+'</b></center>';
        }

    });
    document.getElementById("ticket-search-button").value = 'Searched';
    document.getElementById("ticket-search-button").disabled = true;

}