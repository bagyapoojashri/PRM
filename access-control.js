// ========================================
// PRM ACCESS CONTROL
// ========================================


// ========================================
// GET USERS
// ========================================

function getUsers() {

    const data =
        localStorage.getItem(
            "prmUsers"
        );

    if (!data) {

        return [];

    }

    try {

        return JSON.parse(data);

    } catch {

        return [];

    }

}
// ========================================
// EDIT ACCESS MODE
// ========================================

let editingAccessId = null;

// ========================================
// GET APARTMENTS
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

    } catch {

        return [];

    }

}


// ========================================
// ACCESS RECORDS
// ========================================

let accessRecords =
    JSON.parse(
        localStorage.getItem(
            "prmAccessControl"
        )
    ) || [];


// ========================================
// LOAD USERS
// ========================================

function loadUsers() {

    const users =
        getUsers();

    const dropdown =
        document.getElementById(
            "username"
        );


    dropdown.innerHTML =
        '<option value="">Select Manager</option>';


    users.forEach(
        function(user) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                user.username;


            option.textContent =
                user.username;


            dropdown.appendChild(
                option
            );

        }
    );

}
// ========================================
// MANAGER CHANGE
// LOAD ASSIGNED APARTMENT
// ========================================

document.getElementById(
    "username"
).addEventListener(
    "change",
    function() {

        const username =
            this.value;


        const apartmentDropdown =
            document.getElementById(
                "apartmentId"
            );


        // Clear current apartment
        apartmentDropdown.value =
            "";


        if (!username) {

            return;

        }


        // Find existing access
        // for this Manager

        const existing =
            accessRecords.find(
                function(record) {

                    return (
                        String(
                            record.username || ""
                        )
                        .trim()
                        .toLowerCase()
                        ===
                        username
                            .trim()
                            .toLowerCase()
                    );

                }
            );


        if (existing) {

            // Automatically select
            // Manager's apartment

            apartmentDropdown.value =
                existing.apartmentId;


            // Load existing permissions

            document.getElementById(
                "status"
            ).value =
                existing.status || "ACTIVE";


            document.getElementById(
                "maintenanceAccess"
            ).checked =
                existing.maintenanceAccess === true;


            document.getElementById(
                "expenseAccess"
            ).checked =
                existing.expenseAccess === true;


            document.getElementById(
                "otherEntryAccess"
            ).checked =
                existing.otherEntryAccess === true;


            document.getElementById(
                "masterAccess"
            ).checked =
                existing.masterAccess === true;

        }

    }
);
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
// SAVE ACCESS
// ========================================

// ========================================
// SAVE / UPDATE ACCESS
// ========================================

function saveAccess() {

    const username =
        document.getElementById("username").value;

    const apartmentId =
        document.getElementById("apartmentId").value;

    const status =
        document.getElementById("status").value;

    const maintenanceAccess =
        document.getElementById("maintenanceAccess").checked;

    const expenseAccess =
        document.getElementById("expenseAccess").checked;

    const otherEntryAccess =
        document.getElementById("otherEntryAccess").checked;

    const masterAccess =
        document.getElementById("masterAccess").checked;


    // ====================================
    // VALIDATION
    // ====================================

    if (
        username === "" ||
        apartmentId === ""
    ) {

        alert(
            "Please select Manager and Apartment."
        );

        return;
    }


    // ====================================
    // UPDATE EXISTING ACCESS
    // ====================================

    if (editingAccessId) {

        const record =
            accessRecords.find(
                function(item) {
                    return item.id === editingAccessId;
                }
            );


        if (!record) {

            alert(
                "Access record not found."
            );

            return;
        }


        // Update ONLY selected access record
        record.username =
            username;

        record.apartmentId =
            apartmentId;

        record.maintenanceAccess =
            maintenanceAccess;

        record.expenseAccess =
            expenseAccess;

        record.otherEntryAccess =
            otherEntryAccess;

        record.masterAccess =
            masterAccess;

        record.status =
            status;


        // Save ALL access records
        localStorage.setItem(
            "prmAccessControl",
            JSON.stringify(
                accessRecords
            )
        );


        alert(
            "Access updated successfully."
        );


        editingAccessId = null;

        clearForm();

        displayAccess();

        return;
    }


    // ====================================
    // NEW ACCESS
    // ====================================

    const existing =
        accessRecords.find(
            function(record) {

                return (
                    record.username === username
                    &&
                    record.apartmentId === apartmentId
                );

            }
        );


    if (existing) {

        alert(
            "Access already exists for this Manager and Apartment."
        );

        return;
    }


    // ====================================
    // CREATE NEW ACCESS
    // ====================================

    accessRecords.push({

        id:
            "ACCESS-" +
            Date.now(),

        username:
            username,

        apartmentId:
            apartmentId,

        maintenanceAccess:
            maintenanceAccess,

        expenseAccess:
            expenseAccess,

        otherEntryAccess:
            otherEntryAccess,

        masterAccess:
            masterAccess,

        status:
            status,

        createdDate:
            new Date().toISOString()

    });


    // Save all records
    localStorage.setItem(
        "prmAccessControl",
        JSON.stringify(
            accessRecords
        )
    );


    alert(
        "Access saved successfully."
    );


    clearForm();

    displayAccess();

}
// ========================================
// DISPLAY ACCESS
// ========================================

function displayAccess() {

    const table =
        document.getElementById(
            "accessTable"
        );


    table.innerHTML = "";


    accessRecords.forEach(
        function(record) {

            const actionButton =

                record.status ===
                "ACTIVE"

                ?

                `<button
                    class="deactivate-btn"
                    onclick="changeStatus(
                        '${record.id}',
                        'INACTIVE'
                    )">

                    Revoke

                </button>`

                :

                `<button
                    class="activate-btn"
                    onclick="changeStatus(
                        '${record.id}',
                        'ACTIVE'
                    )">

                    Give Access

                </button>`;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${record.username}
                </td>

                <td>
                    ${record.apartmentId}
                </td>

                <td>
                    ${record.maintenanceAccess
                        ? "YES"
                        : "NO"}
                </td>

                <td>
                    ${record.expenseAccess
                        ? "YES"
                        : "NO"}
                </td>

                <td>
                    ${record.otherEntryAccess
                        ? "YES"
                        : "NO"}
                </td>

                <td>
                    ${record.masterAccess
                        ? "YES"
                        : "NO"}
                </td>

                <td>
                    ${record.status}
                </td>

                <td>
    <button type="button" class="edit-btn" onclick="editAccess('${record.id}')">
        ✏ Edit
    </button>

    <button type="button" class="delete-btn" onclick="deleteAccess('${record.id}')">
        🗑 Delete
    </button>

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
// CHANGE ACCESS STATUS
// ========================================

function changeStatus(
    id,
    newStatus
) {

    const record =
        accessRecords.find(
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

        "prmAccessControl",

        JSON.stringify(
            accessRecords
        )

    );


    displayAccess();

}


// ========================================
// CLEAR
// ========================================

function clearForm() {

    document
        .getElementById(
            "username"
        )
        .value = "";


    document
        .getElementById(
            "apartmentId"
        )
        .value = "";


    document
        .getElementById(
            "status"
        )
        .value = "ACTIVE";


    document
        .getElementById(
            "maintenanceAccess"
        )
        .checked = false;


    document
        .getElementById(
            "expenseAccess"
        )
        .checked = false;


    document
        .getElementById(
            "otherEntryAccess"
        )
        .checked = false;


    document
        .getElementById(
            "masterAccess"
        )
        .checked = false;

}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadUsers();

        loadApartments();

        displayAccess();

    }
);
// ========================================
// EDIT ACCESS
// ========================================
function editAccess(id) {

    const record = accessRecords.find(item => item.id === id);

    if (!record) {
        alert("Access record not found.");
        return;
    }

    // Store selected record ID
    editingAccessId = id;

    // Load existing values into the form
    document.getElementById("username").value = record.username;
    document.getElementById("apartmentId").value = record.apartmentId;
    document.getElementById("status").value = record.status;

    document.getElementById("maintenanceAccess").checked =
        record.maintenanceAccess;

    document.getElementById("expenseAccess").checked =
        record.expenseAccess;

    document.getElementById("otherEntryAccess").checked =
        record.otherEntryAccess;

    document.getElementById("masterAccess").checked =
        record.masterAccess;

    // Change button text
    const saveButton = document.querySelector(
        'button[type="submit"], button[onclick="saveAccess()"]'
    );

    if (saveButton) {
        saveButton.textContent = "UPDATE ACCESS";
    }

    // Scroll to form
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ========================================
// DELETE ACCESS
// ========================================
function deleteAccess(id) {

    const recordIndex = accessRecords.findIndex(
        item => item.id === id
    );

    if (recordIndex === -1) {
        alert("Access record not found.");
        return;
    }

    const record = accessRecords[recordIndex];

    const confirmDelete = confirm(
        "Are you sure you want to delete access for " +
        record.username +
        "?"
    );

    if (!confirmDelete) {
        return;
    }

    // Remove ONLY the selected record
    accessRecords.splice(recordIndex, 1);

    // Save remaining records
    localStorage.setItem(
        "prmAccessControl",
        JSON.stringify(accessRecords)
    );

    // Reset edit mode
    editingAccessId = null;

    clearForm();

    // Refresh table
    displayAccess();

    alert("Access deleted successfully.");
}