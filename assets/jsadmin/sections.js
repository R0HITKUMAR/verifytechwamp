function hideall() {
    document.getElementById('dashboard-section').classList.add("d-none");
    document.getElementById('students-section').classList.add("d-none");
    document.getElementById('addCertificates-section').classList.add("d-none");
    document.getElementById('addTemplate-section').classList.add("d-none");
    document.getElementById('cstore-section').classList.add("d-none");
    document.getElementById('tickets-section').classList.add("d-none");
    document.getElementById('profile-section').classList.add("d-none");
    document.getElementById('help-section').classList.add("d-none");
}
function showdashboard_section() {
    hideall();
    document.getElementById('dashboard-section').classList.remove("d-none");
}
function showstudents_section() {
    hideall();
    document.getElementById('students-section').classList.remove("d-none");
}
function showaddCertificates_section() {
    hideall();
    document.getElementById('addCertificates-section').classList.remove("d-none");
}
function showaddTemplate_section() {
    hideall();
    document.getElementById('addTemplate-section').classList.remove("d-none");
}
function showcstore_section() {
    hideall();
    document.getElementById('cstore-section').classList.remove("d-none");
}
function showtickets_section() {
    hideall();
    document.getElementById('tickets-section').classList.remove("d-none");
}
function showprofile_section() {
    hideall();
    document.getElementById('profile-section').classList.remove("d-none");
}
function showhelp_section() {
    hideall();
    document.getElementById('help-section').classList.remove("d-none");
}

// Common Functions
function ShowAttachment(url) {
    var Modal = document.getElementById("modalBody");
    doc = `<iframe src="${url}" style="width:100%; height:800px;"></iframe>`;
    Modal.innerHTML = doc;
    document.getElementById("showAttachment").click();

    const link = document.getElementById("attachmentdownload");
    link.href = url;
}

function datatable(status, ID) {
    if (status == true) {
        $(ID).DataTable({
            "pageLength": 40,
            dom: 'Bfrtip',
            paging: false,
            destroy: true,
            buttons: [
                {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6]
                    }
                },
                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6]
                    }
                },
                {
                    extend: 'print',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6]
                    }
                },
                {
                    extend: 'pdfHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6]
                    }
                }
            ]
        });
    } else {
        $(ID).DataTable().destroy();
    }
}

// Calculate Certificates Issued
firebase.database().ref('Students').on('value', function (snapshot) {
    document.getElementById("total_students").innerHTML = snapshot.numChildren();

});

// Calculate Certificates Issued
firebase.database().ref('Certificates').on('value', function (snapshot) {
    document.getElementById("total_certificates_issued").innerHTML = snapshot.numChildren();
});

firebase.database().ref('CTemplates').on('value', function (snapshot) {
    document.getElementById("total_templates").innerHTML = snapshot.numChildren();
});

firebase.database().ref('Tickets').on('value', function (snapshot) {
    document.getElementById("total_tickets").innerHTML = snapshot.numChildren();
});

firebase.database().ref('Tickets').on('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        data = childSnapshot.val();
        if (data.Status == "Pending") {
            document.getElementById("total_open_tickets").innerHTML = parseInt(document.getElementById("total_open_tickets").innerHTML) + 1;
        }
    });
});