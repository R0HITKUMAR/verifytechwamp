const certificateno = new URLSearchParams(window.location.search);
if (certificateno != "") {
    v = certificateno.get('no');
    document.getElementById('search-certificateno').value = v;
    getcertificatesdetails();

}