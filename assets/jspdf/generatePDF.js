function generatePDFAdmin(ID) {
    var to = 1;
    var today = new Date().toLocaleString('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    firebase.database().ref('Certificates/' + ID).on('value', function (snapshot) {
        data = snapshot.val();
        // Retrive the data from the database
        firebase.database().ref('Students/' + data.CRollNo).on('value', function (snap) {
            localStorage.setItem('SName', snap.val().Name);
            localStorage.setItem('SBranch', snap.val().BranchYear);
        });
        firebase.database().ref('CTemplates/' + data.CTID).on('value', function (snap) {
            localStorage.setItem('Ctitle', snap.val().CDescription);
        });
        var Ctitle = localStorage.getItem('Ctitle');
        var SName = localStorage.getItem('SName');
        var CBranch = localStorage.getItem('SBranch');

        var img = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=verifytechwamp.ml?no=${ID}`;
        generatePDF(ID, Ctitle, img, SName, data.CRollNo, CBranch, data.CDate, today, to);

    });
}

function generatePDFTemplate(CTID) {
    var to = 2;
    var ID = "TWEC" + Date.now();
    var today = new Date().toLocaleString('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    firebase.database().ref('CTemplates/' + CTID).on('value', function (snapshot) {
        localStorage.setItem('Ctitle', snapshot.val().CDescription);
    });
    var title = localStorage.getItem('Ctitle');
    localStorage.removeItem('Ctitle');
    var img = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=verifytechwamp.ml?no=${ID}`;
    generatePDF(ID, title, img, "Rohit Kumar", "2019B101051", "CSE/3RD", today, today, to);

}

function displayToAdmin(ID, pdfDataUri, pdfBytes) {
    var adobeDCView = new AdobeDC.View({ clientId: "e3cc3fdbe0b24f8689413e45b058847f", divId: "adobe-dc-view" });
    adobeDCView.previewFile({
        content: { location: { url: pdfDataUri } },
        metaData: { fileName: "Certificates.pdf" }
    }, { embedMode: "IN_LINE" });
    document.getElementById("showCertificate").click();

    // Save the PDF to a file
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.getElementById("pdfdownload");
    link.href = URL.createObjectURL(blob);
    link.download = `Certificate [${ID}]`;
}