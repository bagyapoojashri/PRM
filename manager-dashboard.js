// ========================================
// PRM MANAGER DASHBOARD
// ========================================

// ========================================
// LOGOUT
// ========================================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function () {

        sessionStorage.removeItem("prmLoggedInUser");
        sessionStorage.removeItem("prmLoginUser");
        sessionStorage.removeItem("prmAvailableAccess");

        window.location.href = "login.html";
    });
}
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
// GET LOCAL STORAGE DATA
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
// DISPLAY MANAGER ID
// ========================================

document.getElementById(
    "managerId"
).textContent =

    manager.username || "-";


// ========================================
// DISPLAY APARTMENT MANAGEMENT ID
// ========================================

document.getElementById(
    "apartmentManagementId"
).textContent =

    manager.apartmentId || "-";


// ========================================
// FIND APARTMENT
// ========================================

const apartments =
    getData(
        "prmApartments"
    );


const apartment =
    apartments.find(
        function(item) {

            return (

                item.apartmentId ===
                manager.apartmentId

            );

        }
    );


// ========================================
// DISPLAY APARTMENT NAME
// ========================================

document.getElementById(
    "apartmentName"
).textContent =

    apartment
        ? apartment.apartmentName
        : manager.apartmentId || "-";


// ========================================
// WELCOME
// ========================================

document.getElementById(
    "welcomeMessage"
).textContent =

    "Welcome, " +
    (manager.username || "Manager");


// ========================================
// LOGIN TIME
// ========================================

if (manager.loginTime) {

    const loginDate =
        new Date(
            manager.loginTime
        );


    document.getElementById(
        "loginTime"
    ).textContent =

        loginDate.toLocaleString();

}


// ========================================
// ACCESS VALUES
// ========================================

const maintenanceAccess =
    manager.maintenanceAccess === true;


const expenseAccess =
    manager.expenseAccess === true;


const otherEntryAccess =
    manager.otherEntryAccess === true;


const masterAccess =
    manager.masterAccess === true;


// ========================================
// SHOW / HIDE MODULES
// ========================================

if (!maintenanceAccess) {

    document.getElementById(
        "maintenanceCard"
    ).style.display =
        "none";

}


if (!expenseAccess) {

    document.getElementById(
        "expenseCard"
    ).style.display =
        "none";

}


if (!otherEntryAccess) {

    document.getElementById(
        "dailyCard"
    ).style.display =
        "none";

}


if (!masterAccess) {

    document.getElementById(
        "masterCard"
    ).style.display =
        "none";

}


// ========================================
// ACCESS STATUS
// ========================================

document.getElementById(
    "maintenanceAccessStatus"
).innerHTML =

    "🧾 Maintenance: " +

    (
        maintenanceAccess
            ? "<strong>ALLOWED</strong>"
            : "<strong>DENIED</strong>"
    );


document.getElementById(
    "expenseAccessStatus"
).innerHTML =

    "💰 Expense: " +

    (
        expenseAccess
            ? "<strong>ALLOWED</strong>"
            : "<strong>DENIED</strong>"
    );


document.getElementById(
    "otherAccessStatus"
).innerHTML =

    "📋 Other Entry: " +

    (
        otherEntryAccess
            ? "<strong>ALLOWED</strong>"
            : "<strong>DENIED</strong>"
    );


document.getElementById(
    "masterAccessStatus"
).innerHTML =

    "🏠 Master: " +

    (
        masterAccess
            ? "<strong>ALLOWED</strong>"
            : "<strong>DENIED</strong>"
    );


// ========================================
// NAVIGATION
// ========================================

function openMaintenance() {

    window.location.href =
        "maintenance-receipt.html";

}


function openExpense() {

    window.location.href =
        "expense-entry.html";

}


function openOtherEntry() {
    window.location.href = "other-entry.html";
}




function openMaster() {

    window.location.href =
        "manager-master-amendment.html";

}


function openActivity() {

    window.location.href =
        "user-activity.html";

}


// ========================================
// LOG ACTIVITY
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
            manager.apartmentId || "",

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


// ======================================================
// LOGOUT
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    const logoutButton =
        document.getElementById("logoutButton");

    if (!logoutButton) {

        console.error(
            "Logout button not found."
        );

        return;
    }


    logoutButton.addEventListener(
        "click",
        function () {

            // Remove Manager session
            sessionStorage.removeItem(
                "prmLoggedInUser"
            );


            // Remove temporary login data
            sessionStorage.removeItem(
                "prmLoginUser"
            );


            sessionStorage.removeItem(
                "prmAvailableAccess"
            );


            // Return to Manager Login
            window.location.href =
                "login.html";

        }
    );

});