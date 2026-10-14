// ========================================
// PRM MAINTENANCE MASTER
// ========================================


// ========================================
// GET DATA
// ========================================

function getApartments() {

    const data =
        localStorage.getItem(
            "prmApartments"
        );

    if (!data) {

        return [];

    }

    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Apartment data error:",
            error
        );

        return [];

    }

}


function getFlats() {

    const data =
        localStorage.getItem(
            "prmFlats"
        );

    if (!data) {

        return [];

    }

    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Flat data error:",
            error
        );

        return [];

    }

}


function getResidents() {

    const data =
        localStorage.getItem(
            "prmResidents"
        );

    if (!data) {

        return [];

    }

    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Resident data error:",
            error
        );

        return [];

    }

}


// ========================================
// GET MAINTENANCE RECORDS
// ========================================

let maintenanceRecords =
    JSON.parse(
        localStorage.getItem(
            "prmMaintenance"
        )
    ) || [];
    // ========================================
// EDIT MODE
// ========================================

let editingMaintenanceId = null;


// ========================================
// LOAD APARTMENTS
// ========================================

function loadApartments() {

    const apartments =
        getApartments();


    const dropdown =
        document.getElementById(
            "apartmentId"
        );


    dropdown.innerHTML =
        '<option value="">Select Apartment</option>';


    apartments.forEach(
        function(apartment) {

            if (
                apartment.status !==
                "ACTIVE"
            ) {

                return;

            }


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
// LOAD FLATS
// ========================================

function loadFlats() {

    const apartmentId =
        document
            .getElementById(
                "apartmentId"
            )
            .value;


    const flatDropdown =
        document.getElementById(
            "flatId"
        );


    const residentInput =
        document.getElementById(
            "residentName"
        );


    flatDropdown.innerHTML =
        '<option value="">Select Flat</option>';


    residentInput.value = "";


    if (!apartmentId) {

        return;

    }


    const flats =
        getFlats();


    flats
        .filter(
            function(flat) {

                return (

                    String(
                        flat.apartmentId
                    )
                    ===
                    String(
                        apartmentId
                    )

                    &&

                    flat.status ===
                    "ACTIVE"

                );

            }
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
                    flat.flatNumber;


                flatDropdown.appendChild(
                    option
                );

            }
        );

}


// ========================================
// LOAD RESIDENT
// ========================================

function loadResident() {

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


    const residentInput =
        document.getElementById(
            "residentName"
        );


    residentInput.value = "";


    if (
        !apartmentId ||
        !flatId
    ) {

        return;

    }


    const residents =
        getResidents();


    const resident =
        residents.find(
            function(item) {

                return (

                    String(
                        item.apartmentId
                    )
                    ===
                    String(
                        apartmentId
                    )

                    &&

                    String(
                        item.flatId
                    )
                    ===
                    String(
                        flatId
                    )

                    &&

                    item.status ===
                    "ACTIVE"

                );

            }
        );


    if (resident) {

        residentInput.value =
            resident.residentName;

    } else {

        residentInput.value =
            "No active resident";

    }

}


// ========================================
// CALCULATE TOTAL
// ========================================

function calculateTotal() {

    const maintenance =
        parseFloat(
            document
                .getElementById(
                    "maintenanceAmount"
                )
                .value
        ) || 0;


    const other =
        parseFloat(
            document
                .getElementById(
                    "otherCharges"
                )
                .value
        ) || 0;


    const total =
        maintenance + other;


    document
        .getElementById(
            "totalAmount"
        )
        .value =
        total.toFixed(2);

}


// ========================================
// SAVE MAINTENANCE
// ========================================

function saveMaintenance() {

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
            .value;


    const maintenanceAmount =
        parseFloat(
            document
                .getElementById(
                    "maintenanceAmount"
                )
                .value
        ) || 0;


    const otherCharges =
        parseFloat(
            document
                .getElementById(
                    "otherCharges"
                )
                .value
        ) || 0;


    const totalAmount =
        maintenanceAmount +
        otherCharges;


    const effectiveFrom =
        document
            .getElementById(
                "effectiveFrom"
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
        !apartmentId ||
        !flatId ||
        maintenanceAmount <= 0 ||
        !effectiveFrom
    ) {

        alert(
            "Please select Apartment, Flat, enter Maintenance Amount and Effective From date."
        );

        return;

    }


    // ====================================
    // CHECK FOR FUTURE DUPLICATE
    // ====================================

    const duplicate =
        maintenanceRecords.find(
            function(record) {

                return (

                    record.apartmentId
                    ===
                    apartmentId

                    &&

                    record.flatId
                    ===
                    flatId

                    &&

                    record.effectiveFrom
                    ===
                    effectiveFrom

                );

            }
        );


    if (duplicate) {

        alert(
            "Maintenance already exists for this flat and effective date."
        );

        return;

    }


    // ====================================
    // CREATE RECORD
    // ====================================

    const newRecord = {

        id:
            "MAINT-" +
            Date.now(),

        apartmentId:
            apartmentId,

        flatId:
            flatId,

        residentName:
            residentName,

        maintenanceAmount:
            maintenanceAmount,

        otherCharges:
            otherCharges,

        totalAmount:
            totalAmount,

        effectiveFrom:
            effectiveFrom,

        status:
            status,

        createdDate:
            new Date()
                .toISOString()

    };


    maintenanceRecords.push(
        newRecord
    );


    // ====================================
    // SAVE
    // ====================================

    localStorage.setItem(

        "prmMaintenance",

        JSON.stringify(
            maintenanceRecords
        )

    );


    alert(
        "Maintenance details saved successfully."
    );


    clearForm();

    displayMaintenance();

}



// ========================================
// DISPLAY MAINTENANCE
// ========================================

function displayMaintenance() {

    const table =
        document.getElementById(
            "maintenanceTable"
        );

    table.innerHTML = "";

    const apartments =
        getApartments();

    maintenanceRecords.forEach(
        function(record) {

            const apartment =
                apartments.find(
                    function(item) {

                        return (
                            item.apartmentId
                            ===
                            record.apartmentId
                        );

                    }
                );

            const apartmentName =
                apartment
                ?
                apartment.apartmentName
                :
                record.apartmentId;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${apartmentName}
                </td>

                <td>
                    ${record.flatId}
                </td>

                <td>
                    ${record.residentName || "-"}
                </td>

                <td>
                    ₹${Number(record.maintenanceAmount).toFixed(2)}
                </td>

                <td>
                    ₹${Number(record.otherCharges).toFixed(2)}
                </td>

                <td>
                    ₹${Number(record.totalAmount).toFixed(2)}
                </td>

                <td>
                    ${record.effectiveFrom}
                </td>

                <td>

                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editMaintenance('${record.id}')">

                        ✏ Edit

                    </button>

                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deleteMaintenance('${record.id}')">

                        🗑 Delete

                    </button>

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

    const record =
        maintenanceRecords.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!record) {

        return;

    }


    record.status =
        newStatus;


    localStorage.setItem(

        "prmMaintenance",

        JSON.stringify(
            maintenanceRecords
        )

    );


    displayMaintenance();

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
            "maintenanceAmount"
        )
        .value = "";


    document
        .getElementById(
            "otherCharges"
        )
        .value = "0";


    document
        .getElementById(
            "totalAmount"
        )
        .value = "";


    document
        .getElementById(
            "effectiveFrom"
        )
        .value = "";


    document
        .getElementById(
            "status"
        )
        .value = "ACTIVE";

}


// ========================================
// CALCULATE WHEN AMOUNT CHANGES
// ========================================

document
    .getElementById(
        "maintenanceAmount"
    )
    .addEventListener(
        "input",
        calculateTotal
    );


document
    .getElementById(
        "otherCharges"
    )
    .addEventListener(
        "input",
        calculateTotal
    );


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadApartments();

        displayMaintenance();

    }
);
// ========================================
// EDIT MAINTENANCE
// ========================================
// ========================================
// EDIT MAINTENANCE
// ========================================

function editMaintenance(id) {

    const record =
        maintenanceRecords.find(
            function(item) {
                return item.id === id;
            }
        );

    if (!record) {

        alert(
            "Maintenance record not found."
        );

        return;
    }


    // Store the record being edited
    editingMaintenanceId =
        record.id;


    // ==============================
    // APARTMENT
    // ==============================

    document.getElementById(
        "apartmentId"
    ).value =
        record.apartmentId || "";


    // ==============================
    // LOAD FLATS
    // ==============================

    loadFlats();


    // ==============================
    // FLAT
    // ==============================

    document.getElementById(
        "flatId"
    ).value =
        record.flatId || "";


    // ==============================
    // RESIDENT
    // ==============================

    document.getElementById(
        "residentName"
    ).value =
        record.residentName || "";


    // ==============================
    // MAINTENANCE AMOUNT
    // ==============================

    document.getElementById(
        "maintenanceAmount"
    ).value =
        record.maintenanceAmount || 0;


    // ==============================
    // OTHER CHARGES
    // ==============================

    document.getElementById(
        "otherCharges"
    ).value =
        record.otherCharges || 0;


    // ==============================
    // EFFECTIVE FROM
    // ==============================

    document.getElementById(
        "effectiveFrom"
    ).value =
        record.effectiveFrom || "";


    // ==============================
    // STATUS
    // ==============================

    document.getElementById(
        "status"
    ).value =
        record.status || "ACTIVE";


    // ==============================
    // CALCULATE TOTAL
    // ==============================

    calculateTotal();


    // ==============================
    // CHANGE BUTTON
    // ==============================

    const saveButton =
        document.querySelector(
            'button[type="submit"]'
        );

    if (saveButton) {

        saveButton.textContent =
            "UPDATE MAINTENANCE";

    }


    // ==============================
    // SCROLL TO FORM
    // ==============================

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ========================================
// DELETE MAINTENANCE
// ========================================

function deleteMaintenance(id) {

    const index =
        maintenanceRecords.findIndex(
            function(record) {
                return record.id === id;
            }
        );

    if (index === -1) {

        alert(
            "Maintenance record not found."
        );

        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this maintenance record?"
        );


    if (!confirmDelete) {
        return;
    }


    // Delete ONLY the selected record
    maintenanceRecords.splice(
        index,
        1
    );


    // Save all remaining records
    localStorage.setItem(
        "prmMaintenance",
        JSON.stringify(
            maintenanceRecords
        )
    );


    alert(
        "Maintenance record deleted successfully."
    );


    displayMaintenance();

}


/* =========================================
   MAINTENANCE MASTER - EXCEL DOWNLOAD
   ========================================= */

function downloadMaintenanceExcel() {
    if (typeof XLSX === "undefined") {
        alert("Excel library is not loaded.");
        return;
    }

    const apartments = getApartments();
    const flats = getFlats();

    const rows = maintenanceRecords.map(function (record) {
        const apartment = apartments.find(function (item) {
            return String(item.apartmentId) ===
                String(record.apartmentId);
        });

        const flat = flats.find(function (item) {
            return String(item.apartmentId) ===
                String(record.apartmentId) &&
                String(item.flatNumber) ===
                String(record.flatId);
        });

        return {
            "Maintenance ID": record.id || "",
            "Apartment ID": record.apartmentId || "",
            "Apartment Name": apartment
                ? apartment.apartmentName : "",
            "Flat Number": record.flatId || "",
            "Block": flat ? flat.block || "" : "",
            "Resident Name": record.residentName || "",
            "Maintenance Amount": Number(record.maintenanceAmount) || 0,
            "Other Charges": Number(record.otherCharges) || 0,
            "Total Amount": Number(record.totalAmount) ||
                ((Number(record.maintenanceAmount) || 0) +
                 (Number(record.otherCharges) || 0)),
            "Effective From": record.effectiveFrom || "",
            "Status": record.status || "ACTIVE"
        };
    });

    if (rows.length === 0) {
        alert("No Maintenance Master records available.");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Maintenance Master"
    );

    XLSX.writeFile(
        workbook,
        "PRM_Maintenance_Master.xlsx"
    );
}


/* =========================================
   MAINTENANCE MASTER - EXCEL UPLOAD
   Adds new records and updates matching
   Apartment + Flat + Effective From records.
   ========================================= */

function uploadMaintenanceExcel(event) {
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
                { type: "array" }
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

            function getValue(row, headings) {
                const keys = Object.keys(row);

                for (const heading of headings) {
                    const foundKey = keys.find(function (key) {
                        return key.trim().toLowerCase() ===
                            heading.trim().toLowerCase();
                    });

                    if (foundKey !== undefined &&
                        String(row[foundKey]).trim() !== "") {
                        return row[foundKey];
                    }
                }

                return "";
            }

            function normaliseDate(value) {
                const text = String(value || "").trim();

                if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
                    return text;
                }

                const match = text.match(
                    /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/
                );

                if (match) {
                    return match[3] + "-" +
                        match[2].padStart(2, "0") + "-" +
                        match[1].padStart(2, "0");
                }

                return text;
            }

            // Refresh master data before validating the upload.
            const apartments = getApartments();
            const flats = getFlats();
            const residents = getResidents();

            // Work on a copy so a failed import cannot partially
            // overwrite the saved Maintenance Master.
            const updatedRecords = maintenanceRecords.map(
                function (record) {
                    return { ...record };
                }
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

                const residentNameInput = String(getValue(row, [
                    "Resident Name", "Resident", "residentName"
                ])).trim();

                const maintenanceRaw = getValue(row, [
                    "Maintenance Amount", "Maintenance",
                    "Monthly Maintenance", "maintenanceAmount"
                ]);

                const otherRaw = getValue(row, [
                    "Other Charges", "Other Monthly Charges",
                    "otherCharges"
                ]);

                const effectiveFrom = normaliseDate(getValue(row, [
                    "Effective From", "Effective Date", "effectiveFrom"
                ]));

                const statusInput = String(getValue(row, [
                    "Status", "status"
                ]) || "ACTIVE").trim().toUpperCase();

                const importedId = String(getValue(row, [
                    "Maintenance ID", "Maintenance Id", "id"
                ])).trim();

                const maintenanceAmount =
                    Number(String(maintenanceRaw).replace(/,/g, ""));

                const otherCharges = otherRaw === ""
                    ? 0
                    : Number(String(otherRaw).replace(/,/g, ""));

                if (
                    !flatNumber ||
                    !effectiveFrom ||
                    maintenanceRaw === "" ||
                    !Number.isFinite(maintenanceAmount) ||
                    maintenanceAmount <= 0 ||
                    !Number.isFinite(otherCharges) ||
                    otherCharges < 0
                ) {
                    skipped++;
                    return;
                }

                // Match apartment by ID first, then exact name.
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

                // Confirm the flat belongs to this apartment.
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

                // Prefer the name in Excel. If omitted, use the
                // active resident assigned to this apartment + flat.
                const resident = residents.find(function (item) {
                    return String(item.apartmentId) ===
                        String(apartment.apartmentId) &&
                        String(item.flatId).trim().toLowerCase() ===
                        flatNumber.toLowerCase() &&
                        item.status === "ACTIVE";
                });

                const residentName = residentNameInput ||
                    (resident ? resident.residentName : "");

                const recordData = {
                    apartmentId: apartment.apartmentId,
                    flatId: flat.flatNumber,
                    residentName: residentName,
                    maintenanceAmount: maintenanceAmount,
                    otherCharges: otherCharges,
                    totalAmount: maintenanceAmount + otherCharges,
                    effectiveFrom: effectiveFrom,
                    status: ["ACTIVE", "INACTIVE"].includes(statusInput)
                        ? statusInput : "ACTIVE"
                };

                // Update matching ID first; otherwise match the
                // Apartment + Flat + Effective From combination.
                let index = -1;

                if (importedId) {
                    index = updatedRecords.findIndex(function (item) {
                        return String(item.id) === importedId;
                    });
                }

                if (index === -1) {
                    index = updatedRecords.findIndex(function (item) {
                        return String(item.apartmentId) ===
                            String(apartment.apartmentId) &&
                            String(item.flatId).trim().toLowerCase() ===
                            String(flat.flatNumber).trim().toLowerCase() &&
                            String(item.effectiveFrom) === effectiveFrom;
                    });
                }

                if (index !== -1) {
                    updatedRecords[index] = {
                        ...updatedRecords[index],
                        ...recordData
                    };
                    updated++;
                } else {
                    updatedRecords.push({
                        id: importedId ||
                            "MAINT-" + Date.now() + "-" + added,
                        ...recordData,
                        createdDate: new Date().toISOString()
                    });
                    added++;
                }
            });

            // Save only after all rows have been processed.
            maintenanceRecords = updatedRecords;

            localStorage.setItem(
                "prmMaintenance",
                JSON.stringify(maintenanceRecords)
            );

            displayMaintenance();

            alert(
                "Maintenance Excel import completed.\n\n" +
                "New records: " + added + "\n" +
                "Updated records: " + updated + "\n" +
                "Skipped rows: " + skipped
            );

        } catch (error) {
            console.error("Maintenance Excel import error:", error);
            alert(
                "Unable to read the Excel file. " +
                "Please check the file format and column headings."
            );
        } finally {
            event.target.value = "";
        }
    };

    reader.readAsArrayBuffer(file);
}
