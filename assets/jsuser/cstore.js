$('#cstore-form').submit(function (e) {
    e.preventDefault();
});


//------------------------------------------------- Firebase Realtime Database -------------------------------------------------//

// Read Database
function getCStoreCertificates(Roll_No = document.getElementById("cstore_roll").value) {
    $('#cstoreTable').DataTable().destroy();
    document.getElementById("cstore-table").innerHTML = "";
    firebase.database().ref("CStore/" + Roll_No).on('value', function (snapshot) {
        document.getElementById("cstore-table").innerHTML = "";
        var e = 1;
        snapshot.forEach(function (childSnapshot) {
            data = childSnapshot.val();
            key = Roll_No + "/" + childSnapshot.key;
            if (data.verifyL != "") {
                var verify = `<a href="${data.verifyL}" class="table_button" target="_blank"><i class="fa fa-eye"></i></a> `;
            }
            else {
                var verify = `-`;
            }
            row =
                `<tr>
                    <td>${e++}</td>
                    <td>${data.cno}</td>
                    <td>${data.cname}</td>
                    <td>${data.issauth}</td>
                    <td>${data.issue_date}</td>
                    <td>${verify}</td>
                    <td><a class="table_button" onclick="ShowAttachment('${data.viewL}')"><i class="fa fa-eye"></i></a></td>
                    <td><a class="table_button" onclick="editCertificate('${key}')"><i class="fa fa-edit"></i></a></td>
                    <td><a class="table_button" onclick="deleteCertificate('${key}')"><i class="fa fa-trash"></i></a></td>
                </tr>`;
            document.getElementById("cstore-table").innerHTML += row;
        });
        $('#cstoreTable').DataTable({
            "order": [[0, "desc"]],
            "pageLength": 40,
            dom: 'Bfrtip',
            paging: false,
            destroy: true,
            buttons: [
                {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'print',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'pdfHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                }
            ]
        });
    });
}


// Add, Update, Delete Certificate
function addCertificate() {
    var Alert = document.getElementById("CStoreAlert");
    Alert.innerHTML = "";
    var button = document.getElementById("cstoreSubmittedButton");
    var Name = document.getElementById("cstore_name").value.toUpperCase();
    var Roll_No = document.getElementById("cstore_roll").value.toUpperCase();
    var cno = document.getElementById("cstore_no").value.toUpperCase() || "";
    var cname = document.getElementById("cstore_cname").value.toUpperCase();
    var auth = document.getElementById("cstore_issuingauthority").value.toUpperCase();
    var issue_date = document.getElementById("cstore_issuedate").value.toUpperCase();
    var verifyL = document.getElementById("cstore_verify").value.toLowerCase() || "";
    var viewL = document.getElementById("cstore_viewurl").value;
    //Add Data
    if (Name !== "" && Roll_No !== "" && cname !== "" && auth !== "" && issue_date !== "" && viewL !== "") {
        var ID = "CStore/" + Roll_No + "/" + $('#datenow').val();
        firebase.database().ref(ID).set({
            Name: Name,
            Roll_No: Roll_No,
            cno: cno,
            cname: cname,
            issauth: auth,
            issue_date: issue_date,
            verifyL: verifyL,
            viewL: viewL
        }).then(function () {
            $('#cstore-form')[0].reset();
            loadUser();
            document.getElementById("CfileUploadPart").innerHTML = "";
            document.getElementById("cstore-file").disabled = false;
            document.getElementById("cstoreFileUploadButton").disabled = false;
            console.log("Data Added Successfully");
            AlertText = `
                <div class="alert alert-success  alert-dismissible fade show text-center mb-1" role="alert">
                    <strong>Certificate Added Successfully</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>`;
            Alert.innerHTML = AlertText;
            button.disabled = true;

        }).catch(function (error) {
            console.log(error);
            AlertText = `
                <div class="alert alert-danger alert-dismissible fade show text-center mb-1" role="alert">
                    <strong>Error !</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>`;
            Alert.innerHTML = AlertText;
            button.disabled = false;
        });
    }
    else {
        AlertText = `<div class="alert alert-danger alert-dismissible fade show text-center" role="alert">
                        <strong>Please Fill All Fields</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
        Alert.innerHTML = AlertText;
    }
}

// Edit Certificate
function editCertificate(Key) {
    var Alert = document.getElementById("CStoreAlert");
    document.getElementById("cstoreSubmittedButton").classList.add("d-none");
    document.getElementById("cstoreUpdateButton").classList.remove("d-none");
    Alert.innerHTML = "";
    $('#addCertificate').collapse('show');
    $('html, body').animate({
        scrollTop: $("#cstore_section").offset().top
    }, 500);
    firebase.database().ref("CStore/" + Key).once("value", function (snapshot) {
        document.getElementById("datenow").value = snapshot.key;;
        document.getElementById("cstore_no").value = snapshot.val().cno;
        document.getElementById("cstore_cname").value = snapshot.val().cname;
        document.getElementById("cstore_issuingauthority").value = snapshot.val().issauth;
        document.getElementById("cstore_issuedate").value = snapshot.val().issue_date;
        document.getElementById("cstore_verify").value = snapshot.val().verifyL;
        document.getElementById("cstore_viewurl").value = snapshot.val().viewL;
        FileButton = `
        <label>Edit File</label><br>
        <button onclick="ShowAttachment('${snapshot.val().viewL}')" type="button" class="btn btn-primary btn-sm" style="float: left;">View</button>
        `;
        document.getElementById("CfileUploadPart").innerHTML = FileButton;
    });
}

function UpdateCertificate() {
    var Alert = document.getElementById("CStoreAlert");
    Alert.innerHTML = "";
    var Name = document.getElementById("cstore_name").value.toUpperCase();
    var Roll_No = document.getElementById("cstore_roll").value.toUpperCase();
    var cno = document.getElementById("cstore_no").value.toUpperCase() || "";
    var cname = document.getElementById("cstore_cname").value.toUpperCase();
    var auth = document.getElementById("cstore_issuingauthority").value.toUpperCase();
    var issue_date = document.getElementById("cstore_issuedate").value.toUpperCase();
    var verifyL = document.getElementById("cstore_verify").value.toLowerCase() || "";
    var viewL = document.getElementById("cstore_viewurl").value;
    var ID = "CStore/" + Roll_No + "/" + document.getElementById("datenow").value;
    //Add Data
    if (Name !== "" && Roll_No !== "" && cname !== "" && auth !== "" && issue_date !== "" && viewL !== "") {
        firebase.database().ref(ID).update({
            Name: Name,
            Roll_No: Roll_No,
            cno: cno,
            cname: cname,
            issauth: auth,
            issue_date: issue_date,
            verifyL: verifyL,
            viewL: viewL
        }).then(function () {
            $('#cstore-form')[0].reset();
            loadUser();
            document.getElementById("CfileUploadPart").innerHTML = "";
            document.getElementById("cstore-file").disabled = false;
            document.getElementById("cstoreFileUploadButton").disabled = false;
            console.log("Data Added Successfully");
            AlertText = `
                <div class="alert alert-success  alert-dismissible fade show text-center mb-1" role="alert">
                    <strong>Certificate Updated Successfully</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>`;
            Alert.innerHTML = AlertText;

        }).catch(function (error) {
            console.log(error);
            AlertText = `
                <div class="alert alert-danger alert-dismissible fade show text-center mb-1" role="alert">
                    <strong>Error !</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>`;
            Alert.innerHTML = AlertText;
        });
    }
    else {
        AlertText = `<div class="alert alert-danger alert-dismissible fade show text-center" role="alert">
                        <strong>Please Fill All Fields</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
        Alert.innerHTML = AlertText;
    }
}


function deleteCertificate(Key) {
    // Separate Roll No
    var Roll_No = Key.split("/")[0];
    var Alert = document.getElementById("CStoreAlert");
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
            firebase.database().ref("CStore/" + Key).remove();
            getCStoreCertificates(Roll_No);
            AlertText = `
                <div class="alert alert-success  alert-dismissible fade show text-center mb-1" role="alert">
                    <strong>Certificate Deleted Successfully</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>`;
            Alert.innerHTML = AlertText;
            swalWithBootstrapButtons.fire(
                'Deleted Successfully!',
                'Record Deleted Successfully.',
                'success'
            )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            AlertText = `
                <div class="alert alert-danger alert-dismissible fade show text-center mb-1" role="alert">
                    <strong>Error!</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>`;
            Alert.innerHTML = AlertText;
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Cancelled by User',
                'error'
            )
        }
    })
}

//------------------------------------------------- Firestore Functions -------------------------------------------------//

function cstoreFileUpload() {
    var Alert = document.getElementById("CStoreAlert");
    var button = document.getElementById("cstoreFileUploadButton");
    var file = document.getElementById("cstore-file").files[0];
    const extension = file.name.split('.').pop();
    var Roll_No = document.getElementById("cstore_roll").value;
    var Temp = document.getElementById("datenow").value || Date.now();
    document.getElementById("datenow").value = Temp;
    var FileName = Temp + "." + extension;
    var ID = "CStore/" + Roll_No + "/";
    if (file !== undefined) {
        var storageRef = firebase.storage().ref(ID + FileName);
        var task = storageRef.put(file);
        task.on('state_changed',
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                button.innerHTML = `Uploading <i class="fa-solid fa-spin fa-spinner ml-2"></i>`;
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
            button.innerHTML = `Uploaded <i class="fa-solid fa-check ml-2"></i>`;
            storageRef
                .getDownloadURL()
                .then(function (url) {
                    console.log(url);
                    AlertText = `
                <div class="alert alert-success  alert-dismissible fade show mb-1" role="alert">
                    <strong>File Uploaded Successfully</strong>
                    <button onclick="ShowAttachment('${url}')" class="btn btn-primary btn-sm" style="float:right">View</button>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
                    Alert.innerHTML = AlertText;

                    FileButton = `
                    <label>File Uploaded Successfullly</label><br>
                    <button onclick="ShowAttachment('${url}')" type="button" class="btn btn-primary btn-sm" style="float: left;">View</button>
                    `;
                    document.getElementById("cstore_viewurl").value = url;
                    // Disable Input
                    document.getElementById("CfileUploadPart").innerHTML = FileButton;

                })
                .catch(function (error) {
                    button.innerHTML = `Error <i class="fa-solid fa-x ml-2"></i>`;
                    AlertText = `
                <div class="alert alert-danger alert-dismissible fade show text-center mb-1" role="alert">
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
                <div class="alert alert-danger  alert-dismissible fade show text-center mb-1" role="alert">
                    <strong>Enter a Valid Reference or Choose a Valid File</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
        Alert.innerHTML = AlertText;
    }
}
