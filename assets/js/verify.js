const certificateno = new URLSearchParams(window.location.search);
if (certificateno != "") {
    if (certificateno.get('no') != null) {
        verifyCertificate(certificateno.get('no'));
    }
    else if (certificateno.get('sno') != null) {
        verifyStudent(certificateno.get('sno'));
    }
    else {
        window.location.href = "./verify.html";
    }
}

function verifyCertificate(ID = document.getElementById('cno').value) {
    var container = document.getElementById('verify');
    container.innerHTML = `
    <div class="center" style="text-align: center;padding-top: 10%;">
            <img src="./assets/img/logo/full-dark.png" height="100px" class="mb-5"><br>
            <i class="fa-solid fa-spin fa-circle-notch mb-3" style="font-size: 100px;"></i><br>
            Loading..
    </div>
    `;
    firebase.database().ref('Certificates/' + ID).on('value', function (snapshot) {
        if (snapshot.val() == null) {
            Alert =
                `
            <div class="container">
                <div class="card card-body m-1 mt-5 mb-5">
                <div class="text-right">
                        <a href="verify.html" class="btn btn-primary btn-sm text-light"> <i class="fas fa-home"></i> Home</a>
                    </div>
                <center><img src="./assets/img/logo/full-dark.png" width="200px"></center>
                    <p class="h3 text-center mb-5">TECHWAMP Engineering College</p>
                    <img src="https://v1.verifytechwamp.ml/assets/img/no-record-found.svg" height="200px">
                    <!-- Search Another -->
                    <div class="row mt-5">
                        <div class="col-md-6 offset-md-3">
                            <div class="form-group">
                                <input type="text" class="form-control" id="cno" placeholder="Search Another Certificate">
                            </div>
                            <div class="form-group">
                                <button type="submit" onclick="verifyCertificate()"
                                    class="btn btn-primary btn-block">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            `;
            container.innerHTML = Alert;
        }
        else {
            firebase.database().ref('Students/' + snapshot.val().CRollNo).on('value', function (ssnapshot) {
                firebase.database().ref('CTemplates/' + snapshot.val().CTID).on('value', function (tsnapshot) {
                    const Data = extend({}, snapshot.val(), ssnapshot.val(), tsnapshot.val());
                    let result = `
                    <div class="container">
                        <div class="card card-body m-1 mt-5 mb-5">
                            <p class="h3 text-center">TECHWAMP Engineering College</p>
                            <p class="h6 text-center">Certificate Title : ${Data.CName}</p>
                            <div class="flex">
                                <span class="float-left mb-5">
                                    <a href="verify.html" class="btn btn-primary btn-sm text-light"> <i class="fa fa-home"></i></a>
                                    <button class="btn btn-primary btn-sm text-light" onclick="window.location.reload();"> <i
                                            class="fa-solid fa-backward"></i></button>
                                </span>
                                <span class="float-right mb-5">
                                    <a class="btn btn-primary btn-sm text-light" id="certificate-download"> <i
                                            class="fas fa-download"></i></a>
                                    <button class="btn btn-primary btn-sm text-light" onclick="window.print();"> <i
                                            class="fa-solid fa-print"></i></button>
                                </span>
                            </div>
                            <div class="row">
                                <div class="col-md-8 col-12">
                                    <div id="pdf-viewer">
                                        <div class="center" style="text-align: center;padding-top: 10%;">
                                            <img src="./assets/img/logo/full-dark.png" height="100px" class="mb-5"><br>
                                            <i class="fa-solid fa-spin fa-circle-notch mb-3" style="font-size: 100px;"></i><br>
                                            Generating...
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 col-12">
                                <label><b>Certificate Verification Link</b></label>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" id="clink" value='https://verifytechwamp.ml?no=${Data.CID}' readonly>
                                        <div class="input-group-append">
                                            <button class="btn btn-primary" id="cbutton" onclick="copyText('cbutton','clink')" type="button"><i class="fa-solid fa-copy"></i></button>
                                        </div>
                                    </div>
                                    <!-- View Certificate Holder Details -->
                                    <div class="card card-body mt-5 text-center">
                                        <center><img src="./assets/img/Others/verifies.jpg" class="text-center mb-5" width="40%">
                                        </center>
                                        This Certificate is issued to <span class="tbold">${Data.Name}</span>

                                        <p class="h5 mt-5 text-center">Details</p>
                                        <span class="tbold">Certificate ID : </span>${Data.CID}
                                        <span class="tbold">Date of Issue : </span>${Data.CDate}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    container.innerHTML = result;
                    var today = new Date().toLocaleString('en-CA', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    var img = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://verifytechwamp.ml?no=${ID}`;
                    generatePDF(ID, Data.CDescription, img, Data.Name, Data.CRollNo, Data.BranchYear, Data.CDate, today, 3);
                });
            });
        }
    });
}

function copyText(bid, iid) {
    var Input = document.getElementById(iid);
    var Button = document.getElementById(bid);
    navigator.clipboard.writeText(Input.value);
    Button.innerHTML = `<i class="fa-solid fa-clone"></i>`;
    setTimeout(function () {
        Button.innerHTML = `<i class="fa-solid fa-copy"></i>`;
    }, 2000)
}

function verifyStudent(ID) {
    var Modal = document.getElementById('verify');
    Modal.innerHTML = `
    <div class="center" style="text-align: center;padding-top: 10%;">
            <img src="./assets/img/logo/full-dark.png" height="100px" class="mb-5"><br>
            <i class="fa-solid fa-spin fa-circle-notch mb-3" style="font-size: 100px;"></i><br>
            Loading..
    </div>
    `;
    firebase.database().ref('Students/' + ID).on('value', function (snapshot) {
        data = snapshot.val();
        if (data == null) {
            Alert = `
                <div class="container">
                    <div class="card card-body m-1 mt-5 mb-5">
                    <div class="flex">
                                <span class="float-left">
                                    <a href="verify.html" class="btn btn-primary btn-sm text-light"> <i class="fa fa-home"></i></a>
                                    <button class="btn btn-primary btn-sm text-light" onclick="window.location.reload();"> <i
                                            class="fa-solid fa-refresh"></i></button>
                                </span>
                            </div>
                            <center><img src="./assets/img/logo/full-dark.png" width="200px"></center>
                    <p class="h3 text-center mb-5">TECHWAMP Engineering College</p>
                    <img src="./assets/img/icon/not-found.svg" width="100%">
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
                    <div class="card card-body m-1 mt-5 mb-5" id="userCard">
                            <h5 class="card-title text-center">${data.Name}</h5>
                            <div class="flex">
                                <span class="float-left mb-5">
                                    <a href="verify.html" class="btn btn-primary btn-sm text-light"> <i class="fa fa-home"></i></a>
                                    <button class="btn btn-primary btn-sm text-light" onclick="window.location.reload();"> <i
                                            class="fa-solid fa-refresh"></i></button>
                                </span>
                                <span class="float-right mb-5">
                                    <button class="btn btn-primary btn-sm text-light" onclick="window.print();"> <i
                                            class="fa-solid fa-print"></i></button>
                                </span>
                            </div>
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
                            <label><b>Public Profile Link</b></label>
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" id="slink" value='https://verifytechwamp.ml?sno=${data.Rollno}' readonly>
                                <div class="input-group-append">
                                    <button class="btn btn-primary" id="sbutton" onclick="copyText('sbutton','slink')" type="button"><i class="fa-solid fa-copy"></i></button>
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
                                        <button data-dismiss="modal" onclick="verifyCertificate('${Data.CID}')"
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


// PDF Viewer
function ShowAttachment(url) {
    var Modal = document.getElementById("gmodalBody");
    doc = `<iframe src="${url}" style="width:100%; height:800px;"></iframe>`;
    Modal.innerHTML = doc;
    document.getElementById("gattachmentButton").click();

    const link = document.getElementById("gattachmentDownload");
    link.href = url;
}