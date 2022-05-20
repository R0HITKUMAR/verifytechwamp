//Student Form Functions
$('#student-form').submit(function (e) {
    var ID = $('#srollno').val();
    e.preventDefault();
    firebase.database().ref('Students/' + ID).on('value', function (snapshot) {
        if (snapshot.val() == null) {
            firebase.database().ref('Students/' + ID).set({
                Name: $('#sname').val(),
                BranchYear: $('#sby').val(),
                Rollno: $('#srollno').val(),
                ContactNo: $('#scontactno').val(),
                Email: $('#semail').val(),
                No: 0,
            });
            getStudentsDetails();
            loadSelect();
            $('#student-form')[0].reset();
            document.getElementById("StudentFormAlert").classList.remove("d-none");
            document.getElementById("StudentFormAlert").innerHTML = "Record Added Successfully!";
            document.getElementById("StudentFormSubmitButton").value = "Submitted";
            Toast.fire({
                icon: 'success',
                title: 'Student Added Successfully.'
            })
            getStudentsDetails();
        }
        else {
            Toast.fire({
                icon: 'error',
                title: 'Student Already Exists.'
            })
        }
    });
});

// Student Form Functions
function checkContactNo() {
    var contactNo = $('#scontactno').val();
    if (contactNo.length < 10) {
        $('#scontactno').css('border-color', 'red');
        $('#scontactno').attr('placeholder', 'Enter Valid contact no.');
        $('#scontactno').val('');
        Toast.fire({
            icon: 'error',
            title: 'Enter Valid Contact No.'
        })
    } else {
        $('#scontactno').css('border-color', 'green');
    }
}

function checkEmail() {
    var email = $('#semail').val();
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!emailReg.test(email)) {
        $('#semail').css('border-color', 'red');
        $('#semail').attr('placeholder', 'Enter Valid Email Address.');
        $('#semail').val('');
        Toast.fire({
            icon: 'error',
            title: 'Enter Valid Email Address.'
        })

    }
    else {
        $('#semail').css('border-color', 'green');
    }
}

function resetStudentForm() {
    $('#student-form')[0].reset();
    document.getElementById("StudentFormAlert").classList.add("d-none");
    document.getElementById("srollno").readOnly = false;
    document.getElementById("StudentFormSubmitButton").classList.remove("d-none");
    document.getElementById("StudentFormUpdateButton").classList.add("d-none");
}


// Retrive Students Data
function getStudentsDetails() {
    firebase.database().ref('Students').on('value', function (snapshot) {
        document.getElementById("students-table").innerHTML = "";
        var e = 1;
        snapshot.forEach(function (childSnapshot) {
            data = childSnapshot.val();
            key = childSnapshot.key;
            row =
                `<tr>
                    <td>${e++}</td>
                    <td>${data.Rollno}</td>
                    <td>${data.Name}</td>
                    <td>${data.BranchYear}</td>
                    <td>${data.ContactNo}</td>
                    <td>${data.Email}</td>
                    <td>${data.No}</td>
                    <td>
                        <a onclick="viewStudent('${data.Rollno}')" class="table_button"><i class="fa fa-eye"></i></a>
                    </td>
                    <td>
                        <a href="https://web.whatsapp.com/send?phone=+91${data.ContactNo}" class="table_button" target="_blank"><i class="fa fa-brands fa-whatsapp"></i></a>
                        <a href="mailto:${data.Email}" class="table_button" target="_blank"><i class="fa fa-envelope"></i></a>
                    </td>
                    <td>
                        <a href="#" class="table_button" onclick="editStudent('${key}')"><i class="fa fa-edit"></i></a>
                    </td>
                    <td>
                        <a href="#" class="table_button" onclick="deleteStudent('${key}')"><i class="fa fa-trash"></i></a>
                    <td>
                </tr>`;
            document.getElementById("students-table").innerHTML += row;
        });
    });
}


// Edit Student
function editStudent(key) {
    $('#addStudent').collapse('show');
    $('html, body').animate({
        scrollTop: $("#students-section").offset().top
    }, 500);
    firebase.database().ref('Students/' + key).on('value', function (snapshot) {
        data = snapshot.val();
        document.getElementById("sname").value = data.Name;
        document.getElementById("sby").value = data.BranchYear;
        document.getElementById("srollno").value = data.Rollno;
        document.getElementById("scontactno").value = data.ContactNo;
        document.getElementById("semail").value = data.Email;
        document.getElementById("srollno").readOnly = true;
        document.getElementById("StudentFormSubmitButton").classList.add("d-none");
        document.getElementById("StudentFormUpdateButton").classList.remove("d-none");
    });
}

//Update Student
function updateStudent() {
    var Key = $('#srollno').val();
    firebase.database().ref('Students/' + Key).update({
        Name: $('#sname').val(),
        BranchYear: $('#sby').val(),
        Rollno: $('#srollno').val(),
        ContactNo: $('#scontactno').val(),
        Email: $('#semail').val(),
    });
    Toast.fire({
        icon: 'success',
        title: 'Student Updated Successfully.'
    })
    getStudentsDetails();
    loadSelect();
    $('#student-form')[0].reset();
    document.getElementById("StudentFormSubmitButton").classList.remove("d-none");
    document.getElementById("StudentFormUpdateButton").classList.add("d-none");
    document.getElementById("srollno").readOnly = false;
    document.getElementById("StudentFormAlert").classList.remove("d-none");
    document.getElementById("StudentFormAlert").innerHTML = "Record Updated Successfully!";
    document.getElementById("StudentFormSubmitButton").value = "Submitted";
    getStudentsDetails();
}

// Delete Student
function deleteStudent(key) {
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
            firebase.database().ref('Students/' + key).on('value', function (snapshot) {
                data = snapshot.val();
                if (data.No == 0) {
                    firebase.database().ref('Students/' + key).remove();
                    swalWithBootstrapButtons.fire(
                        'Deleted Successfully!',
                        'Record Deleted Successfully.',
                        'success'
                    )
                    getStudentsDetails();
                    loadSelect();
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
}


function viewStudent(ID) {
    var Modal = document.getElementById("modalBody");
    Modal.innerHTML = "";
    firebase.database().ref('Students/' + ID).on('value', function (snapshot) {
        data = snapshot.val();
        if (data == null) {
            Alert = `
            <div class="container">
                <div class="card">
                    <div class="card-body  m-5">
                    <h5 class="card-title text-center">${document.getElementById("user-name-card").innerHTML}</h5>
                        <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">
                            <strong>Error!</strong> Student Not Found. Contact Admin
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="container">
                            <p class="card-text mt-5"><b>From CStore powered by TECHWAMP Engineering College</b></p>
                            <div id="cstoreCertificates"></div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            Modal.innerHTML = Alert;
        }
        else {
            if (data.DP == null)
                DP = './assets/img/icon/profile.png';
            else {
                DP = data.DP;
            }
            var Student = `
            <div class="container">
                <div class="card">
                    <div class="card-body" id="userCard">
                        <h5 class="card-title text-center">${data.Name}</h5>
                        <div class="row no-gutters">
                        <div class="col-md-4 col-12 text-center">
                            <img src="${DP}" id="userDP" alt="profile" class="img-fluid mb-3" style="border-radius: 50%;" width="100px">
                        </div>
                        <div class="col-md-4 col-12 mb-5">
                            <p class="card-text">
                            <b>Roll No :</b> ${data.Rollno}<br>
                            <b>Branch & Year :</b> ${data.BranchYear}<br>
                            <b>Email Address :</b> ${data.Email}<br>
                            <b>Phone No. :</b> +91 ${data.ContactNo}<br>
                            </p>
                        </div>
                        <div class="col-md-4 col-12 text-center mb-5">
                            <b>Total Certificates Issued :</b> ${data.No}<br>
                            <b>Total Certificates Added : </b><span id="certificates-added">0</span><br>
                        </div>
                        </div>
                        <div class="container">
                            <p class="card-text mt-5"><b>From TECHWAMP Engineering College</b></p>
                            <div id="techwampCertificates"></div>
                        </div>
                        <div class="container">
                            <p class="card-text mt-5"><b>From CStore powered by TECHWAMP Engineering College</b></p>
                            <div id="cstoreCertificates"></div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            Modal.innerHTML = Student;
            loadCertificates(ID, data.No);
        }
        cstoreCertificates(ID);
    });
    document.getElementById("showAttachment").click();
}

function loadCertificates(ID, no) {
    var contents = document.getElementById("techwampCertificates");
    if (no == 0) {
        Alert = `
        <img src="./assets/img/icon/no-cert.svg" width="100%">
        `;
        contents.innerHTML = Alert;
    }
    else {
        contents.innerHTML = "";
        contents.classList.add("row");
        firebase.database().ref('Certificates').on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.val().CRollNo == ID) {
                    firebase.database().ref('Students/' + childSnapshot.val().CRollNo).on('value', function (ssnapshot) {
                        firebase.database().ref('CTemplates/' + childSnapshot.val().CTID).on('value', function (tsnapshot) {
                            const Data = extend({}, childSnapshot.val(), ssnapshot.val(), tsnapshot.val());
                            doc = `
                            <div class="col-lg-6 col-12">
                                <div class="card text-white bg-info mb-3 text-center">
                                    <div class="card-header">Certificate ID : ${Data.CID}</div>
                                    <div class="card-body">
                                        <h3 class="card-title text-light">${Data.CName}</h3>
                                        <p class="card-text">Issued to ${Data.Name} on ${Data.CDate}</p>
                                        <button data-dismiss="modal" onclick="generatePDFAdmin('${Data.CID}')"
                                            class="btn btn-outline-warning">View Certificate</button>
                                    </div>
                                </div>
                            </div>`;
                            contents.innerHTML += doc;
                        });
                    });
                }
            });
        });
    }
}

function cstoreCertificates(ID) {
    var contents = document.getElementById("cstoreCertificates");
    firebase.database().ref("CStore/" + ID).on('value', function (snapshot) {
        if (snapshot.val() == null) {
            Alert = `
            <img src="./assets/img/icon/no-add.svg" width="100%">
            `;
            contents.innerHTML = Alert;
        }
        else {
            contents.innerHTML = "";
            contents.classList.add("row");
            e = 0;
            snapshot.forEach(function (childSnapshot) {
                data = childSnapshot.val();
                ++e;
                // Check No
                if (data.cno == "")
                    No = "";
                else
                    No = `Certificate ID : ${data.cno}`;

                // Check Verify Link
                if (data.verifyL == "")
                    Verify = "";
                else
                    Verify = `<a class="btn btn-outline-warning" href="${data.verifyL}" target="_blank">Verify</a>`;
                doc = `
                        <div class="col-lg-6 col-12">
                            <div class="card text-white bg-info mb-3 text-center">
                                <div class="card-header">${No}</div>
                                <div class="card-body">
                                    <h3 class="card-title text-light">${data.cname}</h3>
                                    <p class="card-text">Issued by ${data.issauth}<br>
                                    Issued to ${data.Name} on ${data.issue_date}</p>
                                    <button data-dismiss="modal" onclick="ShowAttachment('${data.viewL}')" class="btn btn-outline-warning">View</button>
                                    ${Verify}
                                </div>
                            </div>
                        </div>`;
                contents.innerHTML += doc;
            });
            document.getElementById("certificates-added").innerHTML = e;
        }
    });
}