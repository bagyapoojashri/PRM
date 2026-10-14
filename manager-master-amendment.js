// ========================================
// PRM MANAGER MASTER AMENDMENT
// ========================================


// ========================================
// GET MANAGER SESSION
// ========================================

function getManagerSession() {

    const data =
        sessionStorage.getItem(
            "prmLoggedInUser"
        );

    if (!data) {

        window.location.href =
            "login.html";

        return null;

    }

    try {

        return JSON.parse(data);

    }

    catch {

        window.location.href =
            "login.html";

        return null;

    }

}


const manager =
    getManagerSession();


if (!manager) {

    throw new Error(
        "Manager session not found."
    );

}


// ========================================
// CHECK MASTER ACCESS
// ========================================

if (
    manager.masterAccess !== true
) {

    alert(
        "Master Amendment access is not permitted."
    );

    window.location.href =
        "manager-dashboard.html";

}


// ========================================
// MANAGER APARTMENT
// ========================================

const managerApartmentId =
    manager.apartmentId || "";


if (!managerApartmentId) {

    alert(
        "No apartment is assigned to this Manager."
    );

    window.location.href =
        "manager-dashboard.html";

}


// ========================================
// LOCAL STORAGE GETTER
// ========================================

function getData(key) {

    const data =
        localStorage.getItem(key);

    if (!data) {

        return [];

    }

    try {

        return JSON.parse(data);

    }

    catch {

        return [];

    }

}


// ========================================
// SAVE DATA
// ========================================

function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


// ========================================
// MASTER DATA
// ========================================

let apartments =
    getData("prmApartments");

let flats =
    getData("prmFlats");

let residents =
    getData("prmResidents");

let maintenanceRecords =
    getData("prmMaintenance");


// ========================================
// GET ASSIGNED APARTMENT
// ========================================

function getAssignedApartment() {

    return apartments.find(
        function(apartment) {

            return (
                String(apartment.apartmentId)
                ===
                String(managerApartmentId)
            );

        }
    );

}


const assignedApartment =
    getAssignedApartment();


// ========================================
// DISPLAY MANAGER INFORMATION
// ========================================

document.getElementById(
    "managerId"
).textContent =
    manager.username || "-";


document.getElementById(
    "apartmentManagementId"
).textContent =
    managerApartmentId;


document.getElementById(
    "apartmentName"
).textContent =
    assignedApartment
        ? assignedApartment.apartmentName
        : managerApartmentId;


// ========================================
// APARTMENT MASTER
// ========================================

function displayApartment() {

    const apartment =
        getAssignedApartment();

    const container =
        document.getElementById(
            "apartmentEditor"
        );

    if (!container) {
        return;
    }

    if (!apartment) {

        container.innerHTML =
            "<p>Apartment details not found.</p>";

        return;

    }


    container.innerHTML = `

        <div class="form-grid">

            <div class="form-group">
                <label>Apartment ID</label>

                <input
                    type="text"
                    id="editApartmentId"
                    value="${escapeHtml(apartment.apartmentId)}"
                    readonly
                >
            </div>


            <div class="form-group">
                <label>Apartment Name</label>

                <input
                    type="text"
                    id="editApartmentName"
                    value="${escapeHtml(apartment.apartmentName || "")}"
                >
            </div>


            <div class="form-group">
                <label>Address</label>

                <input
                    type="text"
                    id="editAddress"
                    value="${escapeHtml(apartment.address || "")}"
                >
            </div>


            <div class="form-group">
                <label>City</label>

                <input
                    type="text"
                    id="editCity"
                    value="${escapeHtml(apartment.city || "")}"
                >
            </div>


            <div class="form-group">
                <label>State</label>

                <input
                    type="text"
                    id="editState"
                    value="${escapeHtml(apartment.state || "")}"
                >
            </div>


            <div class="form-group">
                <label>Pincode</label>

                <input
                    type="text"
                    id="editPincode"
                    value="${escapeHtml(apartment.pincode || "")}"
                >
            </div>


            <div class="form-group">
                <label>Contact Person</label>

                <input
                    type="text"
                    id="editContactPerson"
                    value="${escapeHtml(apartment.contactPerson || "")}"
                >
            </div>


            <div class="form-group">
                <label>Contact Number</label>

                <input
                    type="text"
                    id="editContactNumber"
                    value="${escapeHtml(apartment.contactNumber || "")}"
                >
            </div>


            <div class="form-group">
                <label>Email</label>

                <input
                    type="email"
                    id="editEmail"
                    value="${escapeHtml(apartment.email || "")}"
                >
            </div>

        </div>


        <div class="form-actions">

            <button
                type="button"
                onclick="updateApartment()"
                class="save-button">

                💾 Save Apartment Changes

            </button>

        </div>

    `;

}


// ========================================
// UPDATE APARTMENT
// ========================================

function updateApartment() {

    const index =
        apartments.findIndex(
            function(apartment) {

                return (
                    String(apartment.apartmentId)
                    ===
                    String(managerApartmentId)
                );

            }
        );


    if (index === -1) {

        alert(
            "Assigned apartment was not found."
        );

        return;

    }


    apartments[index].apartmentName =
        document.getElementById(
            "editApartmentName"
        ).value.trim();


    apartments[index].address =
        document.getElementById(
            "editAddress"
        ).value.trim();


    apartments[index].city =
        document.getElementById(
            "editCity"
        ).value.trim();


    apartments[index].state =
        document.getElementById(
            "editState"
        ).value.trim();


    apartments[index].pincode =
        document.getElementById(
            "editPincode"
        ).value.trim();


    apartments[index].contactPerson =
        document.getElementById(
            "editContactPerson"
        ).value.trim();


    apartments[index].contactNumber =
        document.getElementById(
            "editContactNumber"
        ).value.trim();


    apartments[index].email =
        document.getElementById(
            "editEmail"
        ).value.trim();


    saveData(
        "prmApartments",
        apartments
    );


    logAmendment(
        "APARTMENT",
        managerApartmentId,
        "Apartment details amended"
    );


    alert(
        "Apartment details updated successfully."
    );

}


// ========================================
// FLAT MASTER
// ========================================

function displayFlats() {

    const table =
        document.getElementById(
            "flatAmendmentTable"
        );

    if (!table) {
        return;
    }

    table.innerHTML = "";


    flats
        .filter(
            function(flat) {

                return (
                    String(flat.apartmentId)
                    ===
                    String(managerApartmentId)
                );

            }
        )
        .forEach(
            function(flat) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${escapeHtml(flat.flatNumber || "")}
                    </td>

                    <td>
                        ${escapeHtml(flat.block || "-")}
                    </td>

                    <td>
                        ${escapeHtml(flat.floor || "-")}
                    </td>

                    <td>
                        ${escapeHtml(flat.flatType || "-")}
                    </td>

                    <td>
                        ${escapeHtml(flat.area || "-")}
                    </td>

                    <td>
                        ${escapeHtml(flat.parking || "-")}
                    </td>

                    <td>
                        ${escapeHtml(flat.status || "-")}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editFlat('${flat.id}')">

                            ✏ Edit

                        </button>

                    </td>

                `;

                table.appendChild(row);

            }
        );

}


// ========================================
// EDIT FLAT
// ========================================

function editFlat(id) {

    const flat =
        flats.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!flat) {

        alert(
            "Flat record not found."
        );

        return;

    }


    if (
        String(flat.apartmentId)
        !==
        String(managerApartmentId)
    ) {

        alert(
            "You are not permitted to edit this flat."
        );

        return;

    }


    const newBlock =
        prompt(
            "Block:",
            flat.block || ""
        );

    if (newBlock === null) {
        return;
    }


    const newFloor =
        prompt(
            "Floor:",
            flat.floor || ""
        );

    if (newFloor === null) {
        return;
    }


    const newFlatType =
        prompt(
            "Flat Type:",
            flat.flatType || ""
        );

    if (newFlatType === null) {
        return;
    }


    const newArea =
        prompt(
            "Area:",
            flat.area || ""
        );

    if (newArea === null) {
        return;
    }


    const newParking =
        prompt(
            "Parking:",
            flat.parking || ""
        );

    if (newParking === null) {
        return;
    }


    flat.block =
        newBlock.trim();

    flat.floor =
        newFloor.trim();

    flat.flatType =
        newFlatType.trim();

    flat.area =
        newArea.trim();

    flat.parking =
        newParking.trim();


    saveData(
        "prmFlats",
        flats
    );


    logAmendment(
        "FLAT",
        managerApartmentId,
        "Flat " +
        flat.flatNumber +
        " amended"
    );


    displayFlats();


    alert(
        "Flat details updated successfully."
    );

}


// ========================================
// RESIDENT MASTER
// ========================================

function displayResidents() {

    const table =
        document.getElementById(
            "residentAmendmentTable"
        );

    if (!table) {
        return;
    }

    table.innerHTML = "";


    residents
        .filter(
            function(resident) {

                return (
                    String(resident.apartmentId)
                    ===
                    String(managerApartmentId)
                );

            }
        )
        .forEach(
            function(resident) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${escapeHtml(resident.flatId || "-")}
                    </td>

                    <td>
                        ${escapeHtml(resident.residentName || "-")}
                    </td>

                    <td>
                        ${escapeHtml(resident.residentType || "-")}
                    </td>

                    <td>
                        ${escapeHtml(resident.mobile || "-")}
                    </td>

                    <td>
                        ${escapeHtml(resident.email || "-")}
                    </td>

                    <td>
                        ${escapeHtml(resident.moveInDate || "-")}
                    </td>

                    <td>
                        ${escapeHtml(resident.moveOutDate || "-")}
                    </td>

                    <td>
                        ${escapeHtml(resident.status || "-")}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editResident('${resident.id}')">

                            ✏ Edit

                        </button>

                    </td>

                `;

                table.appendChild(row);

            }
        );

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

        alert(
            "Resident record not found."
        );

        return;

    }


    if (
        String(resident.apartmentId)
        !==
        String(managerApartmentId)
    ) {

        alert(
            "You are not permitted to edit this resident."
        );

        return;

    }


    const newName =
        prompt(
            "Resident Name:",
            resident.residentName || ""
        );

    if (newName === null) {
        return;
    }


    const newType =
        prompt(
            "Resident Type:",
            resident.residentType || ""
        );

    if (newType === null) {
        return;
    }


    const newMobile =
        prompt(
            "Mobile:",
            resident.mobile || ""
        );

    if (newMobile === null) {
        return;
    }


    const newEmail =
        prompt(
            "Email:",
            resident.email || ""
        );

    if (newEmail === null) {
        return;
    }


    resident.residentName =
        newName.trim();

    resident.residentType =
        newType.trim();

    resident.mobile =
        newMobile.trim();

    resident.email =
        newEmail.trim();


    saveData(
        "prmResidents",
        residents
    );


    logAmendment(
        "RESIDENT",
        managerApartmentId,
        "Resident " +
        resident.residentName +
        " amended"
    );


    displayResidents();


    alert(
        "Resident details updated successfully."
    );

}


// ========================================
// MAINTENANCE MASTER
// ========================================

function displayMaintenance() {

    const table =
        document.getElementById(
            "maintenanceAmendmentTable"
        );

    if (!table) {
        return;
    }

    table.innerHTML = "";


    maintenanceRecords
        .filter(
            function(record) {

                return (
                    String(record.apartmentId)
                    ===
                    String(managerApartmentId)
                );

            }
        )
        .forEach(
            function(record) {

                const row =
                    document.createElement(
                        "tr"
                    );


                const total =
                    Number(
                        record.maintenanceAmount || 0
                    )
                    +
                    Number(
                        record.otherCharges || 0
                    );


                row.innerHTML = `

                    <td>
                        ${escapeHtml(record.flatId || "-")}
                    </td>

                    <td>
                        ${escapeHtml(record.residentName || "-")}
                    </td>

                    <td>
                        ₹${Number(
                            record.maintenanceAmount || 0
                        ).toFixed(2)}
                    </td>

                    <td>
                        ₹${Number(
                            record.otherCharges || 0
                        ).toFixed(2)}
                    </td>

                    <td>
                        ₹${total.toFixed(2)}
                    </td>

                    <td>
                        ${escapeHtml(
                            record.effectiveFrom || "-"
                        )}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editMaintenance('${record.id}')">

                            ✏ Edit

                        </button>

                    </td>

                `;

                table.appendChild(row);

            }
        );

}


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


    if (
        String(record.apartmentId)
        !==
        String(managerApartmentId)
    ) {

        alert(
            "You are not permitted to edit this maintenance record."
        );

        return;

    }


    const newMaintenance =
        prompt(
            "Maintenance Amount:",
            record.maintenanceAmount || 0
        );

    if (newMaintenance === null) {
        return;
    }


    const newOther =
        prompt(
            "Other Charges:",
            record.otherCharges || 0
        );

    if (newOther === null) {
        return;
    }


    const newEffectiveFrom =
        prompt(
            "Effective From:",
            record.effectiveFrom || ""
        );

    if (newEffectiveFrom === null) {
        return;
    }


    record.maintenanceAmount =
        Number(newMaintenance) || 0;

    record.otherCharges =
        Number(newOther) || 0;

    record.totalAmount =
        record.maintenanceAmount +
        record.otherCharges;

    record.effectiveFrom =
        newEffectiveFrom.trim();


    saveData(
        "prmMaintenance",
        maintenanceRecords
    );


    logAmendment(
        "MAINTENANCE",
        managerApartmentId,
        "Maintenance for Flat " +
        record.flatId +
        " amended"
    );


    displayMaintenance();


    alert(
        "Maintenance details updated successfully."
    );

}


// ========================================
// ACTIVITY / AMENDMENT LOG
// ========================================

function logAmendment(
    moduleName,
    apartmentId,
    description
) {

    const logs =
        getData(
            "prmMasterAmendmentLog"
        );


    logs.push({

        id:
            "AMEND-" +
            Date.now(),

        date:
            new Date().toISOString(),

        username:
            manager.username,

        apartmentId:
            apartmentId,

        module:
            moduleName,

        description:
            description

    });


    saveData(
        "prmMasterAmendmentLog",
        logs
    );


    const activities =
        getData(
            "prmActivityLog"
        );


    activities.push({

        id:
            "ACT-" +
            Date.now(),

        date:
            new Date().toISOString(),

        username:
            manager.username,

        apartmentId:
            apartmentId,

        activity:
            "MASTER AMENDMENT",

        description:
            description

    });


    saveData(
        "prmActivityLog",
        activities
    );

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(value) {

    return String(
        value || ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


// ========================================
// BACK TO DASHBOARD
// ========================================

function goBackToDashboard() {

    window.location.href =
        "manager-dashboard.html";

}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayApartment();

        displayFlats();

        displayResidents();

        displayMaintenance();

    }
);

/* =========================================
   MANAGER MASTER AMENDMENT - EXCEL EXPORT
   ========================================= */

function downloadAmendmentExcel(moduleName) {
    if (typeof XLSX === "undefined") {
        alert("Excel library is not loaded. Check your internet connection.");
        return;
    }

    const apartmentId = String(managerApartmentId);
    const apartment = getAssignedApartment();
    let rows = [];

    if (moduleName === "apartment") {
        if (apartment) {
            rows = [{
                "Apartment ID": apartment.apartmentId || "",
                "Apartment Name": apartment.apartmentName || "",
                "Address": apartment.address || "",
                "City": apartment.city || "",
                "State": apartment.state || "",
                "Pincode": apartment.pincode || "",
                "Contact Person": apartment.contactPerson || "",
                "Contact Number": apartment.contactNumber || "",
                "Email": apartment.email || ""
            }];
        }
    }

    if (moduleName === "flat") {
        rows = flats.filter(x =>
            String(x.apartmentId) === apartmentId
        ).map(x => ({
            "Flat ID": x.id || "",
            "Apartment ID": x.apartmentId || "",
            "Flat Number": x.flatNumber || "",
            "Block": x.block || "",
            "Floor": x.floor || "",
            "Flat Type": x.flatType || "",
            "Area": x.area || "",
            "Parking": x.parking || "",
            "Status": x.status || ""
        }));
    }

    if (moduleName === "resident") {
        rows = residents.filter(x =>
            String(x.apartmentId) === apartmentId
        ).map(x => ({
            "Resident ID": x.id || "",
            "Apartment ID": x.apartmentId || "",
            "Flat Number": x.flatId || "",
            "Resident Name": x.residentName || "",
            "Resident Type": x.residentType || "",
            "Mobile": x.mobile || "",
            "Email": x.email || "",
            "Move In Date": x.moveInDate || "",
            "Move Out Date": x.moveOutDate || "",
            "Status": x.status || ""
        }));
    }

    if (moduleName === "maintenance") {
        rows = maintenanceRecords.filter(x =>
            String(x.apartmentId) === apartmentId
        ).map(x => ({
            "Maintenance ID": x.id || "",
            "Apartment ID": x.apartmentId || "",
            "Flat Number": x.flatId || "",
            "Resident Name": x.residentName || "",
            "Maintenance Amount": Number(x.maintenanceAmount || 0),
            "Other Charges": Number(x.otherCharges || 0),
            "Total Amount": Number(x.totalAmount ??
                ((Number(x.maintenanceAmount) || 0) +
                 (Number(x.otherCharges) || 0))),
            "Effective From": x.effectiveFrom || ""
        }));
    }

    if (!rows.length) {
        alert("No records found for this category.");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    const sheetNames = {
        apartment: "Apartment Master",
        flat: "Flat Master",
        resident: "Resident Master",
        maintenance: "Maintenance Master"
    };

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        sheetNames[moduleName]
    );

    XLSX.writeFile(
        workbook,
        "PRM_" + moduleName.toUpperCase() + "_AMENDMENT.xlsx"
    );
}


/* =========================================
   EXCEL UPLOAD - EXISTING RECORDS ONLY
   ========================================= */

function uploadAmendmentExcel(event, moduleName) {
    const file = event.target.files[0];
    if (!file) return;

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
                { type: "array" }
            );

            const worksheet =
                workbook.Sheets[workbook.SheetNames[0]];

            const rows = XLSX.utils.sheet_to_json(
                worksheet,
                { defval: "", raw: false }
            );

            if (!rows.length) {
                alert("Excel file contains no data.");
                return;
            }

            function getValue(row, ...names) {
                const normalise = value =>
                    String(value).trim().toLowerCase()
                        .replace(/[\s_-]+/g, "");

                const key = Object.keys(row).find(k =>
                    names.some(n => normalise(k) === normalise(n))
                );

                return key === undefined ? "" : row[key];
            }

            function setValue(row, target, property, ...names) {
                const value = getValue(row, ...names);
                if (value !== "") {
                    target[property] = String(value).trim();
                }
            }

            const apartmentId = String(managerApartmentId);
            let updated = 0;
            let skipped = 0;

            if (moduleName === "apartment") {
                const target = getAssignedApartment();

                const row = rows.find(r =>
                    String(getValue(r, "Apartment ID")).trim()
                    === apartmentId
                );

                if (!target || !row) {
                    alert("Assigned Apartment ID does not match.");
                    return;
                }

                setValue(row, target, "apartmentName", "Apartment Name");
                setValue(row, target, "address", "Address");
                setValue(row, target, "city", "City");
                setValue(row, target, "state", "State");
                setValue(row, target, "pincode", "Pincode");
                setValue(row, target, "contactPerson", "Contact Person");
                setValue(row, target, "contactNumber", "Contact Number");
                setValue(row, target, "email", "Email");

                saveData("prmApartments", apartments);
                displayApartment();
                updated = 1;
            }

            if (moduleName === "flat") {
                rows.forEach(row => {
                    const id = String(getValue(row, "Flat ID")).trim();
                    const flatNo = String(getValue(row, "Flat Number")).trim();
                    const rowApartment = String(
                        getValue(row, "Apartment ID") || apartmentId
                    ).trim();

                    if (rowApartment !== apartmentId || (!id && !flatNo)) {
                        skipped++;
                        return;
                    }

                    const target = flats.find(x =>
                        String(x.apartmentId) === apartmentId &&
                        ((id && String(x.id) === id) ||
                         (!id && String(x.flatNumber).trim() === flatNo))
                    );

                    if (!target) {
                        skipped++;
                        return;
                    }

                    setValue(row, target, "block", "Block");
                    setValue(row, target, "floor", "Floor");
                    setValue(row, target, "flatType", "Flat Type");
                    setValue(row, target, "area", "Area");
                    setValue(row, target, "parking", "Parking");
                    setValue(row, target, "status", "Status");
                    updated++;
                });

                if (updated) {
                    saveData("prmFlats", flats);
                    displayFlats();
                }
            }

            if (moduleName === "resident") {
                rows.forEach(row => {
                    const id = String(getValue(row, "Resident ID")).trim();
                    const flatNo = String(getValue(row, "Flat Number")).trim();
                    const name = String(getValue(row, "Resident Name")).trim();
                    const rowApartment = String(
                        getValue(row, "Apartment ID") || apartmentId
                    ).trim();

                    if (rowApartment !== apartmentId || (!id && !flatNo)) {
                        skipped++;
                        return;
                    }

                    const target = residents.find(x =>
                        String(x.apartmentId) === apartmentId &&
                        ((id && String(x.id) === id) ||
                         (!id && String(x.flatId).trim() === flatNo &&
                          String(x.residentName).trim() === name))
                    );

                    if (!target) {
                        skipped++;
                        return;
                    }

                    setValue(row, target, "residentName", "Resident Name");
                    setValue(row, target, "residentType", "Resident Type");
                    setValue(row, target, "mobile", "Mobile");
                    setValue(row, target, "email", "Email");
                    setValue(row, target, "moveInDate", "Move In Date");
                    setValue(row, target, "moveOutDate", "Move Out Date");
                    setValue(row, target, "status", "Status");
                    updated++;
                });

                if (updated) {
                    saveData("prmResidents", residents);
                    displayResidents();
                }
            }

            if (moduleName === "maintenance") {
                rows.forEach(row => {
                    const id = String(getValue(row, "Maintenance ID")).trim();
                    const flatNo = String(getValue(row, "Flat Number")).trim();
                    const effective = String(getValue(row, "Effective From")).trim();
                    const rowApartment = String(
                        getValue(row, "Apartment ID") || apartmentId
                    ).trim();

                    if (rowApartment !== apartmentId || (!id && !flatNo)) {
                        skipped++;
                        return;
                    }

                    const target = maintenanceRecords.find(x =>
                        String(x.apartmentId) === apartmentId &&
                        ((id && String(x.id) === id) ||
                         (!id && String(x.flatId).trim() === flatNo &&
                          (!effective || String(x.effectiveFrom || "").trim() === effective)))
                    );

                    if (!target) {
                        skipped++;
                        return;
                    }

                    const maintenance = getValue(row, "Maintenance Amount");
                    const other = getValue(row, "Other Charges");

                    if (maintenance !== "") {
                        const value = Number(maintenance);
                        if (!Number.isFinite(value) || value < 0) {
                            skipped++;
                            return;
                        }
                        target.maintenanceAmount = value;
                    }

                    if (other !== "") {
                        const value = Number(other);
                        if (!Number.isFinite(value) || value < 0) {
                            skipped++;
                            return;
                        }
                        target.otherCharges = value;
                    }

                    setValue(row, target, "residentName", "Resident Name");
                    setValue(row, target, "effectiveFrom", "Effective From");

                    target.totalAmount =
                        (Number(target.maintenanceAmount) || 0) +
                        (Number(target.otherCharges) || 0);

                    updated++;
                });

                if (updated) {
                    saveData("prmMaintenance", maintenanceRecords);
                    displayMaintenance();
                }
            }

            if (updated) {
                logAmendment(
                    moduleName.toUpperCase(),
                    apartmentId,
                    updated + " record(s) amended through Excel upload"
                );
            }

            alert(
                "Upload completed.\nUpdated: " + updated +
                "\nSkipped: " + skipped +
                "\nOnly existing records for your assigned apartment were updated."
            );

        } catch (error) {
            console.error(error);
            alert("Unable to read the Excel file. Please use the downloaded template.");
        } finally {
            event.target.value = "";
        }
    };

    reader.readAsArrayBuffer(file);
}
