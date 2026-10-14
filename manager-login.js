// ======================================================
// PRM - MANAGER LOGIN
// Pathematic Residence Management
// ======================================================

// Get Users created by Admin
function getUsers() {
    const data = localStorage.getItem("prmUsers");

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading prmUsers:", error);
        return [];
    }
}


// Get Access Control records created by Admin
function getAccessRecords() {
    const data = localStorage.getItem("prmAccessControl");

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading prmAccessControl:", error);
        return [];
    }
}


// Convert different TRUE formats into real Boolean
function isAllowed(value) {

    if (
        value === true ||
        value === 1 ||
        value === "1" ||
        value === "true" ||
        value === "TRUE" ||
        value === "True"
    ) {
        return true;
    }

    return false;
}


// Record Manager activity
function logActivity(username, apartmentId, activity, description) {

    let activities = [];

    try {
        activities =
            JSON.parse(localStorage.getItem("prmActivityLog")) || [];
    } catch (error) {
        activities = [];
    }

    activities.push({
        id: "ACT-" + Date.now(),
        date: new Date().toISOString(),
        username: username,
        apartmentId: apartmentId || "",
        activity: activity,
        description: description
    });

    localStorage.setItem(
        "prmActivityLog",
        JSON.stringify(activities)
    );
}


// ======================================================
// MANAGER LOGIN
// ======================================================

document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();
        // Clear any previous Manager session
sessionStorage.removeItem("prmLoggedInUser");
sessionStorage.removeItem("prmLoginUser");
sessionStorage.removeItem("prmAvailableAccess");

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("message");

        message.textContent = "";


        // ------------------------------------------------
        // 1. Check Username & Password
        // ------------------------------------------------

        const users = getUsers();

        const user = users.find(function (item) {

            return (
                String(item.username || "").trim().toLowerCase()
                ===
                username.toLowerCase()
                &&
                String(item.password || "") === password
            );

        });


        if (!user) {

            message.textContent =
                "Invalid Manager ID or Password.";

            message.style.color = "red";

            return;
        }


        // ------------------------------------------------
        // 2. Check User Status
        // ------------------------------------------------

        if (
            String(user.status || "")
                .trim()
                .toUpperCase() !== "ACTIVE"
        ) {

            message.textContent =
                "This Manager ID is inactive. Please contact Admin.";

            message.style.color = "red";

            return;
        }


        // ------------------------------------------------
        // 3. Get Access Control
        // ------------------------------------------------

        const accessRecords = getAccessRecords();


        // Match Manager ID with Access Control
        const userAccess = accessRecords.filter(function (record) {

            return (
                String(record.username || "")
                    .trim()
                    .toLowerCase()
                ===
                username.toLowerCase()
                &&
                String(record.status || "")
                    .trim()
                    .toUpperCase()
                ===
                "ACTIVE"
            );

        });


        // ------------------------------------------------
        // 4. Check whether Admin has given access
        // ------------------------------------------------

        if (userAccess.length === 0) {

            message.textContent =
                "Access not assigned. Please contact Admin.";

            message.style.color = "red";

            console.log(
                "No ACTIVE access record found for:",
                username
            );

            console.log(
                "Available Access Records:",
                accessRecords
            );

            return;
        }


        // ------------------------------------------------
        // 5. Manager has access
        // ------------------------------------------------

        const access = userAccess[0];

        completeLogin(user, access);

    });


// ======================================================
// COMPLETE LOGIN
// ======================================================

function completeLogin(user, access) {

    const currentTime = new Date();


    const loginSession = {

        // Manager information
        username: user.username,

        // Apartment assigned by Admin
        apartmentId: access.apartmentId || "",


        // Permissions
        maintenanceAccess:
            isAllowed(access.maintenanceAccess),

        expenseAccess:
            isAllowed(access.expenseAccess),

        otherEntryAccess:
            isAllowed(access.otherEntryAccess),

        masterAccess:
            isAllowed(access.masterAccess),


        // Login information
        loginTime:
            currentTime.toISOString(),

        loginDisplayTime:
            currentTime.toLocaleString(
                "en-IN",
                {
                    dateStyle: "medium",
                    timeStyle: "short"
                }
            )
    };


    // Save current Manager session
    sessionStorage.setItem(
        "prmLoggedInUser",
        JSON.stringify(loginSession)
    );

    // Record activity for Admin
    logActivity(
        user.username,
        access.apartmentId || "",
        "LOGIN",
        "Manager logged into PRM"
    );


    // Go to Manager Dashboard
    window.location.href =
        "manager-dashboard.html";
}