const certificateno = new URLSearchParams(window.location.search);
if (certificateno != "") {
    document.getElementById("home").style.display = "none";
    var D = document.getElementById("verifyData");
    var Show = `
        <iframe src="verify.html?${certificateno}" width="100%" height="550px"></iframe>
    `;
    D.innerHTML = Show;

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

