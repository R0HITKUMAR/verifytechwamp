document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault()
})

function login() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {
            document.getElementById("error").style.display = "block";
            document.getElementById("error").innerHTML = error.message;
        })
}

firebase.auth().onAuthStateChanged((user) => {
    if (user.email == 'r.k2962002@gmail.com') {
        location.replace("admin.html")
    }
    else {
        location.replace("user.html")
    }
})

// Logout Function with Prompt
function logoutwithprompt() {
    var A = confirm("Are you sure you want to logout?");
    if (A == true) {
        firebase.auth().signOut()
    }
}
function logout() {
    firebase.auth().signOut()
}

// SignUp Function
function signUp() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch((error) => {
            document.getElementById("error").style.display = "block";
            document.getElementById("error").innerHTML = error.message
        });
}

// Forget Password Function
function forgotPass() {
    const email = document.getElementById("email").value
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            document.getElementById("error").style.display = "block";
            document.getElementById("error").innerHTML = ("Reset link sent to your email id")
        })
        .catch((error) => {
            document.getElementById("error").style.display = "block";
            document.getElementById("error").innerHTML = error.message
        });
}

// Change Password Function
function changePass() {
    document.getElementById("changePassButton").disabled = true;
    document.getElementById("changePassButton").value = 'Loading..';
    const user = firebase.auth().currentUser;
    const newPassword = document.getElementById("new-password").value;

    user.updatePassword(newPassword).then(() => {
        document.getElementById("changePassformalert").style.display = "block";
        document.getElementById("changePass-alert").innerHTML = ("Password updated successfully")
        document.getElementById("changePassButton").value = 'Successful';
        setTimeout(logout, 5000)

    }).catch((error) => {
        document.getElementById("changePassButton").value = 'Try Again';
        document.getElementById("changePassformalert").style.display = "block";
        document.getElementById("changePass-alert").innerHTML = error.message;
    });
}

// Delete Profile Function
function deleteprofile() {
    var A = confirm("Are you sure you want to delete your profile?");
    if (A == true) {
        document.getElementById("deleteprofileButton").disabled = true;
        document.getElementById("deleteprofileButton").value = 'Loading..';
        const user = firebase.auth().currentUser;
        user.delete().then(() => {
            document.getElementById("deleteprofilealert").style.display = "block";
            document.getElementById("delete-alert").innerHTML = ("Profile Deleted Successfully")
            document.getElementById("deleteprofileButton").value = 'Successful';
            alert("Profile Deleted Successfully")
        }).catch((error) => {
            document.getElementById("deleteprofileButton").value = 'Try Again';
            document.getElementById("deleteprofilealert").style.display = "block";
            document.getElementById("delete-alert").innerHTML = error.message;
        });
    }

}
// Update Email Function
function updateemail() {
    document.getElementById("updateemailButton").disabled = true;
    const user = firebase.auth().currentUser;
    const email = document.getElementById("newemail").value
    if (email == "") {
        document.getElementById("updateprofilealert").style.display = "block";
        document.getElementById("updateprofile-alert").innerHTML = ("Please Enter Valid Email Address")
        return false;
    }
    user.updateEmail(email).then(() => {
        document.getElementById("updateprofilealert").style.display = "block";
        document.getElementById("updateprofile-alert").innerHTML = ("Email Updated Successfully")
        window.setTimeout(function () { location.reload() }, 3000)

    }).catch((error) => {
        document.getElementById("updateprofilealert").style.display = "block";
        document.getElementById("updateprofile-alert").innerHTML = error.message;
    });
}

// Name Update Function
function updateprofile() {
    var B = confirm("Profile will be updated once in your Profile");
    if (B == true) {
        document.getElementById("profileUpdateButton").disabled = true;
        const user = firebase.auth().currentUser;
        const name = document.getElementById("new-name").value;
        const roll_no = document.getElementById("roll-no").value;
        if (name == "" && roll_no == "") {
            document.getElementById("updateprofilealert").style.display = "block";
            document.getElementById("updateprofile-alert").innerHTML = ("Please Enter Valid Name & Roll No")
            document.getElementById("profileUpdateButton").disabled = false;
            return false;
        }
        else if (name == "") {
            document.getElementById("updateprofilealert").style.display = "block";
            document.getElementById("updateprofile-alert").innerHTML = ("Please Enter Valid Name")
            document.getElementById("profileUpdateButton").disabled = false;
            return false;
        }
        else if (roll_no == "") {
            document.getElementById("updateprofilealert").style.display = "block";
            document.getElementById("updateprofile-alert").innerHTML = ("Please Enter Valid Roll No.")
            document.getElementById("profileUpdateButton").disabled = false;
            return false;
        }
        user.updateProfile({
            displayName: name,
            photoURL: roll_no
        }).then(() => {
            document.getElementById("updateprofilealert").style.display = "block";
            document.getElementById("updateprofile-alert").innerHTML = ("Profile Updated Successfully")
            window.setTimeout(function () { location.reload() }, 3000)
        }).catch((error) => {
            document.getElementById("updateprofilealert").style.display = "block";
            document.getElementById("updateprofile-alert").innerHTML = error.message;
        });
    }
}

// User Profile Model Function
function hideprofilemodel() {
    $("#delete-profile-model").hide();
    $("#change-pass-model").hide();
    $("#update-profile-model").hide();
}

function updateProfileModel() {
    $("#delete-profile-model").hide();
    $("#change-pass-model").hide();
    document.getElementById("profilemodal-name").innerHTML = "Update Profile";
    $("#update-profile-model").show();
}

function deleteProfileModel() {
    $("#change-pass-model").hide();
    $("#update-profile-model").hide();
    document.getElementById("profilemodal-name").innerHTML = "Delete Profile";
    $("#delete-profile-model").show();
}

function changePassModel() {
    $("#delete-profile-model").hide();
    $("#update-profile-model").hide();
    document.getElementById("profilemodal-name").innerHTML = "Change Password";
    $("#change-pass-model").show();
}
