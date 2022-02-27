// Certificates Form Functions
$('#certificate-form').submit(function (e) {
    e.preventDefault();
});

function issueCertificate() {
    var C = 0;
    var roll = $('#cRoll').val();
    var template = $('#CTID').val();

    // Check Duplicate
    firebase.database().ref('Certificates').on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.val().CRollNo == roll && childSnapshot.val().CTID == template) {
                C = 1;
                Toast.fire({
                    icon: 'error',
                    title: 'Certificate Already Issued.'
                })
            }
        });
        if (C == 0) {
            var now = Date.now();
            var today = new Date().toLocaleString('en-CA', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            var ID = "TWEC" + now;
            firebase.database().ref('Certificates/' + ID).set({
                CID: ID,
                CTID: $('#CTID').val(),
                CRollNo: $('#cRoll').val(),
                CDate: today,
            });
            updateCounter($('#CTID').val());
            updateStudentCounter($('#cRoll').val());
            getCertificatesDetails();
            loadSelect();
            $('#certificate-form')[0].reset();
            document.getElementById("CertificateFormAlert").classList.remove("d-none");
            document.getElementById("CertificateFormAlert").innerHTML = "Record Added Successfully!";
            document.getElementById("CertificateFormSubmitButton").value = "Submitted";
            Toast.fire({
                icon: 'success',
                title: 'Record Added Successfully.'
            })
        }
    });
}

function enableButton() {
    if (document.getElementById("ctitle").value != "" && document.getElementById("csname").value != "" && document.getElementById("cBY").value != "") {
        document.getElementById("CertificateFormSubmitButton").disabled = false;
    }
    else {
        document.getElementById("CertificateFormSubmitButton").disabled = true;
    }
}

function loadSelect() {
    firebase.database().ref('Students').on('value', function (snapshot) {
        document.getElementById("caddRoll").innerHTML = "";
        snapshot.forEach(function (childSnapshot) {
            data = childSnapshot.val();
            key = childSnapshot.key;
            select =
                `<option value="${data.Rollno}">${data.Name} ${data.BranchYear}</option>`;
            document.getElementById("caddRoll").innerHTML += select;
        });
    });
    firebase.database().ref('CTemplates').on('value', function (snapshot) {
        document.getElementById("caddTitle").innerHTML = "";
        snapshot.forEach(function (childSnapshot) {
            data = childSnapshot.val();
            key = childSnapshot.key;
            select =
                `<option value="${data.CTID}">${data.CName}</option>`;
            document.getElementById("caddTitle").innerHTML += select;
        });
    });
}

function addName() {
    var name = $('#cRoll').val();
    firebase.database().ref('Students/' + name).on('value', function (snapshot) {
        if (snapshot.val() == null) {
            Toast.fire({
                icon: 'error',
                title: 'Student Not Found.'
            })
            document.getElementById("cBY").value = "";
            document.getElementById("csname").value = "";
            document.getElementById("CertificateFormSubmitButton").disabled = true;
        }
        else {
            data = snapshot.val();
            $('#csname').val(data.Name);
            $('#cBY').val(data.BranchYear);
            enableButton();
        }
    });
}

function addTitle() {
    var title = $('#CTID').val();
    firebase.database().ref('CTemplates/' + title).on('value', function (snapshot) {
        if (snapshot.val() == null) {
            Toast.fire({
                icon: 'error',
                title: 'Template Not Found.'
            })
            document.getElementById("ctitle").value = "";
            document.getElementById("CertificateFormSubmitButton").disabled = true;
        }
        else {
            data = snapshot.val();
            $('#ctitle').val(data.CName);
            enableButton();
        }
    });
}

// Update Counter
function updateCounter(ID) {
    firebase.database().ref('CTemplates/' + ID).on('value', function (snapshot) {
        data = snapshot.val();
        count = data.CIssued;
    });
    count = count + 1;
    firebase.database().ref('CTemplates/' + ID).update({
        CIssued: count
    });
}

function updateStudentCounter(ID) {
    firebase.database().ref('Students/' + ID).on('value', function (snapshot) {
        data = snapshot.val();
        count = data.No;
    });
    count = count + 1;
    firebase.database().ref('Students/' + ID).update({
        No: count
    });
}

// Retrieve Certificate Data
function getCertificatesDetails() {
    firebase.database().ref('Certificates').on('value', function (snapshot) {
        document.getElementById("certificates-table").innerHTML = "";
        var e = 0;
        snapshot.forEach(function (childSnapshot) {
            // Get User Details
            firebase.database().ref('Students/' + childSnapshot.val().CRollNo).on('value', function (ssnapshot) {
                firebase.database().ref('CTemplates/' + childSnapshot.val().CTID).on('value', function (tsnapshot) {
                    const Data = extend({}, childSnapshot.val(), ssnapshot.val(), tsnapshot.val());
                    Key = Data.CID;
                    var row =
                        `<tr>
                            <td>${++e}</td>
                            <td>${Data.CID}</td>
                            <td>${Data.CName}</td>
                            <td>${Data.Name}</td>
                            <td>${Data.CRollNo}</td>
                            <td>${Data.BranchYear}</td>
                            <td>${Data.CDate}</td>
                            <td>
                                <a href="#" class="table_button" onclick="generatePDFAdmin('${Key}')"><i class="fa fa-eye"></i></a>
                            </td>
                            <td>
                                <a href="#" class="table_button" onclick="deleteCertificate('${Key}')"><i class="fa fa-trash"></i></a>
                            </td>
                        </tr>`;
                    document.getElementById("certificates-table").innerHTML += row;
                });
            });
        });
    });
}


// Delete Certificate Data
function deleteCertificate(key) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-2',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You want to Delete this Record!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Get Roll No & Template ID
            firebase.database().ref('Certificates/' + key).on('value', function (snapshot) {
                data = snapshot.val();
                roll = data.CRollNo;
                template = data.CTID;
            });
            firebase.database().ref('Certificates/' + key).remove();
            swalWithBootstrapButtons.fire(
                'Deleted Successfully!',
                'Record Deleted Successfully.',
                'success'
            )
            // Reduce Counter
            firebase.database().ref('CTemplates/' + template).on('value', function (snapshot) {
                data = snapshot.val();
                count = data.CIssued;
            });
            count = count - 1;
            firebase.database().ref('CTemplates/' + template).update({
                CIssued: count
            });
            // Reduce Student Counter
            firebase.database().ref('Students/' + roll).on('value', function (snapshot) {
                data = snapshot.val();
                count = data.No;
            });
            count = count - 1;
            firebase.database().ref('Students/' + roll).update({
                No: count
            });
            getCertificatesDetails();
            loadSelect();
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
}
