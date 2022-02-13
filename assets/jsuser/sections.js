function hideall(){
    document.getElementById('dashboard-section').classList.add("d-none");
    document.getElementById('my_certificates_section').classList.add("d-none");
    document.getElementById('add_certificates_section').classList.add("d-none");
    document.getElementById('tickets_section').classList.add("d-none");
    document.getElementById('profile_section').classList.add("d-none");
    document.getElementById('help_section').classList.add("d-none");
}

function showdashboard_section(){
    hideall();
    document.getElementById('dashboard-section').classList.remove("d-none");
}

function showmycertificates_section(){
    hideall();
    document.getElementById('my_certificates_section').classList.remove("d-none");
}

function showaddCertificates_section(){
    hideall();
    document.getElementById('add_certificates_section').classList.remove("d-none");
}
function showtickets_section(){
    hideall();
    document.getElementById('tickets_section').classList.remove("d-none");
}
function showprofile_section(){
    hideall();
    document.getElementById('profile_section').classList.remove("d-none");
}
function showhelp_section(){
    hideall();
    document.getElementById('help_section').classList.remove("d-none");
}