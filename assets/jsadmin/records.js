getRecords();

// Retrieve Certificate Data
function getRecords() {
    firebase.database().ref('Certificates').on('value', function (snapshot) {
        document.getElementById("records-table").innerHTML = "";
        var e = 1;
        snapshot.forEach(function (childSnapshot) {
            data = childSnapshot.val();
            key = childSnapshot.key;

            firebase.database().ref('Students/' + data.CRollNo).on('value', function (snap) {
                localStorage.setItem('SName', snap.val().Name);
                localStorage.setItem('SBranch', snap.val().BranchYear);
            });
            firebase.database().ref('CTemplates/' + data.CTID).on('value', function (snap) {
                localStorage.setItem('CName', snap.val().CName);
            });
            var CName = localStorage.getItem('CName');
            var SName = localStorage.getItem('SName');
            var CBranch = localStorage.getItem('SBranch');

            row =
                `<tr>
                    <td>${e}</td>
                    <td>${data.CID}</td>
                    <td>${CName}</td>
                    <td>${SName}</td>
                    <td>${data.CRollNo}</td>
                    <td>${CBranch}</td>
                    <td>${data.CDate}</td>
                </tr>`;
            document.getElementById("records-table").innerHTML += row;
        });
    });
}