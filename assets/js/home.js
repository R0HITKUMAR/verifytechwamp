const certificateno = new URLSearchParams(window.location.search);
if (certificateno != "") {
    document.getElementById("home").style.display = "none";
    document.getElementById("verifyData").style.display = "block";
    var frame = document.getElementById("Iframe");
    frame.src = `verify.html?${certificateno}`;
    var H = window.innerHeight;
    var H = 0.95 * H;
    frame.style.height = H + "px";
}

function getcertificatesdetails() {
    var D = document.getElementById("search-certificateno").value;
    if (D != "") {
        window.location.href = "verify.html?no=" + D;
    }
}

$('#subscription-form').submit(function (e) {
    e.preventDefault();
    var messagesRef = firebase.database().ref('Subscription');
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
        name: $('#subscription-name').val(),
        email: $('#subscription-email').val(),
        status: ""
    });
    $('#subscription-form')[0].reset();
    document.getElementById('subscription-alert').innerHTML = 'Subscribed Successful';
});

