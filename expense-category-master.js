// ========================================
// PRM EXPENSE CATEGORY MASTER
// ========================================


// ========================================
// GET SAVED CATEGORIES
// ========================================

let expenseCategories =
    JSON.parse(
        localStorage.getItem(
            "prmExpenseCategories"
        )
    ) || [];


// ========================================
// SAVE CATEGORY
// ========================================

function saveCategory() {

    const categoryCode =
        document
            .getElementById(
                "categoryCode"
            )
            .value
            .trim()
            .toUpperCase();


    const categoryName =
        document
            .getElementById(
                "categoryName"
            )
            .value
            .trim();


    const description =
        document
            .getElementById(
                "description"
            )
            .value
            .trim();


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
        categoryCode === "" ||
        categoryName === ""
    ) {

        alert(
            "Please enter Category Code and Expense Category."
        );

        return;

    }


    // ====================================
    // CHECK DUPLICATE CODE
    // ====================================

    const duplicateCode =
        expenseCategories.find(
            function(category) {

                return (
                    category.categoryCode
                    ===
                    categoryCode
                );

            }
        );


    if (duplicateCode) {

        alert(
            "This Category Code already exists."
        );

        return;

    }


    // ====================================
    // CHECK DUPLICATE NAME
    // ====================================

    const duplicateName =
        expenseCategories.find(
            function(category) {

                return (

                    category.categoryName
                        .toLowerCase()
                    ===
                    categoryName
                        .toLowerCase()

                );

            }
        );


    if (duplicateName) {

        alert(
            "This Expense Category already exists."
        );

        return;

    }


    // ====================================
    // CREATE CATEGORY
    // ====================================

    const newCategory = {

        id:
            "EXP-" +
            Date.now(),

        categoryCode:
            categoryCode,

        categoryName:
            categoryName,

        description:
            description,

        status:
            status,

        createdDate:
            new Date()
                .toISOString()

    };


    // ====================================
    // SAVE
    // ====================================

    expenseCategories.push(
        newCategory
    );


    localStorage.setItem(

        "prmExpenseCategories",

        JSON.stringify(
            expenseCategories
        )

    );


    alert(
        "Expense category saved successfully."
    );


    clearForm();

    displayCategories();

}


// ========================================
// DISPLAY CATEGORIES
// ========================================

function displayCategories() {

    const table =
        document.getElementById(
            "categoryTable"
        );


    table.innerHTML = "";


    expenseCategories.forEach(
        function(category) {


            const actionButton =

                category.status
                ===
                "ACTIVE"

                ?

                `<button
                    class="deactivate-btn"
                    onclick="changeStatus(
                        '${category.id}',
                        'INACTIVE'
                    )">

                    Deactivate

                </button>`

                :

                `<button
                    class="activate-btn"
                    onclick="changeStatus(
                        '${category.id}',
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
                    ${category.categoryCode}
                </td>

                <td>
                    ${category.categoryName}
                </td>

                <td>
                    ${category.description || "-"}
                </td>

                <td>
                    ${category.status}
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

    const category =
        expenseCategories.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!category) {

        return;

    }


    category.status =
        newStatus;


    localStorage.setItem(

        "prmExpenseCategories",

        JSON.stringify(
            expenseCategories
        )

    );


    displayCategories();

}


// ========================================
// CLEAR FORM
// ========================================

function clearForm() {

    document
        .getElementById(
            "categoryCode"
        )
        .value = "";


    document
        .getElementById(
            "categoryName"
        )
        .value = "";


    document
        .getElementById(
            "description"
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

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayCategories();

    }
);