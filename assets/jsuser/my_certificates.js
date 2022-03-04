function viewStudent(ID = document.getElementById("cstore_roll").value) {
    var Modal = document.getElementById("my-cert");
    Modal.innerHTML = "";
    firebase.database().ref('Students/' + ID).on('value', function (snapshot) {
        data = snapshot.val();
        if (data == null) {
            Alert = `
            <div class="container">
                <div class="card">
                    <div class="card-body">
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
            else{
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

}

function loadCertificates(ID, no) {
    var contents = document.getElementById("techwampCertificates");
    if (no == 0) {
        Alert = `
        <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">
            <strong>No Certificates Issued!</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
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
                                        <button data-dismiss="modal" onclick="generatePDFUser('${Data.CID}')"
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
            <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">
                <strong>No Certificates Added!</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
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
                                    <button data-dismiss="modal" onclick="ShowAttachment('${data.viewL}')"
                                        class="btn btn-outline-warning">View</button>
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