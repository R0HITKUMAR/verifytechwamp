// Template Form Functions
function resetTemplateForm() {
    $('#template-form')[0].reset();
    document.getElementById("TemplateFormAlert").classList.add("d-none");
    document.getElementById("TemplateFormSubmitButton").classList.remove("d-none");
    document.getElementById("TemplateFormUpdateButton").classList.add("d-none");
    Toast.fire({
        icon: 'success',
        title: 'Form Reset Successfully.'
    })
}

//Template Form Functions
$('#template-form').submit(function (e) {
    e.preventDefault();
    var now = Date.now();
    var ID = "TWECT" + now;
    firebase.database().ref('CTemplates/' + ID).set({
        CTID: ID,
        CName: $('#ctname').val(),
        CDescription: $('#cdescription').val(),
        CIssued: 0,
    });
    $('#template-form')[0].reset();
    document.getElementById("TemplateFormAlert").classList.remove("d-none");
    document.getElementById("TemplateFormAlert").innerHTML = "Template Added Successfully!";
    document.getElementById("TemplateFormSubmitButton").value = "Submitted";
    Toast.fire({
        icon: 'success',
        title: 'Template Added Successfully.'
    })
});

// Retrive Templates Data
function getTemplateDetails() {
    firebase.database().ref('CTemplates').on('value', function (snapshot) {
        document.getElementById("templates-table").innerHTML = "";
        var e = 1;
        snapshot.forEach(function (childSnapshot) {
            data = childSnapshot.val();
            key = childSnapshot.key;
            row =
                `<tr>
                    <td>${e}</td>
                    <td>${data.CTID}</td>
                    <td>${data.CName}</td>
                    <td>${data.CDescription}</td>
                    <td>${data.CIssued}</td>
                    <td>
                        <a href="#" class="table_button" onclick="generatePDFTemplate('${key}')"><i class="fa fa-eye"></i></a>
                    </td>
                    <td>
                        <a href="#" class="table_button" onclick="editTemplate('${key}')"><i class="fa fa-edit"></i></a>
                    </td>
                    <td>
                        <a href="#" class="table_button" onclick="deleteTemplate('${key}')"><i class="fa fa-trash"></i></a>
                    <td>
                </tr>`;
            document.getElementById("templates-table").innerHTML += row;
        });
    });
}


// Edit Template
function editTemplate(key) {
    $('#addTemplate').collapse('show');
    $('html, body').animate({
        scrollTop: $("#addTemplate-section").offset().top
    }, 500);
    firebase.database().ref('CTemplates/' + key).on('value', function (snapshot) {
        data = snapshot.val();
        document.getElementById("ctno").value = data.CTID;
        document.getElementById("ctname").value = data.CName;
        document.getElementById("cdescription").value = data.CDescription;
        document.getElementById("TemplateFormSubmitButton").classList.add("d-none");
        document.getElementById("TemplateFormUpdateButton").classList.remove("d-none");
    });
}

//Update Template
function updateTemplate() {
    var Key = $('#ctno').val();
    firebase.database().ref('CTemplates/' + Key).update({
        CName: $('#ctname').val(),
        CDescription: $('#cdescription').val(),
    });
    Toast.fire({
        icon: 'success',
        title: 'Template Updated Successfully.'
    })
    $('#template-form')[0].reset();
    document.getElementById("TemplateFormSubmitButton").classList.remove("d-none");
    document.getElementById("TemplateFormUpdateButton").classList.add("d-none");
    document.getElementById("TemplateFormAlert").classList.remove("d-none");
    document.getElementById("TemplateFormAlert").innerHTML = "Record Updated Successfully!";
    document.getElementById("TemplateFormSubmitButton").value = "Submitted";
    getTemplatesDetails();
}

// Delete Template
function deleteTemplate(key) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-2',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You want to Delete this Template!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            firebase.database().ref('CTemplates/' + key).on('value', function (snapshot) {
                data = snapshot.val();
                if (data.CIssued == 0) {
                    firebase.database().ref('CTemplates/' + key).remove();
                    swalWithBootstrapButtons.fire(
                        'Deleted Successfully!',
                        'Template Deleted Successfully.',
                        'success'
                    )
                    getTemplatesDetails();
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
