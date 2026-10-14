// ========================================
// GET EXISTING APARTMENTS
// ========================================

let apartments =
    JSON.parse(
        localStorage.getItem("prmApartments")
    ) || [];

// ========================================
// EDIT MODE
// ========================================

let editingApartmentId = null;
// ========================================
// SAVE APARTMENT
// ========================================

function saveApartment() {

    const apartmentId =
        document
            .getElementById("apartmentId")
            .value
            .trim();

    const apartmentName =
        document
            .getElementById("apartmentName")
            .value
            .trim();

    const address =
        document
            .getElementById("address")
            .value
            .trim();

    const city =
        document
            .getElementById("city")
            .value
            .trim();

    const state =
        document
            .getElementById("state")
            .value
            .trim();

    const pincode =
        document
            .getElementById("pincode")
            .value
            .trim();

    const contactPerson =
        document
            .getElementById("contactPerson")
            .value
            .trim();

    const contactNumber =
        document
            .getElementById("contactNumber")
            .value
            .trim();

    const email =
        document
            .getElementById("email")
            .value
            .trim();

    const status =
        document
            .getElementById("status")
            .value;


    // ====================================
    // VALIDATION
    // ====================================

    if (
        apartmentId === "" ||
        apartmentName === "" ||
        city === ""
    ) {

        alert(
            "Please enter Apartment ID, Apartment Name and City."
        );

        return;

    }


    // ====================================
    // CHECK DUPLICATE ID
    // ====================================

    // ====================================
// UPDATE EXISTING APARTMENT
// ====================================

if (editingApartmentId) {

    const apartment =
        apartments.find(
            item =>
                item.id ===
                editingApartmentId
        );


    if (!apartment) {

        alert(
            "Apartment record not found."
        );

        return;

    }


    apartment.apartmentId =
        apartmentId;

    apartment.apartmentName =
        apartmentName;

    apartment.address =
        address;

    apartment.city =
        city;

    apartment.state =
        state;

    apartment.pincode =
        pincode;

    apartment.contactPerson =
        contactPerson;

    apartment.contactNumber =
        contactNumber;

    apartment.email =
        email;

    apartment.status =
        status;


    localStorage.setItem(
        "prmApartments",
        JSON.stringify(apartments)
    );


    alert(
        "Apartment updated successfully."
    );


    editingApartmentId = null;

    clearForm();

    displayApartments();

    return;
}


// ====================================
// CHECK DUPLICATE ID FOR NEW RECORD
// ====================================

const duplicate =
    apartments.find(
        apartment =>
            apartment.apartmentId
                .toLowerCase()
            ===
            apartmentId.toLowerCase()
    );


if (duplicate) {

    alert(
        "Apartment ID already exists."
    );

    return;

}


    // ====================================
    // CREATE APARTMENT
    // ====================================

    const newApartment = {

        id:
            "APT-" +
            Date.now(),

        apartmentId:
            apartmentId,

        apartmentName:
            apartmentName,

        address:
            address,

        city:
            city,

        state:
            state,

        pincode:
            pincode,

        contactPerson:
            contactPerson,

        contactNumber:
            contactNumber,

        email:
            email,

        status:
            status,

        createdDate:
            new Date()
                .toISOString()

    };


    // ====================================
    // ADD TO ARRAY
    // ====================================

    apartments.push(
        newApartment
    );


    // ====================================
    // SAVE TO BROWSER
    // ====================================

    localStorage.setItem(

        "prmApartments",

        JSON.stringify(
            apartments
        )

    );


    alert(
        "Apartment saved successfully."
    );


    clearForm();

    displayApartments();

}





   // ========================================
// DISPLAY APARTMENTS
// ========================================


             // ========================================
// DISPLAY APARTMENTS
// ========================================

function displayApartments() {

    const table =
        document.getElementById(
            "apartmentTable"
        );


    if (!table) {

        console.error(
            "apartmentTable not found."
        );

        return;

    }


    table.innerHTML = "";


    apartments.forEach(
        function(apartment) {

            const row =
                document.createElement(
                    "tr"
                );


            let statusButton = "";


            if (
                apartment.status ===
                "ACTIVE"
            ) {

                statusButton = `

                    <button
                        type="button"
                        class="deactivate-btn"
                        onclick="changeStatus(
                            '${apartment.id}',
                            'INACTIVE'
                        )">

                        Deactivate

                    </button>

                `;

            }

            else {

                statusButton = `

                    <button
                        type="button"
                        class="activate-btn"
                        onclick="changeStatus(
                            '${apartment.id}',
                            'ACTIVE'
                        )">

                        Activate

                    </button>

                `;

            }


            row.innerHTML = `

                <td>
                    ${apartment.apartmentId || "-"}
                </td>

                <td>
                    ${apartment.apartmentName || "-"}
                </td>

                <td>
                    ${apartment.city || "-"}
                </td>

                <td>
                    ${apartment.contactNumber || "-"}
                </td>

                <td>
                    ${apartment.status || "-"}
                </td>

                <td>

                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editApartment(
                            '${apartment.id}'
                        )">

                        ✏ Edit

                    </button>


                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deleteApartment(
                            '${apartment.id}'
                        )">

                        🗑 Delete

                    </button>


                    ${statusButton}

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );

}
// ========================================
// EDIT APARTMENT
// ========================================

function editApartment(id) {

    const apartment =
        apartments.find(
            item =>
                item.id === id
        );


    if (!apartment) {

        alert(
            "Apartment record not found."
        );

        return;

    }


    editingApartmentId =
        apartment.id;


    document.getElementById(
        "apartmentId"
    ).value =
        apartment.apartmentId || "";


    document.getElementById(
        "apartmentName"
    ).value =
        apartment.apartmentName || "";


    document.getElementById(
        "address"
    ).value =
        apartment.address || "";


    document.getElementById(
        "city"
    ).value =
        apartment.city || "";


    document.getElementById(
        "state"
    ).value =
        apartment.state || "Tamil Nadu";


    document.getElementById(
        "pincode"
    ).value =
        apartment.pincode || "";


    document.getElementById(
        "contactPerson"
    ).value =
        apartment.contactPerson || "";


    document.getElementById(
        "contactNumber"
    ).value =
        apartment.contactNumber || "";


    document.getElementById(
        "email"
    ).value =
        apartment.email || "";


    document.getElementById(
        "status"
    ).value =
        apartment.status || "ACTIVE";


    const saveButton =
        document.querySelector(
            'button[type="submit"]'
        );


    if (saveButton) {

        saveButton.textContent =
            "UPDATE APARTMENT";

    }


 
   window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}
// ========================================
// DELETE APARTMENT
// ========================================

function deleteApartment(id) {

    const apartment =
        apartments.find(
            item =>
                item.id === id
        );


    if (!apartment) {

        alert(
            "Apartment record not found."
        );

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete Apartment " +
            apartment.apartmentId +
            " - " +
            apartment.apartmentName +
            "?"
        );


    if (!confirmDelete) {

        return;

    }


    apartments =
        apartments.filter(
            item =>
                item.id !== id
        );


    localStorage.setItem(
        "prmApartments",
        JSON.stringify(apartments)
    );


    alert(
        "Apartment deleted successfully."
    );


    displayApartments();

}
// ========================================
// CHANGE STATUS
// ========================================

function changeStatus(
    id,
    newStatus
) {

    const apartment =
        apartments.find(
            apartment =>
                apartment.id === id
        );


    if (!apartment) {

        return;

    }


    apartment.status =
        newStatus;


    localStorage.setItem(

        "prmApartments",

        JSON.stringify(
            apartments
        )

    );


    displayApartments();

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
            "apartmentName"
        )
        .value = "";

    document
        .getElementById(
            "address"
        )
        .value = "";

    document
        .getElementById(
            "city"
        )
        .value = "";

    document
        .getElementById(
            "state"
        )
        .value = "Tamil Nadu";

    document
        .getElementById(
            "pincode"
        )
        .value = "";

    document
        .getElementById(
            "contactPerson"
        )
        .value = "";

    document
        .getElementById(
            "contactNumber"
        )
        .value = "";

    document
        .getElementById(
            "email"
        )
        .value = "";

    document
        .getElementById(
            "status"
        )
        .value = "ACTIVE";

}


// ========================================
// LOAD DATA WHEN PAGE OPENS
// ========================================

displayApartments();