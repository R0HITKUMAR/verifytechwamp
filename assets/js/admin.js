$("<link/>", {
    rel: "stylesheet",
    type: "text/css",
    href: "./css/styles.css"
}).appendTo("head");

firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        location.replace("login.html")
    }
    if (user.displayName == null) {
        document.getElementById("name-update").style.display = "block";
    }
    document.getElementById("user-email").value = user.email
    document.getElementById("useremail").value = user.email
})

// Certificates Form Functions
function addCertificatesForm() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzBaX47H3yqlMDzjCPNZI_Y8pDrk7TkX9EAGAAIb154dKKiDDnZw1cBPE1dlAdVIj0/exec'
    const form = document.forms['certificates-form']
    form.addEventListener('submit', e => {
        document.getElementById("certificatesSubmitButton").disabled = true;
        document.getElementById("certificatesSubmitButton").value = "Loading..";
        e.preventDefault()
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => submittedCertificatesButton())
            .catch(error => console.error('Error!', error.message))
    })
}

function submittedCertificatesButton() {
    document.getElementById("certificatesSubmitButton").value = "Submitted";
    document.getElementById("addCertificatesFormAlert").style.display = "block";
    document.getElementById("addCertificatesFormValue").innerHTML = "Record Inserted Successfully";
    document.getElementById("certificates-Form").reset();
}
function hidealloptions(){
    document.getElementById("output-section").style.display = "none";
    document.getElementById("all-tickets").style.display = "none";
    document.getElementById("all-certificates").style.display = "none";
    document.getElementById("add-certificates").style.display = "none";
}

function viewAddCertificates() {
    document.getElementById("output-section").style.display = "none";
    document.getElementById("all-tickets").style.display = "none";
    document.getElementById("all-certificates").style.display = "none";
    document.getElementById("add-certificates").style.display = "block";
}
function viewAllRecords() {
    getallCertificates();
    document.getElementById("output-section").style.display = "none";
    document.getElementById("all-tickets").style.display = "none";
    document.getElementById("all-certificates").style.display = "block";
    document.getElementById("add-certificates").style.display = "none";
}
function viewTickets() {
    getTicketsstatus();
    getSubsscriptionstatus();
    document.getElementById("output-section").style.display = "none";
    document.getElementById("all-certificates").style.display = "none";
    document.getElementById("add-certificates").style.display = "none";
    document.getElementById("all-tickets").style.display = "block";
}

function searchCertificates() {
    document.getElementById("all-tickets").style.display = "none";
    document.getElementById("all-certificates").style.display = "none";
    document.getElementById("add-certificates").style.display = "none";
    document.getElementById("output-section").style.display = "block";
}

function getTicketsstatus() {
    firebase.database().ref('Tickets-Requests').on('value', function (snapshot) {
        document.getElementById("ticket-table").innerHTML = "";
        snapshot.forEach(function (gettstatus) {
            ticket_status = gettstatus.val();
            ticket_id = gettstatus.key;
            if (ticket_status.attachment == 'No Attachments') {
                row =
                    `<tr>
                <td>${ticket_id}</td>
                <td>${ticket_status.name}</td>
                <td>${ticket_status.phone}</td>
                <td>${ticket_status.email}</td>
                <td>${ticket_status.message}</td>
                <td>${ticket_status.status}</td>
                <td>${ticket_status.attachment}</td>
                <td>
                <a class="table_button" onclick="setStatusClosed('${ticket_id}')"><i 
 class="fa fa-check" id="ticket-check"></i></a>
                <a class="table_button" onclick="updateTicketStatus('${ticket_id}')"><i class="fa fa-edit"></i></a>
                <a class="table_button" onclick="deleteTicket('${ticket_id}')"><i class="fa fa-trash"></i></a>
                </td>
            </tr>`;
            }
            else if (ticket_status.attachment != 'No Attachments') {
                row =
                    `<tr>
                <td>${ticket_id}</td>
                <td>${ticket_status.name}</td>
                <td>${ticket_status.phone}</td>
                <td>${ticket_status.email}</td>
                <td>${ticket_status.message}</td>
                <td>${ticket_status.status}</td>
                <td><a href=${ticket_status.attachment} class="btn btn-primary btn-block" style="padding:3px 10px;" target="_blank">View</a></td>
                <td>
                <a class="table_button" onclick="setStatusClosed('${ticket_id}')"><i 
 class="fa fa-check" id="ticket-check"></i></a>
                <a class="table_button" onclick="updateTicketStatus('${ticket_id}')"><i class="fa fa-edit"></i></a>
                <a class="table_button" onclick="deleteTicket('${ticket_id}')"><i class="fa fa-trash"></i></a>
                </td>
            </tr>`;
            }
            document.getElementById("ticket-table").innerHTML += row;
        });
    });
}


function setStatusClosed(id) {
    let ticketRef = firebase.database().ref('Tickets-Requests');
    ticketRef.child(id).update({
        "status": 'Closed'
    });
    document.getElementById("ticket-table").innerHTML = "";
    getTicketsstatus();
}

function updateTicketStatus(id) {
    let message = prompt("Please Enter Status", "Closed");
    if (message != null) {
        let ticketRef = firebase.database().ref('Tickets-Requests');
        ticketRef.child(id).update({
            "status": message
        });
        document.getElementById("ticket-table").innerHTML = "";
        getTicketsstatus();
    }
}

function deleteTicket(id) {
    var B = confirm("Are You Sure You Want to Delete This Record?");
    if (B == true) {
        let ticketRef = firebase.database().ref('Tickets-Requests/' + id);
        ticketRef.remove();
    }
}

function getSubsscriptionstatus() {
    firebase.database().ref('Subscription').on('value', function (snapshot) {
        document.getElementById("subscription-table").innerHTML = "";
        snapshot.forEach(function (getsstatus) {
           subscription_status = getsstatus.val();
            subscription_id = getsstatus.key;
            row =
                    `<tr>
                <td>${subscription_id}</td>
                <td>${subscription_status.name}</td>
                <td>${subscription_status.email}</td>
                <td>${subscription_status.status}</td>
                <td>
                <a class="table_button" onclick="setSubscriptionClosed('${subscription_id}')"><i 
 class="fa fa-check" id="ticket-check"></i></a>
                <a class="table_button" onclick="updateSubscription('${subscription_id}')"><i class="fa fa-edit"></i></a>
                <a class="table_button" onclick="deleteSubscription('${subscription_id}')"><i class="fa fa-trash"></i></a>
                </td>
            </tr>`;
            document.getElementById("subscription-table").innerHTML += row;
        });
    });
}


function setSubscriptionClosed(id) {
    let subscriptionRef = firebase.database().ref('Subscription');
    subscriptionRef.child(id).update({
        "status": 'Closed'
    });
    document.getElementById("subscription-table").innerHTML = "";
    getSubsscriptionstatus()
}

function updateSubscription(id) {
    let message = prompt("Please Enter Status", "Closed");
    if (message != null) {
        let subscriptionRef = firebase.database().ref('Subscription');
        subscriptionRef.child(id).update({
            "status": message
        });
        document.getElementById("subscription-table").innerHTML = "";
        getSubsscriptionstatus()
    }
}

function deleteSubscription(id) {
    var B = confirm("Are You Sure You Want to Delete This Record?");
    if (B == true) {
        let subscriptionRef = firebase.database().ref('Subscription/' + id);
        subscriptionRef.remove();
    }
}

