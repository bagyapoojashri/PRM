// ========================================
// PRM - OTHER ENTRY
// ========================================


// ========================================
// MANAGER SESSION
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

    catch (error) {

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
// LOCAL STORAGE
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

    catch (error) {

        return [];

    }

}


function saveData(
    key,
    data
) {

    localStorage.setItem(

        key,

        JSON.stringify(data)

    );

}


// ========================================
// VARIABLES
// ========================================

let otherEntries =
    getData(
        "prmOtherEntries"
    );


const apartments =
    getData(
        "prmApartments"
    );


let editingOtherId =
    null;

    
let pendingOtherBill = null;

const otherBillUpload = document.getElementById("billUpload");

otherBillUpload.addEventListener("change", function () {
    const file = otherBillUpload.files[0];
    pendingOtherBill = null;

    if (!file) return;

    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {
        alert("Upload only PDF, JPG, JPEG or PNG files.");
        otherBillUpload.value = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert("File size must not exceed 2 MB.");
        otherBillUpload.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        pendingOtherBill = {
            billName: file.name,
            billType: file.type,
            billData: e.target.result
        };

        alert("Document uploaded. Save the entry to attach it.");
    };

    reader.onerror = function () {
        pendingOtherBill = null;
        otherBillUpload.value = "";
        alert("Unable to read the file. Please try again.");
    };

    reader.readAsDataURL(file);
});


// ========================================
// ELEMENTS
// ========================================

const otherEntryForm =
    document.getElementById(
        "otherEntryForm"
    );


const entryDate =
    document.getElementById(
        "entryDate"
    );


const entryType =
    document.getElementById(
        "entryType"
    );


const entryCategory =
    document.getElementById(
        "entryCategory"
    );


const amount =
    document.getElementById(
        "amount"
    );


const description =
    document.getElementById(
        "description"
    );


const paymentMode =
    document.getElementById(
        "paymentMode"
    );


const referenceNo =
    document.getElementById(
        "referenceNo"
    );


const remarks =
    document.getElementById(
        "remarks"
    );


// ========================================
// MANAGER INFORMATION
// ========================================

document.getElementById(
    "managerId"
).textContent =

    manager.username || "-";


document.getElementById(
    "apartmentIdDisplay"
).textContent =

    manager.apartmentId || "-";


const managerApartment =
    apartments.find(
        function(item) {

            return (

                item.apartmentId ===
                manager.apartmentId

            );

        }
    );


document.getElementById(
    "apartmentNameDisplay"
).textContent =

    managerApartment

        ? managerApartment.apartmentName

        : (
            manager.apartmentId || "-"
        );

document.getElementById(
    "apartmentAddressDisplay"
).textContent =

    managerApartment

        ? [
            managerApartment.address,
            managerApartment.city,
            managerApartment.state,
            managerApartment.pincode
          ]
          .filter(Boolean)
          .join(", ")

        : "-";
// ========================================
// DEFAULT DATE
// ========================================

entryDate.value =

    new Date()
        .toISOString()
        .split("T")[0];


// ========================================
// CREATE ENTRY ID
// ========================================

function createOtherId() {

    return (

        "OTH-" +

        manager.apartmentId +

        "-" +

        Date.now()

    );

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    return String(
        value ?? ""
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
// DISPLAY HISTORY
// ========================================

function displayOtherHistory() {

    const tbody =
        document.getElementById(
            "otherHistoryBody"
        );


    const empty =
        document.getElementById(
            "emptyHistory"
        );


    const search =
        (

            document.getElementById(
                "historySearch"
            ).value || ""

        )
            .trim()
            .toLowerCase();


    let records =
        getData(
            "prmOtherEntries"
        );


    // Only Manager's Apartment

    records =
        records.filter(
            function(item) {

                return (

                    item.apartmentId ===
                    manager.apartmentId

                );

            }
        );


    // Search

    if (search) {

        records =
            records.filter(
                function(item) {

                    const text = [

                        item.id,
                        item.entryDate,
                        item.entryType,
                        item.entryCategory,
                        item.description,
                        item.amount,
                        item.paymentMode,
                        item.referenceNo,
                        item.enteredBy

                    ]
                        .join(" ")
                        .toLowerCase();


                    return text.includes(
                        search
                    );

                }
            );

    }


    // Latest first

    records.sort(
        function(a, b) {

            return (

                new Date(
                    b.createdDate ||
                    b.entryDate
                )

                -

                new Date(
                    a.createdDate ||
                    a.entryDate
                )

            );

        }
    );


    tbody.innerHTML = "";


    if (!records.length) {

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";


    records.forEach(
        function(item, index) {


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(item.id)}
                </td>

                <td>
                    ${escapeHTML(
                        item.entryDate
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.entryType
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.entryCategory
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.description
                    )}
                </td>

                <td>
                    ₹ ${Number(
                        item.amount || 0
                    ).toLocaleString(
                        "en-IN",
                        {
                            minimumFractionDigits: 2
                        }
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.paymentMode
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.referenceNo
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.enteredBy
                    )}
                </td>

               
<td>
    ${
        item.billData
            ? `<button
                   type="button"
                   class="edit-btn"
                   onclick="viewOtherBill('${item.id}')">
                   📎 View Bill
               </button>`
            : `<span>No Bill</span>`
    }

    <button
        type="button"
        class="edit-btn"
        onclick="editOtherEntry('${item.id}')">
        ✏ Edit
    </button>

    <button
        type="button"
        class="delete-btn"
        onclick="deleteOtherEntry('${item.id}')">
        🗑 Delete
    </button>
</td>

            `;


            tbody.appendChild(
                row
            );

        }
    );

}


displayOtherHistory();


// ========================================
// SAVE / UPDATE
// ========================================

otherEntryForm.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();


        if (!manager.apartmentId) {

            alert(
                "No apartment is assigned to this Manager."
            );

            return;

        }


        const type =
            entryType.value;


        const category =
            entryCategory.value.trim();


        const desc =
            description.value.trim();


        const entryAmount =
            Number(
                amount.value
            ) || 0;


        if (

            !type ||
            !category ||
            !desc ||
            entryAmount <= 0

        ) {

            alert(
                "Please enter Entry Type, Category, Description and a valid Amount."
            );

            return;

        }


        // ========================================
        // UPDATE
        // ========================================

        if (editingOtherId) {


            const existing =
                otherEntries.find(
                    function(item) {

                        return (

                            item.id ===
                            editingOtherId

                        );

                    }
                );


            if (!existing) {

                alert(
                    "Entry not found."
                );

                return;

            }


            existing.entryDate =
                entryDate.value;


            existing.entryType =
                type;


            existing.entryCategory =
                category;


            existing.description =
                desc;


            existing.amount =
                entryAmount;


            existing.paymentMode =
                paymentMode.value;


            existing.referenceNo =
                referenceNo.value.trim();


            existing.remarks =
                remarks.value.trim();

                
if (pendingOtherBill) {
    existing.billName = pendingOtherBill.billName;
    existing.billType = pendingOtherBill.billType;
    existing.billData = pendingOtherBill.billData;
}


            existing.modifiedDate =
                new Date()
                    .toISOString();


            existing.modifiedBy =
                manager.username;


            saveData(

                "prmOtherEntries",

                otherEntries

            );


            alert(
                "Other Entry updated successfully."
            );


            editingOtherId =
                null;

        }


        // ========================================
        // NEW ENTRY
        // ========================================

        else {


            const newEntry = {

                id:
                    createOtherId(),


                entryDate:
                    entryDate.value,


                apartmentId:
                    manager.apartmentId,


                apartmentName:

                    managerApartment

                        ? managerApartment.apartmentName

                        : manager.apartmentId,


                entryType:
                    type,


                entryCategory:
                    category,


                description:
                    desc,


                amount:
                    entryAmount,


                paymentMode:
                    paymentMode.value,


                referenceNo:
                    referenceNo.value.trim(),


                remarks:
                    remarks.value.trim(),

billName: pendingOtherBill ? pendingOtherBill.billName : "",
billType: pendingOtherBill ? pendingOtherBill.billType : "",
billData: pendingOtherBill ? pendingOtherBill.billData : "",


                enteredBy:
                    manager.username,


                createdDate:

                    new Date()
                        .toISOString()

            };


            otherEntries.push(
                newEntry
            );


            saveData(

                "prmOtherEntries",

                otherEntries

            );


            alert(

                "Other Entry saved successfully.\n\n" +

                "Entry ID: " +

                newEntry.id

            );

        }


        clearOtherForm();

        displayOtherHistory();

    }

);


// ========================================
// EDIT
// ========================================

function editOtherEntry(id) {


    const entry =
        otherEntries.find(
            function(item) {

                return (

                    item.id === id

                );

            }
        );


    if (!entry) {

        alert(
            "Entry not found."
        );

        return;

    }


    if (

        entry.apartmentId !==
        manager.apartmentId

    ) {

        alert(
            "You are not permitted to edit this entry."
        );

        return;

    }


    entryDate.value =
        entry.entryDate || "";


    entryType.value =
        entry.entryType || "";


    entryCategory.value =
        entry.entryCategory || "";


    amount.value =
        entry.amount || 0;


    description.value =
        entry.description || "";


    paymentMode.value =
        entry.paymentMode || "";


    referenceNo.value =
        entry.referenceNo || "";


    remarks.value =
        entry.remarks || "";


    editingOtherId =
        id;


    document.getElementById(
        "formTitle"
    ).textContent =

        "Edit Other Entry - " +
        id;


    document.getElementById(
        "saveOtherButton"
    ).textContent =

        "UPDATE ENTRY";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ========================================
// DELETE
// ========================================

function deleteOtherEntry(id) {


    const entry =
        otherEntries.find(
            function(item) {

                return (

                    item.id === id

                );

            }
        );


    if (!entry) {

        alert(
            "Entry not found."
        );

        return;

    }


    if (

        entry.apartmentId !==
        manager.apartmentId

    ) {

        alert(
            "You are not permitted to delete this entry."
        );

        return;

    }


    if (

        !confirm(

            "Are you sure you want to delete Entry " +
            id +
            "?"

        )

    ) {

        return;

    }


    otherEntries =
        otherEntries.filter(
            function(item) {

                return (

                    item.id !== id

                );

            }
        );


    saveData(

        "prmOtherEntries",

        otherEntries

    );


    if (
        editingOtherId === id
    ) {

        clearOtherForm();

    }


    alert(
        "Other Entry deleted successfully."
    );


    displayOtherHistory();

}


// ========================================
// CLEAR
// ========================================

function clearOtherForm() {

    otherEntryForm.reset();

pendingOtherBill = null;
otherBillUpload.value = "";

    entryDate.value =

        new Date()
            .toISOString()
            .split("T")[0];


    editingOtherId =
        null;


    document.getElementById(
        "formTitle"
    ).textContent =
        "Other Entry";


    document.getElementById(
        "saveOtherButton"
    ).textContent =
        "SAVE ENTRY";

}


// ========================================
// DOWNLOAD EXCEL
// ========================================

function downloadOtherExcel() {


    if (
        typeof XLSX === "undefined"
    ) {

        alert(
            "Excel library is not loaded."
        );

        return;

    }


    let records =
        getData(
            "prmOtherEntries"
        );


    records =
        records.filter(
            function(item) {

                return (

                    item.apartmentId ===
                    manager.apartmentId

                );

            }
        );


    const rows =
        records.map(
            function(item, index) {

                return {

                    "S.No":
                        index + 1,

                    "Entry ID":
                        item.id || "",

                    "Entry Date":
                        item.entryDate || "",

                    "Apartment ID":
                        item.apartmentId || "",

                    "Apartment Name":
                        item.apartmentName || "",

                    "Entry Type":
                        item.entryType || "",

                    "Category":
                        item.entryCategory || "",

                    "Description":
                        item.description || "",

                    "Amount":
                        Number(
                            item.amount || 0
                        ),

                    "Payment Mode":
                        item.paymentMode || "",

                    "Reference No":
                        item.referenceNo || "",

                    "Remarks":
                        item.remarks || "",

                    "Entered By":
                        item.enteredBy || "",

                    "Created Date":
                        item.createdDate || ""

                };

            }
        );


    const worksheet =
        XLSX.utils.json_to_sheet(
            rows
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Other Entries"

    );


    XLSX.writeFile(

        workbook,

        "PRM_Other_Entries_" +
        manager.apartmentId +
        ".xlsx"

    );

}


// ========================================
// UPLOAD EXCEL
// ========================================

function uploadOtherExcel(event) {


    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    if (
        typeof XLSX === "undefined"
    ) {

        alert(
            "Excel library is not loaded."
        );

        event.target.value =
            "";

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(e) {


            try {


                const workbook =
                    XLSX.read(

                        new Uint8Array(
                            e.target.result
                        ),

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
                        "The Excel file is empty."
                    );

                    return;

                }


                let imported = 0;


                rows.forEach(
                    function(row) {


                        const type =

                            String(

                                row[
                                    "Entry Type"
                                ] ||

                                row.entryType ||

                                ""

                            ).trim();


                        const category =

                            String(

                                row.Category ||

                                row.entryCategory ||

                                ""

                            ).trim();


                        const desc =

                            String(

                                row.Description ||

                                row.description ||

                                ""

                            ).trim();


                        const entryAmount =

                            Number(

                                row.Amount ||

                                row.amount ||

                                0

                            );


                        const rowApartment =

                            String(

                                row[
                                    "Apartment ID"
                                ] ||

                                row.apartmentId ||

                                manager.apartmentId

                            ).trim();


                        if (

                            !type ||

                            !category ||

                            !desc ||

                            entryAmount <= 0 ||

                            rowApartment !==
                            manager.apartmentId

                        ) {

                            return;

                        }


                        otherEntries.push({

                            id:

                                String(

                                    row[
                                        "Entry ID"
                                    ] ||

                                    row.id ||

                                    createOtherId()

                                ).trim(),


                            entryDate:

                                String(

                                    row[
                                        "Entry Date"
                                    ] ||

                                    row.entryDate ||

                                    new Date()
                                        .toISOString()
                                        .split("T")[0]

                                ).trim(),


                            apartmentId:
                                manager.apartmentId,


                            apartmentName:

                                managerApartment

                                    ? managerApartment.apartmentName

                                    : manager.apartmentId,


                            entryType:
                                type,


                            entryCategory:
                                category,


                            description:
                                desc,


                            amount:
                                entryAmount,


                            paymentMode:

                                String(

                                    row[
                                        "Payment Mode"
                                    ] ||

                                    row.paymentMode ||

                                    ""

                                ).trim(),


                            referenceNo:

                                String(

                                    row[
                                        "Reference No"
                                    ] ||

                                    row.referenceNo ||

                                    ""

                                ).trim(),


                            remarks:

                                String(

                                    row.Remarks ||

                                    row.remarks ||

                                    ""

                                ).trim(),


                            enteredBy:
                                manager.username,


                            createdDate:

                                new Date()
                                    .toISOString()

                        });


                        imported++;

                    }
                );


                saveData(

                    "prmOtherEntries",

                    otherEntries

                );


                alert(

                    imported +
                    " entry(s) imported successfully."

                );


                displayOtherHistory();

            }


            catch(error) {


                console.error(
                    error
                );


                alert(
                    "Unable to read the Excel file."
                );

            }


            finally {

                event.target.value =
                    "";

            }

        };


    reader.readAsArrayBuffer(
        file
    );

}


// ========================================
// BACK TO DASHBOARD
// ========================================

function goDashboard() {

    window.location.href =
        "manager-dashboard.html";

}


function viewOtherBill(id) {
    const records = getData("prmOtherEntries");

    const entry = records.find(function (item) {
        return String(item.id) === String(id);
    });

    if (!entry || !entry.billData) {
        alert("No document is attached to this entry.");
        return;
    }

    if (entry.apartmentId !== manager.apartmentId) {
        alert("You are not permitted to view this document.");
        return;
    }

    if (
        !["application/pdf", "image/jpeg", "image/png"]
            .includes(entry.billType)
    ) {
        alert("This file format is not supported.");
        return;
    }

    const billWindow = window.open("", "_blank");

    if (!billWindow) {
        alert("Please allow pop-ups to view the document.");
        return;
    }

    billWindow.document.title = entry.billName || "Supporting Document";

    const heading = billWindow.document.createElement("h3");
    heading.textContent = entry.billName || "Supporting Document";
    billWindow.document.body.appendChild(heading);

    if (entry.billType === "application/pdf") {
        const frame = billWindow.document.createElement("iframe");
        frame.src = entry.billData;
        frame.style.width = "100%";
        frame.style.height = "90vh";
        frame.style.border = "none";
        billWindow.document.body.appendChild(frame);
    } else {
        const image = billWindow.document.createElement("img");
        image.src = entry.billData;
        image.alt = entry.billName || "Supporting Document";
        image.style.maxWidth = "100%";
        image.style.height = "auto";
        billWindow.document.body.appendChild(image);
    }
}
