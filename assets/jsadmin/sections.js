function hideall() {
    document.getElementById('dashboard-section').classList.add("d-none");
    document.getElementById('students-section').classList.add("d-none");
    document.getElementById('addCertificates-section').classList.add("d-none");
    document.getElementById('addTemplate-section').classList.add("d-none");
    document.getElementById('cstore-section').classList.add("d-none");
    document.getElementById('tickets-section').classList.add("d-none");
    document.getElementById('profile-section').classList.add("d-none");
    document.getElementById('help-section').classList.add("d-none");
}
function showdashboard_section() {
    hideall();
    document.getElementById('dashboard-section').classList.remove("d-none");
}
function showstudents_section() {
    hideall();
    document.getElementById('students-section').classList.remove("d-none");
}
function showaddCertificates_section() {
    hideall();
    document.getElementById('addCertificates-section').classList.remove("d-none");
}
function showaddTemplate_section() {
    hideall();
    document.getElementById('addTemplate-section').classList.remove("d-none");
}
function showcstore_section() {
    hideall();
    document.getElementById('cstore-section').classList.remove("d-none");
}
function showtickets_section() {
    hideall();
    document.getElementById('tickets-section').classList.remove("d-none");
}
function showprofile_section() {
    hideall();
    document.getElementById('profile-section').classList.remove("d-none");
}
function showhelp_section() {
    hideall();
    document.getElementById('help-section').classList.remove("d-none");
}