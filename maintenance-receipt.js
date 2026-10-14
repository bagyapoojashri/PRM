// ========================================
// PRM MAINTENANCE RECEIPT
// ========================================


// ========================================
// SESSION
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

    } catch {

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

    } catch {

        return [];

    }

}


// ========================================
// MASTER DATA
// ========================================

const apartments =
    getData("prmApartments");

const flats =
    getData("prmFlats");

const residents =
    getData("prmResidents");

const maintenanceMasters =
    getData("prmMaintenance");


// ========================================
// ELEMENTS
// ========================================

const apartmentSelect =
    document.getElementById(
        "apartmentId"
    );

const flatSelect =
    document.getElementById(
        "flatId"
    );

const residentSelect =
    document.getElementById(
        "residentId"
    );


// ========================================
// MANAGER INFORMATION
// ========================================

document.getElementById(
    "managerInfo"
).textContent =

    "Manager: " +
    manager.username +
    " | Apartment: " +
    manager.apartmentId;


// ========================================
// DATE
// ========================================

document.getElementById(
    "entryDate"
).value =
    new Date()
        .toISOString()
        .split("T")[0];


//
//

// ========================================
// LOAD APARTMENT
// ========================================

function loadApartment() {

    apartmentSelect.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "Select Apartment";

    apartmentSelect.appendChild(
        defaultOption
    );


    apartments.forEach(
        function(apartment) {

            if (
                manager.apartmentId &&
                apartment.apartmentId !==
                manager.apartmentId
            ) {

                return;

            }


            const option =
                document.createElement("option");

            option.value =
                apartment.apartmentId;

            option.textContent =
                apartment.apartmentName;

            apartmentSelect.appendChild(
                option
            );

        }
    );


    // Automatically select
    // Manager's assigned apartment

    if (manager.apartmentId) {

        apartmentSelect.value =
            manager.apartmentId;

        loadFlats();

    }

}

loadApartment();


// ========================================
// APARTMENT CHANGE
// ========================================

apartmentSelect.addEventListener(
    "change",
    function() {

        loadFlats();

        residentSelect.innerHTML =
            '<option value="">Select Resident</option>';

        clearAmounts();

    }
);


// ========================================
// LOAD FLATS
// ========================================

function loadFlats() {

    const apartmentId =
        apartmentSelect.value;


    flatSelect.innerHTML =
        '<option value="">Select Flat</option>';


    flats.forEach(
        function(flat) {

            if (
                flat.apartmentId ===
                apartmentId
            ) {

                const option =
                    document.createElement(
                        "option"
                    );
                option.value =
                    flat.flatNumber;

                option.textContent =
                    flat.flatNumber;

                flatSelect.appendChild(
                    option
                );

            }

        }
    );

}


// ========================================
// FLAT CHANGE
// ========================================

flatSelect.addEventListener(
    "change",
    function() {

        loadResidents();

        clearAmounts();

    }
);


// ========================================
// LOAD RESIDENTS
// ========================================

function loadResidents() {

    const apartmentId =
        apartmentSelect.value;

    const flatId =
        flatSelect.value;

    residentSelect.innerHTML =
        '<option value="">Select Resident</option>';

    const selectedFlat =
        flats.find(function(flat) {
            return flat.id === flatId;
        });

    residents.forEach(function(resident) {

        const apartmentMatch =
            String(resident.apartmentId || "").trim() ===
            String(apartmentId || "").trim();

        const flatMatch =
            String(resident.flatId || "").trim() ===
            String(flatId || "").trim()
            ||
            (
                selectedFlat &&
                String(resident.flatNumber || "").trim() ===
                String(selectedFlat.flatNumber || "").trim()
            );

        const statusMatch =
            !resident.status ||
            String(resident.status).trim().toUpperCase() === "ACTIVE";

        if (
            apartmentMatch &&
            flatMatch &&
            statusMatch
        ) {

            const option =
                document.createElement("option");

            option.value =
                resident.id;

            option.textContent =
                resident.residentName;

            residentSelect.appendChild(option);
        }

    });

}

// ========================================
// RESIDENT CHANGE
// ========================================

residentSelect.addEventListener(
    "change",
    function() {

        loadMaintenanceMaster();

        calculateOutstanding();

    }
);


// ========================================
// LOAD MAINTENANCE MASTER
// ========================================

function loadMaintenanceMaster() {

    const apartmentId =
        apartmentSelect.value;

    const flatId =
        flatSelect.value;


    const master =
        maintenanceMasters.find(
            function(item) {

                return (

                    item.apartmentId ===
                    apartmentId

                    &&

                    item.flatId ===
                    flatId

                    &&

                    item.status ===
                    "ACTIVE"

                );

            }
        );


    if (!master) {

        clearAmounts();

        return;

    }


    document.getElementById(
        "maintenanceAmount"
    ).value =

        Number(
            master.maintenanceAmount
        ) || 0;


    document.getElementById(
        "otherCharges"
    ).value =

        Number(
            master.otherCharges
        ) || 0;


    calculateTotal();

}


// ========================================
// CALCULATE TOTAL
// ========================================

function calculateTotal() {

    const previous =
        Number(
            document.getElementById(
                "previousOutstanding"
            ).value
        ) || 0;


    const maintenance =
        Number(
            document.getElementById(
                "maintenanceAmount"
            ).value
        ) || 0;


    const other =
        Number(
            document.getElementById(
                "otherCharges"
            ).value
        ) || 0;


    const total =
        previous +
        maintenance +
        other;


    document.getElementById(
        "totalDue"
    ).value =
        total;


    calculateClosing();

}


// ========================================
// CALCULATE CLOSING
// ========================================

function calculateClosing() {

    const total =
        Number(
            document.getElementById(
                "totalDue"
            ).value
        ) || 0;


    const collected =
        Number(
            document.getElementById(
                "amountCollected"
            ).value
        ) || 0;


    let balance =
        total - collected;


    if (balance < 0) {

        balance = 0;

    }


    document.getElementById(
        "closingOutstanding"
    ).value =
        balance;

}


document.getElementById(
    "amountCollected"
).addEventListener(
    "input",
    calculateClosing
);


// ========================================
// FIND PREVIOUS OUTSTANDING
// ========================================

function calculateOutstanding() {

    const apartmentId =
        apartmentSelect.value;

    const flatId =
        flatSelect.value;


    if (
        !apartmentId ||
        !flatId
    ) {

        return;

    }


    const receipts =
        getData(
            "prmMaintenanceEntries"
        );


    const flatEntries =
        receipts.filter(
            function(entry) {

                return (

                    entry.apartmentId ===
                    apartmentId

                    &&

                    entry.flatId ===
                    flatId

                );

            }
        );


    if (flatEntries.length === 0) {

        document.getElementById(
            "previousOutstanding"
        ).value = 0;

        calculateTotal();

        return;

    }


    flatEntries.sort(
        function(a,b) {

            return new Date(
                b.entryDate
            ) -
            new Date(
                a.entryDate
            );

        }
    );


    const latest =
        flatEntries[0];


    document.getElementById(
        "previousOutstanding"
    ).value =

        Number(
            latest.closingOutstanding
        ) || 0;


    calculateTotal();

}


// ========================================
// CLEAR AMOUNTS
// ========================================

function clearAmounts() {

    document.getElementById(
        "previousOutstanding"
    ).value = 0;

    document.getElementById(
        "maintenanceAmount"
    ).value = 0;

    document.getElementById(
        "otherCharges"
    ).value = 0;

    document.getElementById(
        "totalDue"
    ).value = 0;

    document.getElementById(
        "closingOutstanding"
    ).value = 0;

}


// ========================================
// SAVE ACTIVITY
// ========================================

function logActivity(
    activity,
    description
) {

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
            manager.apartmentId,

        activity:
            activity,

        description:
            description

    });


    localStorage.setItem(

        "prmActivityLog",

        JSON.stringify(
            activities
        )

    );

}


// ========================================
// SAVE RECEIPT
// ========================================

document.getElementById(
    "maintenanceForm"
).addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const entries =
            getData(
                "prmMaintenanceEntries"
            );


        const entry = {

            id:
                "MR-" +
                Date.now(),

            entryDate:
                document.getElementById(
                    "entryDate"
                ).value,

            apartmentId:
                apartmentSelect.value,

            flatId:
                flatSelect.value,

            residentId:
                residentSelect.value,

            previousOutstanding:
                Number(
                    document.getElementById(
                        "previousOutstanding"
                    ).value
                ) || 0,

            maintenanceAmount:
                Number(
                    document.getElementById(
                        "maintenanceAmount"
                    ).value
                ) || 0,

            otherCharges:
                Number(
                    document.getElementById(
                        "otherCharges"
                    ).value
                ) || 0,

            totalDue:
                Number(
                    document.getElementById(
                        "totalDue"
                    ).value
                ) || 0,

            amountCollected:
                Number(
                    document.getElementById(
                        "amountCollected"
                    ).value
                ) || 0,

            closingOutstanding:
                Number(
                    document.getElementById(
                        "closingOutstanding"
                    ).value
                ) || 0,

            paymentMode:
                document.getElementById(
                    "paymentMode"
                ).value,

            referenceNo:
                document.getElementById(
                    "referenceNo"
                ).value.trim(),

            remarks:
                document.getElementById(
                    "remarks"
                ).value.trim(),

            enteredBy:
                manager.username,

            createdDate:
                new Date().toISOString()

        };


        entries.push(entry);


        localStorage.setItem(

            "prmMaintenanceEntries",

            JSON.stringify(
                entries
            )

        );


        // AUDIT

        logActivity(

            "MAINTENANCE_ENTRY",

            "Maintenance receipt " +
            entry.id +
            " created for Flat " +
            entry.flatId

        );


        alert(
            "Maintenance receipt saved successfully."
        );


        document.getElementById(
            "maintenanceForm"
        ).reset();


        document.getElementById(
            "entryDate"
        ).value =
            new Date()
                .toISOString()
                .split("T")[0];


      clearAmounts();

// Restore assigned apartment
apartmentSelect.value =
    manager.apartmentId;

// Reload flats
loadFlats();

// Reset resident
residentSelect.innerHTML =
    '<option value="">Select Resident</option>';

// Refresh receipt history
loadReceiptHistory();

}
    
);
// =================x   =======================
// MAINTENANCE RECEIPT HISTORY
// ========================================

function formatAmount(amount) {

    return Number(amount || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ========================================
// FIND APARTMENT NAME
// ========================================

function getApartmentName(apartmentId) {

    const apartment =
        apartments.find(
            function(item) {

                return item.apartmentId === apartmentId;

            }
        );

    return apartment
        ? apartment.apartmentName
        : apartmentId;

}


// ========================================
// FIND FLAT NUMBER
// ========================================

function getFlatNumber(flatId) {

    const flat =
        flats.find(
            function(item) {

                return (
                    item.id === flatId ||
                    item.flatNumber === flatId
                );

            }
        );

    return flat
        ? flat.flatNumber
        : flatId;

}


// ========================================
// FIND RESIDENT NAME
// ========================================

function getResidentName(residentId) {

    const resident =
        residents.find(
            function(item) {

                return item.id === residentId;

            }
        );

    return resident
        ? resident.residentName
        : residentId;

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ========================================
// LOAD RECEIPT HISTORY
// ========================================

function loadReceiptHistory() {

    const historyBody =
        document.getElementById(
            "historyTableBody"
        );

    if (!historyBody) {

        return;

    }


    const searchInput =
        document.getElementById(
            "historySearch"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const entries =
        getData(
            "prmMaintenanceEntries"
        );


    // Manager can see only
    // his assigned apartment

    let managerEntries =
        entries.filter(
            function(entry) {

                return (
                    entry.apartmentId ===
                    manager.apartmentId
                );

            }
        );


    // Search

    if (searchText) {

        managerEntries =
            managerEntries.filter(
                function(entry) {

                    const receiptNo =
                        String(
                            entry.id || ""
                        ).toLowerCase();


                    const flatNo =
                        String(
                            getFlatNumber(
                                entry.flatId
                            )
                        ).toLowerCase();


                    const residentName =
                        String(
                            getResidentName(
                                entry.residentId
                            )
                        ).toLowerCase();


                    return (

                        receiptNo.includes(
                            searchText
                        )

                        ||

                        flatNo.includes(
                            searchText
                        )

                        ||

                        residentName.includes(
                            searchText
                        )

                    );

                }
            );

    }


    // Latest receipt first

    managerEntries.sort(
        function(a, b) {

            return (
                new Date(
                    b.createdDate
                ) -
                new Date(
                    a.createdDate
                )
            );

        }
    );


    historyBody.innerHTML = "";


    if (managerEntries.length === 0) {

        historyBody.innerHTML =

            '<tr>' +

            '<td colspan="8" class="no-history">' +

            'No maintenance receipts found.' +

            '</td>' +

            '</tr>';

        return;

    }


    managerEntries.forEach(
        function(entry) {

            const row =
                document.createElement(
                    "tr"
                );


            const receiptDate =
                entry.entryDate
                    ? new Date(
                        entry.entryDate +
                        "T00:00:00"
                    ).toLocaleDateString(
                        "en-IN"
                    )
                    : "";


            row.innerHTML =

                "<td>" +

                escapeHTML(
                    receiptDate
                ) +

                "</td>" +


                "<td><strong>" +

                escapeHTML(
                    entry.id
                ) +

                "</strong></td>" +


                "<td>" +

                escapeHTML(
                    getFlatNumber(
                        entry.flatId
                    )
                ) +

                "</td>" +


                "<td>" +

                escapeHTML(
                    getResidentName(
                        entry.residentId
                    )
                ) +

                "</td>" +


                "<td>₹ " +

                formatAmount(
                    entry.totalDue
                ) +

                "</td>" +


                "<td>₹ " +

                formatAmount(
                    entry.amountCollected
                ) +

                "</td>" +


                "<td>₹ " +

                formatAmount(
                    entry.closingOutstanding
                ) +

                "</td>" +


                "<td>" +

                '<button ' +

                'type="button" ' +

                'class="print-receipt-button" ' +

                'data-receipt-id="' +

                escapeHTML(
                    entry.id
                ) +

                '">' +

                "🖨 Print" +

                "</button>" +

                "</td>";


            historyBody.appendChild(
                row
            );

        }
    );


    // Print button events

    historyBody
        .querySelectorAll(
            ".print-receipt-button"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        printMaintenanceReceipt(
                            button.dataset.receiptId
                        );

                    }
                );

            }
        );

}


// ========================================
// PRINT MAINTENANCE RECEIPT
// ========================================

function printMaintenanceReceipt(
    receiptId
) {

    const entries =
        getData(
            "prmMaintenanceEntries"
        );


    const entry =
        entries.find(
            function(item) {

                return item.id === receiptId;

            }
        );


    if (!entry) {

        alert(
            "Receipt not found."
        );

        return;

    }


    const apartmentName =
        getApartmentName(
            entry.apartmentId
        );
const apartment =
    apartments.find(
        function(item) {
            return item.apartmentId === entry.apartmentId;
        }
    );

const apartmentAddress =
    apartment
        ? [
            apartment.address,
            apartment.city,
            apartment.state,
            apartment.pincode
          ]
          .filter(Boolean)
          .join(", ")
        : "";

    const flatNumber =
        getFlatNumber(
            entry.flatId
        );


    const residentName =
        getResidentName(
            entry.residentId
        );


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=800,height=900"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to print the receipt."
        );

        return;

    }


    const receiptHTML = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>Maintenance Receipt - ${escapeHTML(entry.id)}</title>


<style>

    body {

        font-family: Arial, sans-serif;

        margin: 0;

        padding: 30px;

        background: white;

        color: #111;

    }


    .receipt {

        max-width: 700px;

        margin: auto;

        border: 1px solid #222;

        padding: 30px;

    }


    .header {

        text-align: center;

        border-bottom: 2px solid #222;

        padding-bottom: 15px;

        margin-bottom: 20px;

    }


    .header h1 {

        margin: 0 0 8px 0;

        font-size: 24px;

    }
.header h3 {
    margin: 5px 0;
    font-size: 18px;
}

.apartment-address {
    margin: 3px 0 10px 0;
    font-size: 13px;
}

    .header h2 {

        margin: 0;

        font-size: 18px;

    }


    .details {

        display: grid;

        grid-template-columns: 1fr 1fr;

        gap: 10px;

        margin-bottom: 20px;

    }


    .detail-item {

        padding: 5px;

    }


    .label {

        font-weight: bold;

    }


    table {

        width: 100%;

        border-collapse: collapse;

        margin-top: 15px;

    }


    th,
    td {

        border: 1px solid #333;

        padding: 10px;

    }


    th {

        text-align: left;

    }


    td.amount {

        text-align: right;

    }


    .total-row {

        font-weight: bold;

        font-size: 16px;

    }


    .footer {

        margin-top: 40px;

        display: flex;

        justify-content: space-between;

    }


    .signature {

        margin-top: 50px;

        border-top: 1px solid #333;

        width: 180px;

        text-align: center;

        padding-top: 5px;

    }


    .print-button {

        display: block;

        margin: 20px auto;

        padding: 10px 25px;

        cursor: pointer;

    }


    @media print {

        .print-button {

            display: none;

        }

        body {

            padding: 0;

        }

        .receipt {

            border: none;

        }

    }

</style>

</head>


<body>


<div class="receipt">


<div class="header">

    <h1>
        PATHEMATIC RESIDENCE MANAGEMENT
    </h1>

    <h3>
        ${escapeHTML(apartmentName)}
    </h3>

    <p class="apartment-address">
        ${escapeHTML(apartmentAddress)}
    </p>

    <h2>
        MAINTENANCE RECEIPT
    </h2>

</div>

    <div class="details">


        <div class="detail-item">

            <span class="label">
                Receipt No:
            </span>

            ${escapeHTML(entry.id)}

        </div>


        <div class="detail-item">

            <span class="label">
                Date:
            </span>

            ${escapeHTML(entry.entryDate)}

        </div>


        <div class="detail-item">

            <span class="label">
                Apartment:
            </span>

            ${escapeHTML(apartmentName)}

        </div>


        <div class="detail-item">

            <span class="label">
                Flat No:
            </span>

            ${escapeHTML(flatNumber)}

        </div>


        <div class="detail-item">

            <span class="label">
                Resident:
            </span>

            ${escapeHTML(residentName)}

        </div>


        <div class="detail-item">

            <span class="label">
                Payment Mode:
            </span>

            ${escapeHTML(entry.paymentMode)}

        </div>


    </div>


    <table>


        <thead>

            <tr>

                <th>
                    Particulars
                </th>

                <th>
                    Amount
                </th>

            </tr>

        </thead>


        <tbody>


            <tr>

                <td>
                    Previous Outstanding
                </td>

                <td class="amount">
                    ₹ ${formatAmount(
                        entry.previousOutstanding
                    )}
                </td>

            </tr>


            <tr>

                <td>
                    Maintenance
                </td>

                <td class="amount">
                    ₹ ${formatAmount(
                        entry.maintenanceAmount
                    )}
                </td>

            </tr>


            <tr>

                <td>
                    Other Charges
                </td>

                <td class="amount">
                    ₹ ${formatAmount(
                        entry.otherCharges
                    )}
                </td>

            </tr>


            <tr class="total-row">

                <td>
                    TOTAL DUE
                </td>

                <td class="amount">
                    ₹ ${formatAmount(
                        entry.totalDue
                    )}
                </td>

            </tr>


            <tr>

                <td>
                    Amount Collected
                </td>

                <td class="amount">
                    ₹ ${formatAmount(
                        entry.amountCollected
                    )}
                </td>

            </tr>


            <tr class="total-row">

                <td>
                    BALANCE
                </td>

                <td class="amount">
                    ₹ ${formatAmount(
                        entry.closingOutstanding
                    )}
                </td>

            </tr>


        </tbody>


    </table>


    ${
        entry.referenceNo
        ? `
        <p>
            <strong>
                Reference No:
            </strong>
            ${escapeHTML(entry.referenceNo)}
        </p>
        `
        : ""
    }


    ${
        entry.remarks
        ? `
        <p>
            <strong>
                Remarks:
            </strong>
            ${escapeHTML(entry.remarks)}
        </p>
        `
        : ""
    }


    <div class="footer">


        <div>

            Entered By:<br>

            <strong>
                ${escapeHTML(entry.enteredBy)}
            </strong>

        </div>


<div class="signature">

    Manager Signature

    <br>

    <strong>
        ${escapeHTML(manager.managerName || manager.username)}
    </strong>

</div>

    </div>


</div>


<button
    class="print-button"
    onclick="window.print()"
>
    🖨 Print Receipt
</button>


<script>

    window.onload = function() {

        setTimeout(
            function() {

                window.print();

            },
            300
        );

    };

</script>


</body>

</html>

`;


    printWindow.document.open();

    printWindow.document.write(
        receiptHTML
    );

    printWindow.document.close();

}


// ========================================
// HISTORY SEARCH
// ========================================

const historySearch =
    document.getElementById(
        "historySearch"
    );


if (historySearch) {

    historySearch.addEventListener(
        "input",
        loadReceiptHistory
    );

}


// ========================================
// LOAD HISTORY WHEN PAGE OPENS
// ========================================

loadReceiptHistory();
// ========================================
// DOWNLOAD MAINTENANCE RECEIPT EXCEL
// ========================================

function downloadMaintenanceExcel() {

    const entries =
        getData(
            "prmMaintenanceEntries"
        );


    if (!entries.length) {

        alert(
            "No maintenance receipts available for download."
        );

        return;
    }


    // Manager sees only assigned apartment
    const managerEntries =
        entries.filter(
            function(entry) {

                return (
                    entry.apartmentId ===
                    manager.apartmentId
                );

            }
        );


    if (!managerEntries.length) {

        alert(
            "No maintenance receipts found for your apartment."
        );

        return;
    }


    const excelData =
        managerEntries.map(
            function(entry) {

                return {

                    "Receipt ID":
                        entry.id || "",

                    "Entry Date":
                        entry.entryDate || "",

                    "Apartment ID":
                        entry.apartmentId || "",

                    "Flat No":
                        getFlatNumber(
                            entry.flatId
                        ),

                    "Resident":
                        getResidentName(
                            entry.residentId
                        ),

                    "Previous Outstanding":
                        Number(
                            entry.previousOutstanding
                        ) || 0,

                    "Maintenance":
                        Number(
                            entry.maintenanceAmount
                        ) || 0,

                    "Other Charges":
                        Number(
                            entry.otherCharges
                        ) || 0,

                    "Total Due":
                        Number(
                            entry.totalDue
                        ) || 0,

                    "Amount Collected":
                        Number(
                            entry.amountCollected
                        ) || 0,

                    "Closing Outstanding":
                        Number(
                            entry.closingOutstanding
                        ) || 0,

                    "Payment Mode":
                        entry.paymentMode || "",

                    "Reference No":
                        entry.referenceNo || "",

                    "Remarks":
                        entry.remarks || "",

                    "Entered By":
                        entry.enteredBy || "",

                    "Created Date":
                        entry.createdDate || ""

                };

            }
        );


    const worksheet =
        XLSX.utils.json_to_sheet(
            excelData
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Maintenance Receipts"
    );


    XLSX.writeFile(
        workbook,
        "Maintenance_Receipts.xlsx"
    );

}
// ========================================
// UPLOAD MAINTENANCE RECEIPT EXCEL
// ========================================

function uploadMaintenanceExcel(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function(e) {

            try {

                const data =
                    new Uint8Array(
                        e.target.result
                    );


                const workbook =
                    XLSX.read(
                        data,
                        {
                            type: "array"
                        }
                    );


                const sheetName =
                    workbook.SheetNames[0];


                const worksheet =
                    workbook.Sheets[
                        sheetName
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


                const entries =
                    getData(
                        "prmMaintenanceEntries"
                    );


                let importedCount = 0;


                rows.forEach(
                    function(row) {

                        const flatNo =
                            String(
                                row["Flat No"] || ""
                            ).trim();


                        if (!flatNo) {
                            return;
                        }


                        const newEntry = {

                            id:
                                row["Receipt ID"]
                                ||
                                (
                                    "MR-" +
                                    Date.now() +
                                    "-" +
                                    importedCount
                                ),

                            entryDate:
                                row["Entry Date"]
                                || "",

                            apartmentId:
                                manager.apartmentId,

                            flatId:
                                findFlatIdByNumber(
                                    flatNo
                                ),

                            residentId:
                                findResidentIdByName(
                                    row["Resident"] || ""
                                ),

                            previousOutstanding:
                                Number(
                                    row[
                                        "Previous Outstanding"
                                    ]
                                ) || 0,

                            maintenanceAmount:
                                Number(
                                    row[
                                        "Maintenance"
                                    ]
                                ) || 0,

                            otherCharges:
                                Number(
                                    row[
                                        "Other Charges"
                                    ]
                                ) || 0,

                            totalDue:
                                Number(
                                    row[
                                        "Total Due"
                                    ]
                                ) || 0,

                            amountCollected:
                                Number(
                                    row[
                                        "Amount Collected"
                                    ]
                                ) || 0,

                            closingOutstanding:
                                Number(
                                    row[
                                        "Closing Outstanding"
                                    ]
                                ) || 0,

                            paymentMode:
                                row[
                                    "Payment Mode"
                                ] || "CASH",

                            referenceNo:
                                String(
                                    row[
                                        "Reference No"
                                    ] || ""
                                ),

                            remarks:
                                String(
                                    row[
                                        "Remarks"
                                    ] || ""
                                ),

                            enteredBy:
                                manager.username,

                            createdDate:
                                new Date().toISOString()

                        };


                        // Do not import if flat
                        // cannot be identified
                        if (!newEntry.flatId) {

                            return;
                        }


                        entries.push(
                            newEntry
                        );


                        importedCount++;

                    }
                );


                localStorage.setItem(
                    "prmMaintenanceEntries",
                    JSON.stringify(
                        entries
                    )
                );


                alert(
                    importedCount +
                    " maintenance receipt(s) imported successfully."
                );


                // Refresh history
                loadReceiptHistory();


            }
            catch (error) {

                console.error(
                    error
                );

                alert(
                    "Unable to read the Excel file. Please check the Excel format."
                );

            }


            // Reset upload control
            event.target.value = "";

        };


    reader.readAsArrayBuffer(
        file
    );

}