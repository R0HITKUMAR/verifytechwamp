const certificateno = new URLSearchParams(window.location.search);
if (certificateno != "") {
    v = certificateno.get('no');
    document.getElementById('search-certificateno').value = v;
    getcertificatesdetails();

}
function myCertificates() {
    const user = firebase.auth().currentUser;
    if (user.photoURL != null) {
        document.getElementById("spinners1").style.display = "block";
        document.getElementById("results").style.display = "none";
        document.getElementById("norecordfound1").style.display = "none";
        document.getElementById('search-by').value = "Roll No";
        document.getElementById('search-keyword').value = user.photoURL;
        getresults()
    }
    else {
        alert("Please Update Your Roll No");
    }
}

function getallCertificates() {
    var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJcUNeUnfZJG8jGMMAQ1JNEA9TFDlpGdVKlUnPZlvU9tILvoEhYlbJUMIIMNfmEG1oNvmXXkifc-Wk/pub?gid=0&single=true&output=csv';
    $(document).ready(function () {
        $.ajax({
            url: url,
            dataType: "text",
            success: function (data) {
                var d = 0;
                var certificates_data = data.split(/\r?\n|\r/);
                var table_data = '<table class="table table-bordered table-responsive-lg table-striped">';
                for (var count = 0; count < certificates_data.length; count++) {
                    var cell_data = certificates_data[count].split(",");
                    table_data += '<tr>';
                    for (var cell_count = 0; cell_count < cell_data.length; cell_count++) {
                        if (count == 0) {
                            if (cell_count == 0)
                                table_data += '<th>' + "CERTIFICATE NO." + '</th>';
                            else if (cell_count == 1)
                                table_data += '<th>' + "CERTIFICATE NAME" + '</th>';
                            else if (cell_count == 2)
                                table_data += '<th>' + "STUDENT NAME" + '</th>';
                            else if (cell_count == 3)
                                table_data += '<th>' + "ROLL NO" + '</th>';
                            else if (cell_count == 4)
                                table_data += '<th>' + "EMAIL ID" + '</th>';
                        }
                        else {
                            table_data += '<td>' + cell_data[cell_count] + '</td>';
                        }
                    }
                    table_data += '</tr>';
                }
                table_data += '</table>';
                $('#all-results').html(table_data);
            }
        });
    });
}

function getresults() {
    document.getElementById("spinners1").style.display = "block";
    document.getElementById("results").style.display = "none";
    document.getElementById("norecordfound1").style.display = "none";
    const search = document.getElementById('search-by').value;
    const keyword = document.getElementById('search-keyword').value;

    var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJcUNeUnfZJG8jGMMAQ1JNEA9TFDlpGdVKlUnPZlvU9tILvoEhYlbJUMIIMNfmEG1oNvmXXkifc-Wk/pub?gid=0&single=true&output=csv';
    $(document).ready(function () {
        $.ajax({
            url: url,
            dataType: "text",
            success: function (data) {
                var d = 0;
                var certificates_data = data.split(/\r?\n|\r/);
                var table_data = '<table class="table table-bordered table-responsive-lg table-striped">';
                for (var count = 0; count < certificates_data.length; count++) {
                    var cell_data = certificates_data[count].split(",");
                    table_data += '<tr>';
                    for (var cell_count = 0; cell_count < cell_data.length; cell_count++) {
                        if (count == 0) {
                            if (cell_count == 0)
                                table_data += '<th>' + "CERTIFICATE NO." + '</th>';
                            else if (cell_count == 1)
                                table_data += '<th>' + "CERTIFICATE NAME" + '</th>';
                            else if (cell_count == 2)
                                table_data += '<th>' + "STUDENT NAME" + '</th>';
                            else if (cell_count == 3)
                                table_data += '<th>' + "ROLL NO" + '</th>';
                            else if (cell_count == 4)
                                table_data += '<th>' + "EMAIL ID" + '</th>';
                        }
                        else {
                            if (cell_count == 0 && search == 'Certificates No.' && cell_data[cell_count] == keyword) {
                                table_data += '<td>' + cell_data[cell_count] + '</td>';
                                table_data += '<td>' + cell_data[cell_count + 1] + '</td>';
                                table_data += '<td>' + cell_data[cell_count + 2] + '</td>';
                                table_data += '<td>' + cell_data[cell_count + 3] + '</td>';
                                table_data += '<td>' + cell_data[cell_count + 4] + '</td>';
                                d = d + 1;
                            }

                            else if (cell_count == 1 && search == 'Certificates Title' && cell_data[cell_count] == keyword) {
                                table_data += '<td>' + cell_data[cell_count - 1] + '</td>';
                                table_data += '<td>' + cell_data[cell_count] + '</td>';
                                table_data += '<td>' + cell_data[cell_count + 1] + '</td>';
                                table_data += '<td>' + cell_data[cell_count + 2] + '</td>';
                                table_data += '<td>' + cell_data[cell_count + 3] + '</td>';
                                d = d + 1;
                            }

                            else if (search == 'Students Name' && cell_count == 2 && cell_data[cell_count] == keyword) {
                                table_data += '<td>' + cell_data[cell_count - 2] + '</td>';
                                table_data += '<td>' + cell_data[cell_count - 1] + '</td>';
                                table_data += '<td>' + cell_data[cell_count] + '</td>';
                                table_data += '<td>' + cell_data[cell_count + 1] + '</td>';
                                table_data += '<td>' + cell_data[cell_count + 2] + '</td>';
                                d = d + 1;
                            }

                            else if (search == 'Roll No' && cell_count == 3 && cell_data[cell_count] == keyword) {
                                table_data += '<td>' + cell_data[cell_count - 3] + '</td>';
                                table_data += '<td>' + cell_data[cell_count - 2] + '</td>';
                                table_data += '<td>' + cell_data[cell_count - 1] + '</td>';
                                table_data += '<td>' + cell_data[cell_count] + '</td>';
                                table_data += '<td>' + cell_data[cell_count + 1] + '</td>';
                                d = d + 1;
                            }

                            else if (search == 'Email Address' && cell_count == 4 && cell_data[cell_count] == keyword) {
                                table_data += '<td>' + cell_data[cell_count - 4] + '</td>';
                                table_data += '<td>' + cell_data[cell_count - 3] + '</td>';
                                table_data += '<td>' + cell_data[cell_count - 2] + '</td>';
                                table_data += '<td>' + cell_data[cell_count - 1] + '</td>';
                                table_data += '<td>' + cell_data[cell_count] + '</td>';
                                d = d + 1;
                            }
                        }

                    }
                    table_data += '</tr>';
                }
                table_data += '</table>';
                if (d == 0) {
                    document.getElementById("spinners1").style.display = "none";
                    document.getElementById("results").style.display = "none";
                    document.getElementById("norecordfound1").style.display = "block";

                }
                else {
                    document.getElementById("spinners1").style.display = "none";
                    document.getElementById("results").style.display = "block";
                    document.getElementById("norecordfound1").style.display = "none";
                    $('#results').html(table_data);
                }
            }
        });
    });
}

function getcertificatesdetails() {
    document.getElementById("spinners").style.display = "block";
    document.getElementById("resultsforno").style.display = "none";
    document.getElementById("verified").style.display = "none";
    document.getElementById("norecordfound").style.display = "none";
    const search = 'Certificates No.';
    const keyword = document.getElementById('search-certificateno').value;

    var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJcUNeUnfZJG8jGMMAQ1JNEA9TFDlpGdVKlUnPZlvU9tILvoEhYlbJUMIIMNfmEG1oNvmXXkifc-Wk/pub?gid=0&single=true&output=csv';
    $(document).ready(function () {
        $.ajax({
            url: url,
            dataType: "text",
            success: function (data) {
                var c = 0;
                var certificates_data = data.split(/\r?\n|\r/);
                var table_data = '<table class="table table-bordered table-responsive-lg  table-striped" id="mytable">';
                for (var count = 0; count < certificates_data.length; count++) {
                    var cell_data = certificates_data[count].split(",");
                    table_data += '<tr>';
                    for (var cell_count = 0; cell_count < cell_data.length; cell_count += 1) {
                        if (count == 0) {
                            if (cell_count == 0)
                                table_data += '<th>' + "CERTIFICATE NO." + '</th>';
                            else if (cell_count == 1)
                                table_data += '<th>' + "CERTIFICATE NAME" + '</th>';
                            else if (cell_count == 2)
                                table_data += '<th>' + "STUDENT NAME" + '</th>';
                            else if (cell_count == 3)
                                table_data += '<th>' + "ROLL NO" + '</th>';
                            else if (cell_count == 4)
                                table_data += '<th>' + "EMAIL ID" + '</th>';
                        }
                        else if (cell_count == 0 && cell_data[cell_count] == keyword) {
                            table_data += '<td>' + cell_data[cell_count] + '</td>';
                            table_data += '<td>' + cell_data[cell_count + 1] + '</td>';
                            table_data += '<td>' + cell_data[cell_count + 2] + '</td>';
                            table_data += '<td>' + cell_data[cell_count + 3] + '</td>';
                            table_data += '<td>' + cell_data[cell_count + 4] + '</td>';
                            c = c + 1;
                        }
                    }
                    table_data += '</tr>';
                }
                table_data += '</table>';
                if (c == 0) {
                    document.getElementById("spinners").style.display = "none";
                    document.getElementById("resultsforno").style.display = "none";
                    document.getElementById("verified").style.display = "none";
                    document.getElementById("norecordfound").style.display = "block";

                }
                else {
                    document.getElementById("spinners").style.display = "none";
                    document.getElementById("resultsforno").style.display = "block";
                    document.getElementById("norecordfound").style.display = "none";
                    document.getElementById("verified").style.display = "block";
                    $('#resultsforno').html(table_data);
                }

            }
        });
    });
}