// ========================================
// PRM EXPENSE ENTRY
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

let expenseEntries =
    getData(
        "prmExpenseEntries"
    );


const apartments =
    getData(
        "prmApartments"
    );


let editingExpenseId =
    null;

    
let pendingExpenseBill = null;

const billUpload = document.getElementById("billUpload");

billUpload.addEventListener("change", function () {
    const file = billUpload.files[0];
    pendingExpenseBill = null;

    if (!file) return;

    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF, JPG, JPEG or PNG file.");
        billUpload.value = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert("Bill size must not exceed 2 MB.");
        billUpload.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        pendingExpenseBill = {
            billName: file.name,
            billType: file.type,
            billData: e.target.result
        };

        alert("Bill uploaded successfully. Save the expense to attach it.");
    };

    reader.onerror = function () {
        pendingExpenseBill = null;
        billUpload.value = "";
        alert("Unable to read the bill. Please try again.");
    };

    reader.readAsDataURL(file);
});


// ========================================
// ELEMENTS
// ========================================

const expenseForm =
    document.getElementById(
        "expenseForm"
    );


const entryDate =
    document.getElementById(
        "entryDate"
    );


const expenseCategory =
    document.getElementById(
        "expenseCategory"
    );


const description =
    document.getElementById(
        "description"
    );


const amount =
    document.getElementById(
        "amount"
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
// LOAD EXPENSE CATEGORIES
// ========================================

function loadExpenseCategories() {

    const categories =
        getData(
            "prmExpenseCategories"
        );


    expenseCategory.innerHTML =

        '<option value="">Select Category</option>';


    categories.forEach(
        function(category) {


            if (

                String(
                    category.status ||
                    "ACTIVE"
                ).toUpperCase()
                !==
                "ACTIVE"

            ) {

                return;

            }


            const name =

                category.categoryName ||
                category.expenseCategory ||
                category.name ||
                category.category ||
                "";


            if (!name) {

                return;

            }


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                name;


            option.textContent =
                name;


            expenseCategory.appendChild(
                option
            );

        }
    );

}


loadExpenseCategories();


// ========================================
// CREATE EXPENSE ID
// ========================================

function createExpenseId() {

    return (

        "EXP-" +

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
// DISPLAY EXPENSE HISTORY
// ========================================

function displayExpenseHistory() {

    const tbody =
        document.getElementById(
            "expenseHistoryBody"
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
            "prmExpenseEntries"
        );


    // Only assigned apartment

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
                        item.expenseCategory,
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
                    ${escapeHTML(item.entryDate)}
                </td>

                <td>
                    ${escapeHTML(item.expenseCategory)}
                </td>

                <td>
                    ${escapeHTML(item.description)}
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

                    
<td>
    ${
        item.billData
            ? `<button
                   type="button"
                   class="edit-btn"
                   onclick="viewExpenseBill('${item.id}')">
                   📎 View Bill
               </button>`
            : `<span>No Bill</span>`
    }

    <button
        type="button"
        class="edit-btn"
        onclick="editExpense('${item.id}')">
        ✏ Edit
    </button>

    <button
        type="button"
        class="delete-btn"
        onclick="deleteExpense('${item.id}')">
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


displayExpenseHistory();


// ========================================
// SAVE / UPDATE
// ========================================

expenseForm.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();


        if (!manager.apartmentId) {

            alert(
                "No apartment is assigned to this Manager."
            );

            return;

        }


        const category =
            expenseCategory.value.trim();


        const desc =
            description.value.trim();


        const expenseAmount =
            Number(
                amount.value
            ) || 0;


        if (

            !category ||
            !desc ||
            expenseAmount <= 0

        ) {

            alert(
                "Please enter Category, Description and a valid Amount."
            );

            return;

        }


        // ========================================
        // UPDATE
        // ========================================

        if (editingExpenseId) {


            const existing =
                expenseEntries.find(
                    function(item) {

                        return (
                            item.id ===
                            editingExpenseId
                        );

                    }
                );


            if (!existing) {

                alert(
                    "Expense record not found."
                );

                return;

            }


            existing.entryDate =
                entryDate.value;


            existing.expenseCategory =
                category;


            existing.description =
                desc;


            existing.amount =
                expenseAmount;


            existing.paymentMode =
                paymentMode.value;


            existing.referenceNo =
                referenceNo.value.trim();


            existing.remarks =
                remarks.value.trim();


if (pendingExpenseBill) {
    existing.billName = pendingExpenseBill.billName;
    existing.billType = pendingExpenseBill.billType;
    existing.billData = pendingExpenseBill.billData;
}

            existing.modifiedDate =
                new Date()
                    .toISOString();


            existing.modifiedBy =
                manager.username;


            saveData(

                "prmExpenseEntries",

                expenseEntries

            );


            alert(
                "Expense updated successfully."
            );


            editingExpenseId =
                null;

        }


        // ========================================
        // NEW ENTRY
        // ========================================

        else {


            const entry = {

                id:
                    createExpenseId(),


                entryDate:
                    entryDate.value,


                apartmentId:
                    manager.apartmentId,


                apartmentName:

                    managerApartment
                        ? managerApartment.apartmentName
                        : manager.apartmentId,


                expenseCategory:
                    category,


                description:
                    desc,


                amount:
                    expenseAmount,


                paymentMode:
                    paymentMode.value,


                referenceNo:
                    referenceNo.value.trim(),


                remarks:
                    remarks.value.trim(),


billName: pendingExpenseBill ? pendingExpenseBill.billName : "",
billType: pendingExpenseBill ? pendingExpenseBill.billType : "",
billData: pendingExpenseBill ? pendingExpenseBill.billData : "",

                enteredBy:
                    manager.username,


                createdDate:
                    new Date()
                        .toISOString()

            };


            expenseEntries.push(
                entry
            );


            saveData(

                "prmExpenseEntries",

                expenseEntries

            );


            alert(

                "Expense saved successfully.\n\n" +

                "Expense ID: " +

                entry.id

            );

        }


        clearExpenseForm();

        displayExpenseHistory();

    }

);


// ========================================
// EDIT
// ========================================

function editExpense(id) {


    const entry =
        expenseEntries.find(
            function(item) {

                return (
                    item.id === id
                );

            }
        );


    if (!entry) {

        alert(
            "Expense record not found."
        );

        return;

    }


    if (

        entry.apartmentId !==
        manager.apartmentId

    ) {

        alert(
            "You are not permitted to edit this expense."
        );

        return;

    }


    entryDate.value =
        entry.entryDate || "";


    expenseCategory.value =
        entry.expenseCategory || "";


    description.value =
        entry.description || "";


    amount.value =
        entry.amount || 0;


    paymentMode.value =
        entry.paymentMode || "";


    referenceNo.value =
        entry.referenceNo || "";


    remarks.value =
        entry.remarks || "";


    editingExpenseId =
        id;


    document.getElementById(
        "formTitle"
    ).textContent =

        "Edit Expense - " + id;


    document.getElementById(
        "saveExpenseButton"
    ).textContent =

        "UPDATE EXPENSE";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ========================================
// DELETE
// ========================================

function deleteExpense(id) {


    const entry =
        expenseEntries.find(
            function(item) {

                return (
                    item.id === id
                );

            }
        );


    if (!entry) {

        alert(
            "Expense record not found."
        );

        return;

    }


    if (

        entry.apartmentId !==
        manager.apartmentId

    ) {

        alert(
            "You are not permitted to delete this expense."
        );

        return;

    }


    if (

        !confirm(
            "Are you sure you want to delete Expense " +
            id +
            "?"
        )

    ) {

        return;

    }


    expenseEntries =
        expenseEntries.filter(
            function(item) {

                return (
                    item.id !== id
                );

            }
        );


    saveData(

        "prmExpenseEntries",

        expenseEntries

    );


    if (
        editingExpenseId === id
    ) {

        clearExpenseForm();

    }


    alert(
        "Expense deleted successfully."
    );


    displayExpenseHistory();

}


// ========================================
// CLEAR
// ========================================

function clearExpenseForm() {

    expenseForm.reset();

pendingExpenseBill = null;
billUpload.value = "";
    entryDate.value =

        new Date()
            .toISOString()
            .split("T")[0];


    editingExpenseId =
        null;


    document.getElementById(
        "formTitle"
    ).textContent =
        "Expense Entry";


    document.getElementById(
        "saveExpenseButton"
    ).textContent =
        "SAVE EXPENSE";

}


// ========================================
// DOWNLOAD EXCEL
// ========================================

function downloadExpenseExcel() {


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
            "prmExpenseEntries"
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

                    "Expense ID":
                        item.id || "",

                    "Expense Date":
                        item.entryDate || "",

                    "Apartment ID":
                        item.apartmentId || "",

                    "Apartment Name":
                        item.apartmentName || "",

                    "Expense Category":
                        item.expenseCategory || "",

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

        "Expenses"

    );


    XLSX.writeFile(

        workbook,

        "PRM_Expense_Entries_" +
        manager.apartmentId +
        ".xlsx"

    );

}


// ========================================
// UPLOAD EXCEL
// ========================================

function uploadExpenseExcel(event) {


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

        event.target.value = "";

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


                let imported = 0;


                rows.forEach(
                    function(row) {


                        const category =

                            String(

                                row[
                                    "Expense Category"
                                ] ||

                                row.expenseCategory ||

                                row.Category ||

                                ""

                            ).trim();


                        const desc =

                            String(

                                row.Description ||

                                row.description ||

                                ""

                            ).trim();


                        const amountValue =

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

                            !category ||

                            !desc ||

                            amountValue <= 0 ||

                            rowApartment !==
                            manager.apartmentId

                        ) {

                            return;

                        }


                        expenseEntries.push({

                            id:

                                String(

                                    row[
                                        "Expense ID"
                                    ] ||

                                    row.id ||

                                    createExpenseId()

                                ).trim(),


                            entryDate:

                                String(

                                    row[
                                        "Expense Date"
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


                            expenseCategory:
                                category,


                            description:
                                desc,


                            amount:
                                amountValue,


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

                    "prmExpenseEntries",

                    expenseEntries

                );


                alert(

                    imported +
                    " expense(s) imported successfully."

                );


                displayExpenseHistory();


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
// DASHBOARD
// ========================================

function goDashboard() {

    window.location.href =
        "manager-dashboard.html";

}


function viewExpenseBill(id) {
    const records = getData("prmExpenseEntries");

    const entry = records.find(function (item) {
        return String(item.id) === String(id);
    });

    if (!entry || !entry.billData) {
        alert("No bill is attached to this expense.");
        return;
    }

    if (entry.apartmentId !== manager.apartmentId) {
        alert("You are not permitted to view this bill.");
        return;
    }

    if (
        !["application/pdf", "image/jpeg", "image/png"]
            .includes(entry.billType)
    ) {
        alert("This bill format is not supported.");
        return;
    }

    const billWindow = window.open("", "_blank");

    if (!billWindow) {
        alert("Please allow pop-ups to view the bill.");
        return;
    }

    billWindow.document.title = entry.billName || "Expense Bill";

    const heading = billWindow.document.createElement("h3");
    heading.textContent = entry.billName || "Expense Bill";
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
        image.alt = entry.billName || "Expense Bill";
        image.style.maxWidth = "100%";
        image.style.height = "auto";
        billWindow.document.body.appendChild(image);
    }
}
