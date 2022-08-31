firebase.auth().onAuthStateChanged((user)=>{
    if(!user){
        location.replace("login.html")
    }
    if (user.displayName == null) {
        document.getElementById("profile-update").style.display = "block";
        document.getElementById("user").innerHTML = 'Hello, User';
        document.getElementById("user-logo").innerHTML += "Hello, Demo User"
        alert("Please update your profile => Profile Photo => Update Profile")
    }
    else if (user.displayName != null) {
        document.getElementById("user-logo").innerHTML = user.displayName
        document.getElementById("user").innerHTML = 'Hello, '+ user.displayName;
    }
    document.getElementById("user-email").value = user.email
    document.getElementById("useremail").value = user.email
    document.getElementById("ticket-email").value = user.email
})

// Dashboard Models Functions
function hidemodels() {
    $("#file-upload-model").hide();
    $("#ticket-request-model").hide();
}

function fileUpload() {
    hidemodels();
    document.getElementById("dashboardmodal-name").innerHTML = "File Upload";
    $("#file-upload-model").show();
}
function ticketRequest() {
    hidemodels();
    document.getElementById("dashboardmodal-name").innerHTML = "Ticket Request";
    $("#ticket-request-model").show();
}
