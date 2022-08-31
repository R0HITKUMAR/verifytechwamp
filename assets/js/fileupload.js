// File Upload Functions
var files = [];
document.getElementById("files").addEventListener("change", function (e) {
    files = e.target.files;
    for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
    }
});

document.getElementById("send").addEventListener("click", function () {
    if (files.length != 0) {
        for (let i = 0; i < files.length; i++) {
            document.getElementById("progress-bar").style.display = "block";
            var storage = firebase.storage().ref("Tickets-Requests/"+files[i].name);

            var upload = storage.put(files[i]);

            upload.on(
                "state_changed",
                function progress(snapshot) {
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById("progress").value = percentage;
                },

                function error() {
                    alert("error uploading file");
                },

                function complete() {
                    document.getElementById("progress-bar").style.display = "none";
                    document.getElementById("fileuploadalert").style.display = "block";
                    document.getElementById("upload-alert").innerHTML += `${files[i].name}  Uploaded Successfully <br />`;
                    getFileUrl(files[i].name);

                }
            );
        }
    } else {
        alert("No file chosen");
    }
});

function getFileUrl(filename) {
    var storage = firebase.storage().ref("Tickets-Requests/"+filename);
    storage
        .getDownloadURL()
        .then(function (url) {
            document.getElementById("file-link").innerHTML = url;
        })
        .catch(function (error) {
            console.log("error encountered");
        });
}

// End of File Upload Section