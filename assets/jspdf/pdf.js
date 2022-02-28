const { PDFDocument, rgb, degrees } = PDFLib;
const generatePDF = async (ID, title, img, name, rollno, by, gdate, ddate, to) => {
    if (to != 3) {
        swal.fire({
            title: "Generating PDF...",
            text: "Please wait...",
            buttons: false,
            closeOnClickOutside: false,
            closeOnEsc: false,
            icon: "info",
            allowOutsideClick: false
        });
    }

    // Load a PDFDocument from the existing PDF bytes
    const existingPdfBytes = await fetch("./assets/jspdf/Certificate.pdf").then((res) =>
        res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

    pdfDoc.setAuthor('TECHWAMP Engineering College')
    pdfDoc.setSubject('Certificates Issued by TECHWAMP Engineering College')
    pdfDoc.setProducer('TWEC Portal')
    pdfDoc.setCreator('TWEC (https://verifytechwamp.ml)')

    // Get Font & Embeed
    const fontBytes = await fetch("./assets/jspdf/engagement.ttf").then((res) =>
        res.arrayBuffer()
    );
    const fontBit = await fetch("./assets/jspdf/josefin-sans.regular.ttf").then((res) =>
        res.arrayBuffer()
    );
    const SanChezFont = await pdfDoc.embedFont(fontBytes);
    const JosephineFont = await pdfDoc.embedFont(fontBit);

    // Get QR Code & Embeed
    const pngImageBytes = await fetch(img).then((res) =>
        res.arrayBuffer()
    );
    const pngImage = await pdfDoc.embedPng(pngImageBytes)

    // Load Page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];


    firstPage.drawText(name, {  // Name
        x: 30,
        y: 320,
        size: 90,
        font: SanChezFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(`( Roll No : ${rollno} / Branch & Year : ${by} )`, {  // Name
        x: 540,
        y: 40,
        size: 20,
        rotate: degrees(60),

        font: SanChezFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(title, {  // Title
        x: 30,
        y: 280,
        lineHeight: 20,
        size: 15,
        font: JosephineFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(`CERTIFICATE ID : ${ID}`, { // Certificate
        x: 30,
        y: 15,
        size: 10,
        font: JosephineFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Generation Date: ${gdate}`, { // Generation Date
        x: 630,
        y: 77,
        size: 10,
        font: JosephineFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Download Date: ${ddate}`, {  // Download Date
        x: 635,
        y: 50,
        size: 10,
        font: JosephineFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(`Verify at : https://verifytechwamp.ml?no=${ID}`, { // Link
        x: 480,
        y: 15,
        size: 12,
        font: JosephineFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawImage(pngImage, { // QR Code
        x: 660,
        y: 100,
        width: 75,
        height: 75,
    })

    // Iframe to display the PDF
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    const pdfBytes = await pdfDoc.save();

    if (to == 1) {
        displayToAdmin(ID, pdfDataUri, pdfBytes);
    }
    else if (to == 2) {
        displayToUser(ID, pdfDataUri, pdfBytes)
    }
    else if (to == 3) {
        displayToVerify(ID, pdfDataUri, pdfBytes)
    }

};

