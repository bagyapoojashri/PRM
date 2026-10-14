// ========================================
// GET APARTMENTS
// ========================================

let apartments =
    JSON.parse(
        localStorage.getItem("prmApartments")
    ) || [];
// ========================================
// EDIT MODE
// ========================================

let editingFlatId = null;

// ========================================
// GET FLATS
// ========================================

let flats =
    JSON.parse(
        localStorage.getItem("prmFlats")
    ) || [];


// ========================================
// LOAD APARTMENTS INTO DROPDOWN
// ========================================

function loadApartments() {

    const dropdown =
        document.getElementById(
            "apartmentId"
        );


    dropdown.innerHTML =
        '<option value="">Select Apartment</option>';


    apartments
        .filter(
            apartment =>
                apartment.status === "ACTIVE"
        )
        .forEach(
            function(apartment) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    apartment.apartmentId;


                option.textContent =
                    apartment.apartmentId +
                    " - " +
                    apartment.apartmentName;


                dropdown.appendChild(
                    option
                );

            }
        );

}


// 
// ========================================
// SAVE / UPDATE FLAT
// ========================================

function saveFlat() {

    const apartmentId =
        document.getElementById("apartmentId").value;

    const block =
        document.getElementById("block").value.trim();

    const flatNumber =
        document.getElementById("flatNumber").value.trim();

    const floor =
        document.getElementById("floor").value;

    const flatType =
        document.getElementById("flatType").value;

    const area =
        document.getElementById("area").value;

    const parking =
        document.getElementById("parking").value.trim();

    const status =
        document.getElementById("status").value;


    // ====================================
    // VALIDATION
    // ====================================

    if (
        apartmentId === "" ||
        flatNumber === "" ||
        flatType === ""
    ) {

        alert(
            "Please select Apartment, Flat Number and Flat Type."
        );

        return;
    }


    // ====================================
    // UPDATE EXISTING FLAT
    // ====================================

    if (editingFlatId) {

        const flat =
            flats.find(
                function(item) {
                    return item.id === editingFlatId;
                }
            );

        if (!flat) {

            alert(
                "Flat record not found."
            );

            return;
        }


        // Update ONLY this selected record
        flat.apartmentId = apartmentId;
        flat.block = block;
        flat.flatNumber = flatNumber;
        flat.floor = floor;
        flat.flatType = flatType;
        flat.area = area;
        flat.parking = parking;
        flat.status = status;


        // Save ALL records
        localStorage.setItem(
            "prmFlats",
            JSON.stringify(flats)
        );


        alert(
            "Flat details updated successfully."
        );


        editingFlatId = null;

        clearForm();

        displayFlats();

        return;
    }


    // ====================================
    // CHECK DUPLICATE FOR NEW FLAT ONLY
    // ====================================

    const duplicate =
        flats.find(
            function(flat) {

                return (

                    flat.apartmentId ===
                    apartmentId

                    &&

                    flat.flatNumber
                        .toLowerCase()
                    ===
                    flatNumber.toLowerCase()

                );

            }
        );


    if (duplicate) {

        alert(
            "This Flat Number already exists in this apartment."
        );

        return;
    }


    // ====================================
    // CREATE NEW FLAT
    // ====================================

    const newFlat = {

        id:
            "FLAT-" +
            Date.now(),

        apartmentId:
            apartmentId,

        block:
            block,

        flatNumber:
            flatNumber,

        floor:
            floor,

        flatType:
            flatType,

        area:
            area,

        parking:
            parking,

        status:
            status,

        createdDate:
            new Date().toISOString()

    };


    // Add NEW record
    flats.push(
        newFlat
    );


    // Save all records
    localStorage.setItem(
        "prmFlats",
        JSON.stringify(flats)
    );


    alert(
        "Flat saved successfully."
    );


    clearForm();

    displayFlats();

}
// ========================================
// DISPLAY FLATS
// ========================================

function displayFlats() {

    const table =
        document.getElementById(
            "flatTable"
        );


    table.innerHTML = "";


    flats.forEach(
        function(flat) {

            // Find apartment name

            const apartment =
                apartments.find(
                    apartment =>
                        apartment.apartmentId
                        ===
                        flat.apartmentId
                );


            const apartmentName =
                apartment
                ?
                apartment.apartmentName
                :
                flat.apartmentId;


            let actionButton = "";

if (flat.status === "ACTIVE") {

    actionButton = `
        <button
            type="button"
            class="edit-btn"
            onclick="editFlat('${flat.id}')">
            ✏ Edit
        </button>

        <button
            type="button"
            class="delete-btn"
            onclick="deleteFlat('${flat.id}')">
            🗑 Delete
        </button>

        <button
            type="button"
            class="deactivate-btn"
            onclick="changeStatus('${flat.id}', 'INACTIVE')">
            Deactivate
        </button>
    `;

} else {

    actionButton = `
        <button
            type="button"
            class="edit-btn"
            onclick="editFlat('${flat.id}')">
            ✏ Edit
        </button>

        <button
            type="button"
            class="delete-btn"
            onclick="deleteFlat('${flat.id}')">
            🗑 Delete
        </button>

        <button
            type="button"
            class="activate-btn"
            onclick="changeStatus('${flat.id}', 'ACTIVE')">
            Activate
        </button>
    `;
}
            const row =
                document.createElement(
                    "tr"
                );

            row.innerHTML = `

                <td>
                    ${apartmentName}
                </td>
            
              
                <td>
                    ${flat.block || "-"}
                </td>

                <td>
                    ${flat.flatNumber}
                </td>

                <td>
                    ${flat.floor || "-"}
                </td>

                <td>
                    ${flat.flatType}
                </td>

                <td>
                    ${flat.area || "-"}
                </td>

                <td>
                    ${flat.status}
                </td>

                <td>
                    ${actionButton}
                </td>

            `;


            table.appendChild(
                row
            );

        }
    );

}
// ========================================
// EDIT FLAT
// ========================================

function editFlat(id) {

    const flat =
        flats.find(
            item => item.id === id
        );

    if (!flat) {

        alert("Flat record not found.");

        return;

    }


    editingFlatId = flat.id;


    // Apartment

    document.getElementById(
        "apartmentId"
    ).value =
        flat.apartmentId || "";


    // Flat Number

    document.getElementById(
        "flatNumber"
    ).value =
        flat.flatNumber || "";


    // Block

    const blockField =
        document.getElementById("block");

    if (blockField) {

        blockField.value =
            flat.block || "";

    }


    // Floor

    const floorField =
        document.getElementById("floor");

    if (floorField) {

        floorField.value =
            flat.floor || "";

    }


    // Status

    document.getElementById(
        "status"
    ).value =
        flat.status || "ACTIVE";


    // Change Save button

    const saveButton =
        document.querySelector(
            'button[type="submit"]'
        );


    if (saveButton) {

        saveButton.textContent =
            "UPDATE FLAT";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}
// ========================================
// DELETE FLAT
// ========================================

function deleteFlat(id) {

    const flat =
        flats.find(
            item => item.id === id
        );


    if (!flat) {

        alert(
            "Flat record not found."
        );

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete Flat " +
            flat.flatNumber +
            "?"
        );


    if (!confirmDelete) {

        return;

    }


    flats =
        flats.filter(
            item => item.id !== id
        );


    localStorage.setItem(
        "prmFlats",
        JSON.stringify(flats)
    );


    alert(
        "Flat deleted successfully."
    );


    displayFlats();

}
// ========================================
// EDIT FLAT
// ========================================

function editFlat(id) {

    const flat = flats.find(function(item) {
        return item.id === id;
    });

    if (!flat) {
        alert("Flat record not found.");
        return;
    }

    // Store the ID of the flat being edited
    editingFlatId = flat.id;

    // Load existing values into the form
    document.getElementById("apartmentId").value =
        flat.apartmentId || "";

    document.getElementById("flatNumber").value =
        flat.flatNumber || "";

    document.getElementById("block").value =
        flat.block || "";

    document.getElementById("floor").value =
        flat.floor || "";

    document.getElementById("status").value =
        flat.status || "ACTIVE";

    // Change button from SAVE to UPDATE
    const saveButton =
        document.querySelector('button[type="submit"]');

    if (saveButton) {
        saveButton.textContent = "UPDATE FLAT";
    }

    // Move to the top of the page
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
// ========================================
// CHANGE STATUS
// ========================================

function changeStatus(
    id,
    newStatus
) {

    const flat =
        flats.find(
            flat =>
                flat.id === id
        );


    if (!flat) {

        return;

    }


    flat.status =
        newStatus;


    localStorage.setItem(

        "prmFlats",

        JSON.stringify(
            flats
        )

    );


    displayFlats();

}
// ========================================

// ========================================
// CLEAR FORM
// ========================================

function clearForm() {

    document
        .getElementById(
            "apartmentId"
        )
        .value = "";

    document
        .getElementById(
            "block"
        )
        .value = "";

    document
        .getElementById(
            "flatNumber"
        )
        .value = "";

    document
        .getElementById(
            "floor"
        )
        .value = "";

    document
        .getElementById(
            "flatType"
        )
        .value = "";

    document
        .getElementById(
            "area"
        )
        .value = "";

    document
        .getElementById(
            "parking"
        )
        .value = "";

    document
        .getElementById(
            "status"
        )
        .value = "ACTIVE";

}


// ========================================
// PAGE LOAD
// ========================================

loadApartments();

displayFlats();
// ========================================
// DELETE FLAT
// ========================================

function deleteFlat(id) {

    const flat = flats.find(function(item) {
        return item.id === id;
    });

    if (!flat) {
        alert("Flat record not found.");
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete Flat " +
        flat.flatNumber +
        "?"
    );

    if (!confirmDelete) {
        return;
    }

    flats = flats.filter(function(item) {
        return item.id !== id;
    });

    localStorage.setItem(
        "prmFlats",
        JSON.stringify(flats)
    );

    alert("Flat deleted successfully.");

    displayFlats();
}
// ========================================
// DOWNLOAD FLAT MASTER EXCEL
// ========================================

function downloadFlatExcel() {

    if (typeof XLSX === "undefined") {

        alert("Excel library is not loaded.");

        return;
    }


    const flatsData =
        flats.map(function(flat, index) {

            const apartment =
                apartments.find(function(item) {

                    return (
                        item.apartmentId ===
                        flat.apartmentId
                    );

                });


            return {

                "S.No":
                    index + 1,

                "Apartment ID":
                    flat.apartmentId || "",

                "Apartment Name":
                    apartment
                        ? apartment.apartmentName
                        : "",

                "Block":
                    flat.block || "",

                "Flat Number":
                    flat.flatNumber || "",

                "Floor":
                    flat.floor || "",

                "Flat Type":
                    flat.flatType || "",

                "Area":
                    flat.area || "",

                "Parking":
                    flat.parking || "",

                "Status":
                    flat.status || "",

                "Created Date":
                    flat.createdDate || ""

            };

        });


    if (flatsData.length === 0) {

        alert(
            "No Flat Master data available for download."
        );

        return;
    }


    const worksheet =
        XLSX.utils.json_to_sheet(
            flatsData
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Flat Master"
    );


    XLSX.writeFile(
        workbook,
        "PRM_Flat_Master.xlsx"
    );

}
// ========================================
// UPLOAD FLAT MASTER EXCEL
// ========================================

function uploadFlatExcel(event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    if (typeof XLSX === "undefined") {

        alert("Excel library is not loaded.");

        event.target.value = "";

        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {

        try {

            const workbook = XLSX.read(
                new Uint8Array(e.target.result),
                {
                    type: "array"
                }
            );

            const worksheet =
                workbook.Sheets[
                    workbook.SheetNames[0]
                ];

            const rows =
                XLSX.utils.sheet_to_json(
                    worksheet,
                    {
                        defval: ""
                    }
                );

            if (!rows.length) {

                alert(
                    "Excel file contains no data."
                );

                return;
            }


            let importedCount = 0;
            let skippedCount = 0;


            rows.forEach(function(row) {

                const apartmentId =
                    String(
                        row["Apartment ID"] ||
                        row.apartmentId ||
                        ""
                    ).trim();


                const flatNumber =
                    String(
                        row["Flat Number"] ||
                        row["Flat"] ||
                        row.flatNumber ||
                        ""
                    ).trim();


                const block =
                    String(
                        row["Block"] ||
                        row.block ||
                        ""
                    ).trim();


                const floor =
                    String(
                        row["Floor"] ||
                        row.floor ||
                        ""
                    ).trim();


                const flatType =
                    String(
                        row["Flat Type"] ||
                        row["Type"] ||
                        row.flatType ||
                        ""
                    ).trim();


                const area =
                    String(
                        row["Area"] ||
                        row.area ||
                        ""
                    ).trim();


                const parking =
                    String(
                        row["Parking"] ||
                        row.parking ||
                        ""
                    ).trim();


                const status =
                    String(
                        row["Status"] ||
                        row.status ||
                        "ACTIVE"
                    ).trim();


                // Required fields
                if (
                    !apartmentId ||
                    !flatNumber ||
                    !flatType
                ) {

                    skippedCount++;

                    return;
                }


                // Check apartment exists
                const apartment =
                    apartments.find(
                        function(item) {

                            return (
                                item.apartmentId ===
                                apartmentId
                            );

                        }
                    );


                if (!apartment) {

                    skippedCount++;

                    return;
                }


                // Check duplicate
                const duplicate =
                    flats.find(
                        function(item) {

                            return (
                                item.apartmentId ===
                                apartmentId

                                &&

                                String(
                                    item.flatNumber
                                ).toLowerCase() ===
                                flatNumber.toLowerCase()
                            );

                        }
                    );


                if (duplicate) {

                    skippedCount++;

                    return;
                }


                // Create Flat
                const newFlat = {

                    id:
                        "FLAT-" +
                        Date.now() +
                        "-" +
                        importedCount,

                    apartmentId:
                        apartmentId,

                    block:
                        block,

                    flatNumber:
                        flatNumber,

                    floor:
                        floor,

                    flatType:
                        flatType,

                    area:
                        area,

                    parking:
                        parking,

                    status:
                        status,

                    createdDate:
                        new Date().toISOString()

                };


                flats.push(newFlat);

                importedCount++;

            });


            // Save Flat Master
            localStorage.setItem(
                "prmFlats",
                JSON.stringify(flats)
            );


            alert(
                importedCount +
                " Flat(s) imported successfully.\n\n" +
                skippedCount +
                " row(s) skipped."
            );


            // Refresh Flat List
            displayFlats();


        }
        catch (error) {

            console.error(error);

            alert(
                "Unable to read the Excel file. " +
                "Please check the Excel format."
            );

        }

        // Reset file input
        event.target.value = "";

    };


    reader.readAsArrayBuffer(file);

}