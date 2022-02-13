getStudentsDetails();

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
    Toast.fire({
        icon: 'success',
        title: 'Form Reset Successfully.'
    })
}

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
                    <td>${e}</td>
                    <td>${data.Rollno}</td>
                    <td>${data.Name}</td>
                    <td>${data.BranchYear}</td>
                    <td>${data.ContactNo}</td>
                    <td>${data.Email}</td>
                    <td>${data.No}</td>
                    <td>
                        <a href="#" class="table_button" onclick="#"><i class="fa fa-eye"></i></a>
                    </td>
                    <td>
                        <a href="https://web.whatsapp.com/send?phone=+91${data.ContactNo}" class="table_button" target="_blank"><i class="fa fa-whatsapp"></i></a>
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
