// Back to Login
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        location.replace("login.html")
    }
    loadUser();
})

function loadUser() {
    const user = firebase.auth().currentUser;
    const UserName = user.displayName;
    const UserEmail = user.email;
    const UserRoll_No = user.photoURL;

    // Profile Name
    document.getElementById("user-name-card").innerHTML = UserName + " / " + UserRoll_No;

    // Profile Forms
    document.getElementById("profile-email").value = UserEmail;
    document.getElementById("new-name").value = UserName;
    document.getElementById("new-phone").value = UserRoll_No;

    //Tickets Form
    document.getElementById("u_roll").value = UserRoll_No;
    document.getElementById("u_name").value = UserName;

    // CStore Form
    document.getElementById("cstore_roll").value = UserRoll_No;
    document.getElementById("cstore_name").value = UserName;

    // Calculate Certificates Issued
    firebase.database().ref('Students/' + UserRoll_No).on('value', function (snapshot) {
        data = snapshot.val();
        document.getElementById("total_certificates_issued").innerHTML = data.No;
    });

    // Calculate Certificates Added
    firebase.database().ref('CStore/' + UserRoll_No).on('value', function (snapshot) {
        document.getElementById("total_certificates_issued_cstore").innerHTML = snapshot.numChildren();

    });

    //Profile Image
    getUserDetails(UserRoll_No);
    //My Certificates
    viewStudent(UserRoll_No);

    //CStore
    getCStoreCertificates(UserRoll_No);

    //Tickets
    getTicketsDetails(UserRoll_No);
    calculateTickets(UserRoll_No);
}

// Logout Function with Prompt
function logoutwithprompt() {
    Swal.fire({
        icon: 'question',
        title: 'Are you sure you want to logout?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`
    }).then((result) => {
        if (result.isConfirmed) {
            firebase.auth().signOut()
        }
    })
}
function logout() {
    firebase.auth().signOut()
}


// Change Password Function
function changePass() {
    var Alert = document.getElementById("profileCredentialAlert");
    const newPassword = document.getElementById("new-password").value;
    if (newPassword != "") {
        document.getElementById("changePassButton").disabled = true;
        document.getElementById("changePassButton").value = 'Loading..';
        const user = firebase.auth().currentUser;
        user.updatePassword(newPassword).then(() => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Password Updated Successfully!</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
            document.getElementById("changePassButton").value = 'Successful';
            setTimeout(logout, 5000)

        }).catch((error) => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>${error.message}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
            document.getElementById("changePassButton").value = 'Try Again';
        });
    }
    else {
        AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Enter a Valid Password</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        Alert.innerHTML += AlertText;
    }
}

// Update Email Function
function updateemail() {
    var Alert = document.getElementById("profileCredentialAlert");
    const email = document.getElementById("newemail").value;
    if (email != "") {
        document.getElementById("updateemailButton").disabled = true;
        document.getElementById("updateemailButton").value = 'Loading..';
        const user = firebase.auth().currentUser;
        user.updateEmail(email).then(() => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Email Updated Successfully!</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
            window.setTimeout(function () { location.reload() }, 3000)
        }).catch((error) => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>${error.message}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
        });
    }
    else {
        AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Enter a Valid Email Address</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        Alert.innerHTML += AlertText;
    }
}

// Update Name Function
function updatename() {
    var Alert = document.getElementById("profileUpdateAlert");
    const name = document.getElementById("new-name").value;
    if (name != "") {
        document.getElementById("updatenameButton").disabled = true;
        document.getElementById("updatenameButton").value = 'Loading..';
        const user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: name
        }).then(() => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Name Updated Successfully</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
        }).catch((error) => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>${error.message}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
        });
    }
    else {
        AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Enter a Valid Name</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        Alert.innerHTML += AlertText;
    }
}

//Update Roll No Function
function updatephone() {
    var Alert = document.getElementById("profileUpdateAlert");
    const phone = document.getElementById("new-phone").value;
    if (phone != "") {
        document.getElementById("updatephoneButton").disabled = true;
        document.getElementById("updatephoneButton").value = 'Loading..';
        const user = firebase.auth().currentUser;
        user.updateProfile({
            photoURL: phone
        }).then(() => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Roll No Updated Successfully</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
        }).catch((error) => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>${error.message}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
        });
    }
    else {
        AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Enter a Valid Roll No</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        Alert.innerHTML += AlertText;
    }

}

// Delete Profile Function
function deleteprofile() {
    var A = confirm("Are you sure you want to delete your profile?");
    if (A == true) {
        const user = firebase.auth().currentUser;
        user.delete().then(() => {
            Toast.fire({ icon: 'success', title: 'Profile Deleted Successfully!' });
            alert("Profile Deleted Successfully")
        }).catch((error) => {
            Toast.fire({ icon: 'error', title: error.message });
        });
    }
}

function getUserDetails(ID = document.getElementById("new-phone").value) {
    var Container = document.getElementById('userProfile');
    Container.innerHTML = "";
    firebase.database().ref('Students/' + ID).once('value').then(function (snapshot) {
        var data = snapshot.val();
        if (data.Name == null) {
            if (data.DP == null)
                DP = './assets/img/icon/profile.png';
            else{
                DP = data.DP;
                document.getElementById('user-profile-photo').src = DP;
            }
            var D = `
            <div class="row">
                <div class="col-12">
                <div class="card card-body mb-5">
                    <!--User Profile-->
                    <div class="row">
                    <div class="col-12 text-center">
                        <img src="${DP}" id="userDP"  alt="profile" class="img-fluid mb-3 rounded-circle" width="100px">
                    </div>
                    </div>
                </div>
                </div>
            </div>`;
            Container.innerHTML = D;
        }
        else {
            if (data.DP == null)
                DP = './assets/img/icon/profile.png';
            else{
                DP = data.DP;
                document.getElementById('user-profile-photo').src = DP;
            }
                
            var D = `
            <div class="row">
                <div class="col-12">
                <div class="card card-body mb-5">
                    <!--User Profile-->
                    <div class="row">
                    <div class="col-md-4 col-12 text-center">
                        <img src="${DP}" id="userDP" alt="profile" class="img-fluid mb-3" style="border-radius: 50%;" width="100px">
                    </div>
                    <div class="col-lg-4 col-12">
                        <b>Name : </b> ${data.Name}<br>
                        <b>Roll No. : </b> ${data.Rollno}<br>
                        <b>Branch & Year : </b> ${data.BranchYear}<br>
                    </div>
                    <div class="col-lg-4 col-12">
                        <b>Email :</b> ${data.Email}<br>
                        <b>Contact No :</b> ${data.ContactNo}<br>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            `;
            Container.innerHTML = D;
        }
    });
}

function trialImage(){
    var file = document.getElementById("profile-photo").files[0];
    document.getElementById('userDP').src = URL.createObjectURL(file);
    document.getElementById('user-profile-photo').src = URL.createObjectURL(file);
}

function updatephoto() {
    var Alert = document.getElementById("profileUpdateAlert");
    var button = document.getElementById("updatephotoButton");
    var file = document.getElementById("profile-photo").files[0];
    var ID = document.getElementById("new-phone").value;
    if (file !== undefined) {
        var storageRef = firebase.storage().ref(ID + file.name);
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
                    document.getElementById("CfileUploadPart").innerHTML = FileButton;
                    firebase.database().ref('Students/' + ID).update({
                        DP: url
                    });
                    getUserDetails();
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