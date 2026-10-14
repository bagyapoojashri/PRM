let users = JSON.parse(
    localStorage.getItem("prmUsers")
) || [];
// ========================================
// EDIT USER MODE
// ========================================

let editingUserId = null;


// ========================================
// ADD / UPDATE USER
// ========================================

function addUser() {

    const managerName =
        document.getElementById("managerName").value.trim();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const apartment =
        document.getElementById("apartment").value.trim();

    const apartmentId =
        document.getElementById("apartmentId").value.trim();

    const status =
        document.getElementById("status").value;


    // ====================================
    // VALIDATION
    // ====================================

    if (
        managerName === "" ||
        username === "" ||
        password === "" ||
        apartment === "" ||
        apartmentId === ""
    ) {

        alert(
            "Please fill all required fields."
        );

        return;
    }


    // ====================================
    // UPDATE EXISTING USER
    // ====================================

    if (editingUserId) {

        const user =
            users.find(
                function(item) {
                    return item.id === editingUserId;
                }
            );


        if (!user) {

            alert(
                "User record not found."
            );

            return;
        }


        // Check whether username
        // belongs to another user
        const duplicate =
            users.find(
                function(item) {

                    return (
                        item.username
                            .toLowerCase()
                        ===
                        username.toLowerCase()

                        &&

                        item.id !==
                        editingUserId
                    );

                }
            );


        if (duplicate) {

            alert(
                "Username already exists."
            );

            return;
        }


        // Update ONLY selected user
        user.managerName =
            managerName;

        user.username =
            username;

        user.password =
            password;

        user.apartment =
            apartment;

        user.apartmentId =
            apartmentId;

        user.status =
            status;


        localStorage.setItem(
            "prmUsers",
            JSON.stringify(users)
        );


        alert(
            "Manager updated successfully."
        );


        editingUserId = null;

        clearForm();

        displayUsers();

        return;
    }


    // ====================================
    // NEW USER DUPLICATE CHECK
    // ====================================

    const existingUser =
        users.find(
            function(user) {

                return (
                    user.username
                        .toLowerCase()
                    ===
                    username.toLowerCase()
                );

            }
        );


    if (existingUser) {

        alert(
            "Username already exists."
        );

        return;
    }


    // ====================================
    // CREATE NEW USER
    // ====================================

    const newUser = {

        id:
            "U" +
            Date.now(),

        managerName:
            managerName,

        username:
            username,

        password:
            password,

        apartment:
            apartment,

        apartmentId:
            apartmentId,

        status:
            status

    };


    users.push(
        newUser
    );


    localStorage.setItem(
        "prmUsers",
        JSON.stringify(users)
    );


    alert(
        "Manager created successfully."
    );


    clearForm();

    displayUsers();

}

function displayUsers() {

    const table =
        document.getElementById("userTable");

    table.innerHTML = "";


    users.forEach(function(user) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${user.managerName}</td>

            <td>${user.username}</td>
            
            <td>${user.password}</td>

            <td>${user.apartment}</td>

            <td>${user.status}</td>

           <td>

    <button
        type="button"
        class="edit-btn"
        onclick="editUser('${user.id}')">

        ✏ Edit

    </button>


    <button
        type="button"
        class="delete-btn"
        onclick="deleteUser('${user.id}')">

        🗑 Delete

    </button>


    ${
        user.status === "ACTIVE"

        ?

        `<button
            type="button"
            class="deactivate"
            onclick="changeStatus(
                '${user.id}',
                'INACTIVE'
            )">

            Deactivate

        </button>`

        :

        `<button
            type="button"
            class="activate"
            onclick="changeStatus(
                '${user.id}',
                'ACTIVE'
            )">

            Activate

        </button>`
    }

</td>
        `;


        table.appendChild(row);

    });
}


function changeStatus(id, newStatus) {

    const user =
        users.find(
            user => user.id === id
        );


    if (!user) {

        return;

    }


    user.status = newStatus;


    localStorage.setItem(
        "prmUsers",
        JSON.stringify(users)
    );


    displayUsers();

}


function clearForm() {

    document.getElementById("managerName").value = "";

    document.getElementById("username").value = "";

    document.getElementById("password").value = "";

    document.getElementById("apartment").value = "";

    document.getElementById("apartmentId").value = "";

    document.getElementById("status").value = "ACTIVE";

}
// ========================================
// EDIT USER
// ========================================

function editUser(id) {

    const user =
        users.find(
            function(item) {
                return item.id === id;
            }
        );


    if (!user) {

        alert(
            "User record not found."
        );

        return;
    }


    editingUserId =
        user.id;


    document.getElementById(
        "managerName"
    ).value =
        user.managerName || "";


    document.getElementById(
        "username"
    ).value =
        user.username || "";


    document.getElementById(
        "password"
    ).value =
        user.password || "";


    document.getElementById(
        "apartment"
    ).value =
        user.apartment || "";


    document.getElementById(
        "apartmentId"
    ).value =
        user.apartmentId || "";


    document.getElementById(
        "status"
    ).value =
        user.status || "ACTIVE";


    // Change button text
    const saveButton =
        document.querySelector(
            'button[type="submit"]'
        );


    if (saveButton) {

        saveButton.textContent =
            "UPDATE MANAGER";

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
// ========================================
// DELETE USER
// ========================================

function deleteUser(id) {

    const user =
        users.find(
            function(item) {
                return item.id === id;
            }
        );


    if (!user) {

        alert(
            "User record not found."
        );

        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete Manager " +
            user.managerName +
            "?"
        );


    if (!confirmDelete) {
        return;
    }


    // Remove ONLY selected user
    const index =
        users.findIndex(
            function(item) {
                return item.id === id;
            }
        );


    if (index === -1) {
        return;
    }


    users.splice(
        index,
        1
    );


    localStorage.setItem(
        "prmUsers",
        JSON.stringify(users)
    );


    alert(
        "Manager deleted successfully."
    );


    displayUsers();

}

displayUsers();

// ========================================
// DOWNLOAD ALL MANAGERS
// ========================================

function downloadAllManagers() {

    const users =
        JSON.parse(
            localStorage.getItem("prmUsers")
        ) || [];


    if (users.length === 0) {

        alert("No Manager records available.");

        return;
    }


    const downloadData = users.map(function(user) {

        return {

            "Manager Name":
                user.managerName || "",

            "Username":
                user.username || "",

            "Password":
                user.password || "",

            "Apartment":
                user.apartment || "",

            "Apartment ID":
                user.apartmentId || "",

            "Status":
                user.status || ""

        };

    });


    const worksheet =
        XLSX.utils.json_to_sheet(
            downloadData
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Manager Access"
    );


    XLSX.writeFile(
        workbook,
        "PRM_Manager_Access_List.xlsx"
    );

}