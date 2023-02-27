function generatePDFTemplate(CTID) {
    var to = 1;
    var ID = "TWEC" + Date.now();
    var today = new Date().toLocaleString('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    firebase.database().ref('CTemplates/' + CTID).on('value', function (snapshot) {
        var img = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=verifytechwamp.ml?no=${ID}`;
        generatePDF(ID, snapshot.val().CDescription, img, "Rohit Kumar", "2019B101051", "CSE/3RD", today, today, to);
    });
}

function generatePDFAdmin(ID) {
    var to = 1;
    var today = new Date().toLocaleString('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    firebase.database().ref('Certificates/' + ID).on('value', function (snapshot) {
        firebase.database().ref('Students/' + snapshot.val().CRollNo).on('value', function (ssnapshot) {
            firebase.database().ref('CTemplates/' + snapshot.val().CTID).on('value', function (tsnapshot) {
                const Data = extend({}, snapshot.val(), ssnapshot.val(), tsnapshot.val());
                console.log(Data)
                var img = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=verifytechwamp.ml?no=${ID}`;
                generatePDF(ID, Data.CDescription, img, Data.Name, Data.CRollNo, Data.BranchYear, Data.CDate, today, to);
            });
        });
    });
}

function displayToAdmin(ID, pdfDataUri, pdfBytes) {
    var adobeDCView = new AdobeDC.View({ clientId: "d59b24e124664398b7c53a19a2a29674", divId: "adobe-dc-view" });
    adobeDCView.previewFile({
        content: { location: { url: pdfDataUri } },
        metaData: { fileName: "Certificates.pdf" }
    }, { embedMode: "IN_LINE" });

    swal.close();
    document.getElementById("showCertificate").click();

    // Save the PDF to a file
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.getElementById("pdfdownload");
    link.href = URL.createObjectURL(blob);
    link.download = `Certificate [${ID}]`;
}

// User PDF Generation Functions
function generatePDFUser(ID) {
    var to = 2;
    var today = new Date().toLocaleString('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    firebase.database().ref('Certificates/' + ID).on('value', function (snapshot) {
        firebase.database().ref('Students/' + snapshot.val().CRollNo).on('value', function (ssnapshot) {
            firebase.database().ref('CTemplates/' + snapshot.val().CTID).on('value', function (tsnapshot) {
                const Data = extend({}, snapshot.val(), ssnapshot.val(), tsnapshot.val());
                console.log(Data)
                var img = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=verifytechwamp.ml?no=${ID}`;
                generatePDF(ID, Data.CDescription, img, Data.Name, Data.CRollNo, Data.BranchYear, Data.CDate, today, to);
            });
        });
    });
}

function displayToUser(ID, pdfDataUri, pdfBytes) {
    var adobeDCView = new AdobeDC.View({ clientId: "d59b24e124664398b7c53a19a2a29674", divId: "user-adobe-dc-view" });
    adobeDCView.previewFile({
        content: { location: { url: pdfDataUri } },
        metaData: { fileName: "Certificates.pdf" }
    }, { embedMode: "IN_LINE" });

    swal.close();
    document.getElementById("showCertificateUser").click();

    // Save the PDF to a file
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.getElementById("userpdfdownload");
    link.href = URL.createObjectURL(blob);
    link.download = `Certificate [${ID}]`;
}

function displayToVerify(ID, pdfDataUri, pdfBytes) {
    var adobeDCView = new AdobeDC.View({ clientId: "d59b24e124664398b7c53a19a2a29674", divId: "pdf-viewer" });
    adobeDCView.previewFile({
        content: { location: { url: pdfDataUri } },
        metaData: { fileName: "Certificates.pdf" }
    }, { embedMode: "IN_LINE" });

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.getElementById("certificate-download");
    link.href = URL.createObjectURL(blob);
    link.download = `Certificate [${ID}]`;

}
