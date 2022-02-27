function getCStoreCertificates() {
    document.getElementById("cstore-table").innerHTML = "";
    var e = 1;
    firebase.database().ref("CStore/").on('value', function (psnapshot) {
        psnapshot.forEach(function (snapshot) {
            Pkey = snapshot.key;
            snapshot.forEach(function (childSnapshot) {
                data = childSnapshot.val();
                key = Pkey + "/" + childSnapshot.key;
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
                    <td><a class="table_button" onclick="deleteData('${key}')"><i class="fa fa-trash"></i></a></td>
                </tr>`;
                document.getElementById("cstore-table").innerHTML += row;
            });
        });
        document.getElementById("total_certificates-added").innerHTML = e
    });
}

function deleteData(Key) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-2',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You want to Delete this Certificate!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            firebase.database().ref('CStore/' + Key).remove();
            swalWithBootstrapButtons.fire(
                'Deleted Successfully!',
                'Data Deleted Successfully.',
                'success'
            )
            getCStoreCertificates();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Cancelled by User',
                'error'
            )
        }
    })
}
