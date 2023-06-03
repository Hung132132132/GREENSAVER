function myFunction(myInput) {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(myInput);
    filter = input.value.toUpperCase();
    table = document.getElementById("contactList");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }

    // var areaFilter = document.getElementById('areaFilter');
    // var roleFilter = document.getElementById('roleFilter');
    // areaFilter.addEventListener('change', function () {
    //     if (areaFilter.value != "") {
    //         var filter, table, tr, td, i, txtValue;
    //         filter = areaFilter.value.toUpperCase();
    //         table = document.getElementById("contactList");
    //         tr = table.getElementsByTagName("tr");
    //         for (i = 0; i < tr.length; i++) {
    //             td = tr[i].getElementsByTagName("td")[4];
    //             if (td) {
    //                 txtValue = td.textContent || td.innerText;
    //                 if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //                     tr[i].style.display = "";
    //                 } else {
    //                     tr[i].style.display = "none";
    //                 }
    //             }
    //         }
    //     } else {
    //         table = document.getElementById("contactList");
    //         tr = table.getElementsByTagName("tr");
    //         for (i = 0; i < tr.length; i++) {
    //             tr[i].style.display = "";
    //         }
    //     }
    // });
    // roleFilter.addEventListener('change', function () {
    //     if (roleFilter.value != "") {
    //         var filter, table, tr, td, i, txtValue;
    //         filter = roleFilter.value.toUpperCase();
    //         table = document.getElementById("contactList");
    //         tr = table.getElementsByTagName("tr");
    //         for (i = 0; i < tr.length; i++) {
    //             td = tr[i].getElementsByTagName("td")[5];
    //             if (td) {
    //                 txtValue = td.textContent || td.innerText;
    //                 if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //                     tr[i].style.display = "";
    //                 } else {
    //                     tr[i].style.display = "none";
    //                 }
    //             }
    //         }
    //     } else {
    //         table = document.getElementById("contactList");
    //         tr = table.getElementsByTagName("tr");
    //         for (i = 0; i < tr.length; i++) {
    //             tr[i].style.display = "";
    //         }
    //     }
    // });
}