firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        location.replace("login.html")
    }
    var Name = user.displayName;
    var Email = user.email;
    var Roll_No = user.photoURL;
    document.getElementById("u_roll").value = Roll_No;
    document.getElementById("u_name").value = Name;
    document.getElementById("cstore_roll").value = Roll_No;
    document.getElementById("cstore_name").value = Name;
    document.getElementById("user-name-card").innerHTML = Name + "/" + Roll_No;
})

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

