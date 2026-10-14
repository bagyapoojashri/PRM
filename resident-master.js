// ========================================
// GET APARTMENTS
// ========================================

let apartments =
    JSON.parse(
        localStorage.getItem("prmApartments")
    ) || [];


// ========================================
// GET FLATS
// ========================================

let flats =
    JSON.parse(
        localStorage.getItem("prmFlats")
    ) || [];


// ========================================
// GET RESIDENTS
// ========================================

let residents =
    JSON.parse(
        localStorage.getItem("prmResidents")
    ) || [];


// ========================================
// LOAD APARTMENTS
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


// ========================================
// LOAD FLATS BASED ON APARTMENT
// ========================================

function loadFlats() {

    const apartmentId =
        document.getElementById(
            "apartmentId"
        ).value;


    const flatDropdown =
        document.getElementById(
            "flatId"
        );


    flatDropdown.innerHTML =
        '<option value="">Select Flat</option>';


    if (apartmentId === "") {

        return;

    }


    flats
        .filter(
            flat =>

                flat.apartmentId
                ===
                apartmentId

                &&

                flat.status
                ===
                "ACTIVE"

        )
        .forEach(
            function(flat) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    flat.flatNumber;


                option.textContent =
                    flat.flatNumber +
                    (
                        flat.block
                        ?
                        " - Block " +
                        flat.block
                        :
                        ""
                    );


                flatDropdown.appendChild(
                    option
                );

            }
        );

}


// ========================================
// SAVE RESIDENT
// ========================================

function saveResident() {

    const apartmentId =
        document
            .getElementById(
                "apartmentId"
            )
            .value;


    const flatId =
        document
            .getElementById(
                "flatId"
            )
            .value;


    const residentName =
        document
            .getElementById(
                "residentName"
            )
            .value
            .trim();


    const residentType =
        document
            .getElementById(
                "residentType"
            )
            .value;


    const mobile =
        document
            .getElementById(
                "mobile"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "email"
            )
            .value
            .trim();


    const moveInDate =
        document
            .getElementById(
                "moveInDate"
            )
            .value;


    const moveOutDate =
        document
            .getElementById(
                "moveOutDate"
            )
            .value;


    const status =
        document
            .getElementById(
                "status"
            )
            .value;


    // ====================================
    // VALIDATION
    // ====================================

    if (
        apartmentId === "" ||
        flatId === "" ||
        residentName === "" ||
        residentType === ""
    ) {

        alert(
            "Please select Apartment, Flat, Resident Name and Resident Type."
        );

        return;

    }


    // ====================================
    // CHECK DUPLICATE
    // ====================================

    const duplicate =
        residents.find(
            resident =>

                resident.apartmentId
                ===
                apartmentId

                &&

                resident.flatId
                ===
                flatId

                &&

                resident.status
                ===
                "ACTIVE"

        );


    if (duplicate) {

        alert(
            "This flat already has an active resident."
        );

        return;

    }


    // ====================================
    // CREATE RESIDENT
    // ====================================

    const newResident = {

        id:
            "RES-" +
            Date.now(),

        apartmentId:
            apartmentId,

        flatId:
            flatId,

        residentName:
            residentName,

        residentType:
            residentType,

        mobile:
            mobile,

        email:
            email,

        moveInDate:
            moveInDate,

        moveOutDate:
            moveOutDate,

        status:
            status,

        createdDate:
            new Date()
                .toISOString()

    };


    // ====================================
    // SAVE
    // ====================================

    residents.push(
        newResident
    );
    


    localStorage.setItem(

        "prmResidents",

        JSON.stringify(
            residents
        )

    );


    alert(
        "Resident saved successfully."
    );


    clearForm();

    displayResidents();

}


// ========================================
// DISPLAY RESIDENTS
// ========================================

function displayResidents() {

    const table =
        document.getElementById(
            "residentTable"
        );


    table.innerHTML = "";


    residents.forEach(
        function(resident) {


            // Find apartment

            const apartment =
                apartments.find(
                    apartment =>
                        apartment.apartmentId
                        ===
                        resident.apartmentId
                );


            const apartmentName =
                apartment
                ?
                apartment.apartmentName
                :
                resident.apartmentId;


            // Action button

            const actionButton =
             `

    <button
        class="edit-btn"
        onclick="editResident('${resident.id}')">

        ✏ Edit

    </button>


    <button
        class="delete-btn"
        onclick="deleteResident('${resident.id}')">

        🗑 Delete

    </button>

`;

                resident.status
                ===
                "ACTIVE"

                ?

                `<button
                    class="deactivate-btn"
                    onclick="changeStatus(
                        '${resident.id}',
                        'INACTIVE'
                    )">

                    Deactivate

                </button>`

                :

                `<button
                    class="activate-btn"
                    onclick="changeStatus(
                        '${resident.id}',
                        'ACTIVE'
                    )">

                    Activate

                </button>`;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${apartmentName}
                </td>

                <td>
                    ${resident.flatId}
                </td>

                <td>
                    ${resident.residentName}
                </td>

                <td>
                    ${resident.residentType}
                </td>

                <td>
                    ${resident.mobile || "-"}
                </td>

                <td>
                    ${resident.moveInDate || "-"}
                </td>

                <td>
                    ${resident.status}
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
// CHANGE STATUS
// ========================================

function changeStatus(
    id,
    newStatus
) {

    const resident =
        residents.find(
            resident =>
                resident.id === id
        );


    if (!resident) {

        return;

    }


    resident.status =
        newStatus;


    localStorage.setItem(

        "prmResidents",

        JSON.stringify(
            residents
        )

    );


    displayResidents();

}


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
            "flatId"
        )
        .innerHTML =
        '<option value="">Select Flat</option>';


    document
        .getElementById(
            "residentName"
        )
        .value = "";


    document
        .getElementById(
            "residentType"
        )
        .value = "";


    document
        .getElementById(
            "mobile"
        )
        .value = "";


    document
        .getElementById(
            "email"
        )
        .value = "";


    document
        .getElementById(
            "moveInDate"
        )
        .value = "";


    document
        .getElementById(
            "moveOutDate"
        )
        .value = "";


    document
        .getElementById(
            "status"
        )
        .value = "ACTIVE";

}

// ========================================
// EDIT RESIDENT
// ========================================

function editResident(id) {

    const resident =
        residents.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!resident) {

        alert("Resident not found.");

        return;

    }


    // Apartment
    document.getElementById(
        "apartmentId"
    ).value =
        resident.apartmentId;


    // Load flats for selected apartment
    loadFlats();


    // Flat
    document.getElementById(
        "flatId"
    ).value =
        resident.flatId;


    // Resident details
    document.getElementById(
        "residentName"
    ).value =
        resident.residentName || "";


    document.getElementById(
        "residentType"
    ).value =
        resident.residentType || "";


    document.getElementById(
        "mobile"
    ).value =
        resident.mobile || "";


    document.getElementById(
        "email"
    ).value =
        resident.email || "";


    document.getElementById(
        "moveInDate"
    ).value =
        resident.moveInDate || "";


    document.getElementById(
        "moveOutDate"
    ).value =
        resident.moveOutDate || "";


    document.getElementById(
        "status"
    ).value =
        resident.status || "ACTIVE";


    // Remember which record is being edited
    window.editingResidentId = id;


    // Change button text
    const saveButton =
        document.querySelector(
            ".save-btn"
        );


    if (saveButton) {

        saveButton.textContent =
            "UPDATE RESIDENT";

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
// ========================================
// DELETE RESIDENT
// ========================================


function deleteResident(id) {

    const residentIndex = residents.findIndex(
        function(item) {
            return String(item.id) === String(id);
        }
    );

    if (residentIndex === -1) {
        alert("Resident not found.");
        return;
    }

    const resident = residents[residentIndex];

    const confirmDelete = confirm(
        "Are you sure you want to permanently delete " +
        resident.residentName + "?"
    );

    if (!confirmDelete) {
        return;
    }

    // Remove only the selected resident.
    residents.splice(residentIndex, 1);

    // Save the updated Resident Master.
    localStorage.setItem(
        "prmResidents",
        JSON.stringify(residents)
    );

    // Clear the form if this resident was being edited.
    if (
        String(window.editingResidentId) === String(id)
    ) {
        window.editingResidentId = null;
        clearForm();
    }

    // Refresh the Resident List.
    displayResidents();

    alert("Resident deleted successfully.");
}
// ========================================
// PAGE LOAD
// ========================================

loadApartments();

displayResidents();


/* =========================================
   RESIDENT MASTER - DEDICATED EXCEL EXPORT
   ========================================= */

function downloadResidentExcel() {
    if (typeof XLSX === "undefined") {
        alert("Excel library is not loaded.");
        return;
    }

    const rows = residents.map(function (resident) {
        const apartment = apartments.find(function (item) {
            return String(item.apartmentId) ===
                String(resident.apartmentId);
        });

        return {
            "Resident ID": resident.id || "",
            "Apartment ID": resident.apartmentId || "",
            "Apartment Name": apartment
                ? apartment.apartmentName
                : "",
            "Flat Number": resident.flatId || "",
            "Resident Name": resident.residentName || "",
            "Resident Type": resident.residentType || "",
            "Mobile Number": resident.mobile || "",
            "Email": resident.email || "",
            "Move-in Date": resident.moveInDate || "",
            "Move-out Date": resident.moveOutDate || "",
            "Status": resident.status || "ACTIVE"
        };
    });

    if (rows.length === 0) {
        alert("No Resident Master data available.");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Resident Master"
    );

    XLSX.writeFile(workbook, "PRM_Residents.xlsx");
}


/* =========================================
   RESIDENT MASTER - DEDICATED EXCEL IMPORT
   ========================================= */

function uploadResidentExcel(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (typeof XLSX === "undefined") {
        alert("Excel library is not loaded.");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const workbook = XLSX.read(
                new Uint8Array(e.target.result),
                { type: "array", cellDates: true }
            );

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const rows = XLSX.utils.sheet_to_json(sheet, {
                defval: "",
                raw: false
            });

            if (!rows.length) {
                alert("The Excel file contains no data.");
                return;
            }

            // Match column headings without case or spacing differences.
            function getValue(row, names) {
                const keys = Object.keys(row);

                for (const name of names) {
                    const key = keys.find(function (item) {
                        return item.trim().toLowerCase() ===
                            name.trim().toLowerCase();
                    });

                    if (key !== undefined && row[key] !== "") {
                        return row[key];
                    }
                }

                return "";
            }

            function normalizeDate(value) {
                if (!value) return "";

                if (value instanceof Date && !isNaN(value)) {
                    return value.toISOString().slice(0, 10);
                }

                const textValue = String(value).trim();

                // Already YYYY-MM-DD
                if (/^\d{4}-\d{2}-\d{2}$/.test(textValue)) {
                    return textValue;
                }

                // Convert DD-MM-YYYY or DD/MM/YYYY
                const match = textValue.match(
                    /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/
                );

                if (match) {
                    return match[3] + "-" +
                        match[2].padStart(2, "0") + "-" +
                        match[1].padStart(2, "0");
                }

                return textValue;
            }

            // Refresh current master data before importing.
            apartments = JSON.parse(
                localStorage.getItem("prmApartments") || "[]"
            );

            flats = JSON.parse(
                localStorage.getItem("prmFlats") || "[]"
            );

            residents = JSON.parse(
                localStorage.getItem("prmResidents") || "[]"
            );

            let added = 0;
            let updated = 0;
            let skipped = 0;

            rows.forEach(function (row) {
                const apartmentIdInput = String(getValue(row, [
                    "Apartment ID", "apartmentId"
                ])).trim();

                const apartmentNameInput = String(getValue(row, [
                    "Apartment Name", "Apartment"
                ])).trim();

                const flatNumber = String(getValue(row, [
                    "Flat Number", "Flat No", "Flat", "flatId"
                ])).trim();

                const residentName = String(getValue(row, [
                    "Resident Name", "Resident", "Name", "residentName"
                ])).trim();

                const residentType = String(getValue(row, [
                    "Resident Type", "Type", "residentType"
                ])).trim().toUpperCase();

                const mobile = String(getValue(row, [
                    "Mobile Number", "Mobile", "Phone", "mobile"
                ])).trim();

                const email = String(getValue(row, [
                    "Email", "email"
                ])).trim();

                const moveInDate = normalizeDate(getValue(row, [
                    "Move-in Date", "Move In Date", "moveInDate"
                ]));

                const moveOutDate = normalizeDate(getValue(row, [
                    "Move-out Date", "Move Out Date", "moveOutDate"
                ]));

                const statusInput = String(getValue(row, [
                    "Status", "status"
                ]) || "ACTIVE").trim().toUpperCase();

                const importedId = String(getValue(row, [
                    "Resident ID", "Resident Id", "id"
                ])).trim();

                if (!flatNumber || !residentName ||
                    !["OWNER", "TENANT", "OCCUPANT"].includes(residentType)) {
                    skipped++;
                    return;
                }

                // Match apartment by ID first, then by exact apartment name.
                let apartment = apartments.find(function (item) {
                    return apartmentIdInput &&
                        String(item.apartmentId).trim().toLowerCase() ===
                        apartmentIdInput.toLowerCase();
                });

                if (!apartment && apartmentNameInput) {
                    apartment = apartments.find(function (item) {
                        return String(item.apartmentName || "")
                            .trim().toLowerCase() ===
                            apartmentNameInput.toLowerCase();
                    });
                }

                if (!apartment) {
                    skipped++;
                    return;
                }

                // Verify that this flat belongs to the selected apartment.
                const flat = flats.find(function (item) {
                    return String(item.apartmentId) ===
                        String(apartment.apartmentId) &&
                        String(item.flatNumber).trim().toLowerCase() ===
                        flatNumber.toLowerCase();
                });

                if (!flat) {
                    skipped++;
                    return;
                }

                const recordData = {
                    apartmentId: apartment.apartmentId,
                    flatId: flat.flatNumber,
                    residentName: residentName,
                    residentType: residentType,
                    mobile: mobile,
                    email: email,
                    moveInDate: moveInDate,
                    moveOutDate: moveOutDate,
                    status: ["ACTIVE", "INACTIVE"].includes(statusInput)
                        ? statusInput
                        : "ACTIVE"
                };

                // Update by Resident ID where supplied.
                // Otherwise update the existing record for this apartment + flat.
                let existingIndex = -1;

                if (importedId) {
                    existingIndex = residents.findIndex(function (item) {
                        return String(item.id) === importedId;
                    });
                }

                if (existingIndex === -1) {
                    existingIndex = residents.findIndex(function (item) {
                        return String(item.apartmentId) ===
                            String(apartment.apartmentId) &&
                            String(item.flatId).trim().toLowerCase() ===
                            String(flat.flatNumber).trim().toLowerCase();
                    });
                }

                if (existingIndex !== -1) {
                    residents[existingIndex] = {
                        ...residents[existingIndex],
                        ...recordData
                    };
                    updated++;
                } else {
                    residents.push({
                        id: importedId || "RES-" + Date.now() + "-" + added,
                        ...recordData,
                        createdDate: new Date().toISOString()
                    });
                    added++;
                }
            });

            // Save only the Resident Master data.
            localStorage.setItem(
                "prmResidents",
                JSON.stringify(residents)
            );

            loadApartments();
            displayResidents();

            alert(
                "Resident Excel import completed.\n\n" +
                "New residents: " + added + "\n" +
                "Updated residents: " + updated + "\n" +
                "Skipped rows: " + skipped
            );
        } catch (error) {
            console.error("Resident Excel import error:", error);
            alert("Unable to read the Excel file. Check its format.");
        } finally {
            event.target.value = "";
        }
    };

    reader.readAsArrayBuffer(file);
}
