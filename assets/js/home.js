const certificateno = new URLSearchParams(window.location.search);
if (certificateno != "") {
    v = certificateno.get('no');
    document.getElementById('search-certificateno').value = v;
    getcertificatesdetails();

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
