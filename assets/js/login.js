//--------------------------------------------------Start of Login Function --------------------------------------------------//

// Form Setup
document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault()
})
document.getElementById("signup-form").addEventListener("submit", (event) => {
    event.preventDefault()
})
document.getElementById("forgetPassForm").addEventListener("submit", (event) => {
    event.preventDefault()
})

// Password View Toggle
const ltogglePassword = document.querySelector('#togglePassword');
const lpassword = document.querySelector('#lpassword');

ltogglePassword.addEventListener('click', function (e) {
    const type = lpassword.getAttribute('type') === 'password' ? 'text' : 'password';
    lpassword.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

const stogglePassword = document.querySelector('#stogglePassword');
const spassword = document.querySelector('#spassword');

stogglePassword.addEventListener('click', function (e) {
    const type = spassword.getAttribute('type') === 'password' ? 'text' : 'password';
    spassword.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

// Show Forget Password Form
function forgotPass() {
    document.getElementById("loginformAlert").innerHTML = "";
    document.getElementById("formtitle").innerHTML = "Forgot Password";
    document.getElementById("loginForm").classList.add("d-none");
    document.getElementById("forgetPassForm").classList.remove("d-none");
}

// Show Login Form
function backToLogin() {
    document.getElementById("loginformAlert").innerHTML = "";
    document.getElementById("formtitle").innerHTML = "Login";
    document.getElementById("loginForm").classList.remove("d-none");
    document.getElementById("forgetPassForm").classList.add("d-none");
}

// Login Function
function login() {
    var Alert = document.getElementById("loginformAlert");
    Alert.innerHTML = "";
    const email = document.getElementById("lemail").value;
    const password = document.getElementById("lpassword").value;
    if (email != "" && password != "") {
        document.getElementById("loginbtn").value = "Checking...";
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                document.getElementById("loginbtn").value = "Logging In...";
                logging();
            })
            .catch((error) => {
                document.getElementById("loginbtn").value = "Login Failed";
                AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>${error.message}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
                Alert.innerHTML += AlertText;
            })
    }
    else {
        AlertText = `
        <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
            <strong>Enter Valid Email & Password</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        Alert.innerHTML += AlertText;
    }
}

// Logging Function
function logging() {
    var Alert = document.getElementById("loginformAlert");
    firebase.auth().onAuthStateChanged((user) => {
        if (user.email == "admin@verifytechwamp.ml") {
            location.replace("admin.html")
        }
        else {
            if (user.emailVerified) {
                location.replace("user.html")
            }
            else {
                //Send verification email
                firebase.auth().currentUser.sendEmailVerification()
                    .then(() => {
                        document.getElementById("loginbtn").value = "Email Not Verified";
                        AlertText = `
                        <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                            <strong>Please Verify Your Email Id</strong><br>
                            A verification email has been sent to your Email address Now.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
                        Alert.innerHTML += AlertText;
                    })
                    .catch((error) => {
                        document.getElementById("loginbtn").value = "Login Failed";
                        AlertText = `
                        <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                            <strong>${error.message}</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
                        Alert.innerHTML += AlertText;
                    })
            }
        }
    });
}

// SignUp Function
function signUp() {
    var Alert = document.getElementById("signupformAlert");
    Alert.innerHTML = "";
    var Form = document.getElementById("signup-form");
    const Name = document.getElementById("sname").value;
    const Roll = document.getElementById("srollno").value;
    const email = document.getElementById("semail").value
    const password = document.getElementById("spassword").value
    if (Name != "" && Roll != "" && email != "" && password != "") {
        document.getElementById("signupbtn").value = "Signing Up...";
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((user) => {
                // Send verification email
                firebase.auth().currentUser.sendEmailVerification()
                    .then(() => {
                        AlertText = `
                    <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                        <strong>Please Verify Your Email Id</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
                        Alert.innerHTML += AlertText;
                    })
                    .catch((error) => {
                        AlertText = `
                    <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                        <strong>${error.message}</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
                        Alert.innerHTML += AlertText;
                    })
                // Update User Profile
                user.user.updateProfile({
                    displayName: Name,
                    photoURL: Roll,
                }).then(function () {
                    // AlertText = `
                    // <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                    //     <strong>Account Updated Successfully.</strong>
                    //     <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    // </div>`;
                    // Alert.innerHTML += AlertText;

                }).catch(function (error) {
                    AlertText = `
                <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                    <strong>${error.message}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
                    Alert.innerHTML += AlertText;
                });
                // Update User Data
                firebase.database().ref('StudentID/' + Roll).update({
                    Password: password,
                }).then(function () {
                    
                }).catch(function (error) {
                    
                });
                document.getElementById("signupbtn").value = "Signup Successful";
                AlertText = `
                    <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                        <strong>Account Created Successfully.</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
                Alert.innerHTML += AlertText;
                Form.reset();
            })
            .catch((error) => {
                document.getElementById("signupbtn").value = "Signup Unsuccessful";
                AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>${error.message}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
                Alert.innerHTML += AlertText;
            })

    }
    else {
        AlertText = `
        <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
            <strong>Enter Valid Details</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        Alert.innerHTML += AlertText;
    }
}

// Forget Mail Form
function forgotPassEmail() {
    var Alert = document.getElementById("loginformAlert");
    var email = document.getElementById("femail").value;
    if (email != "") {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Password Reset Mail Send Successfully</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
                Alert.innerHTML += AlertText;
            })
            .catch((error) => {
                AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>${error.message}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
                Alert.innerHTML += AlertText;
            })
    }
    else {
        AlertText = `
        <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
            <strong>Please Enter a Email Id</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        Alert.innerHTML += AlertText;
    }
}

//--------------------------------------------------End of Login Function --------------------------------------------------//