// ========================================
// PRM USER ACTIVITY
// ========================================


// Get activity records
let activities =
    JSON.parse(
        localStorage.getItem(
            "prmActivityLog"
        )
    ) || [];


// ========================================
// LOAD MANAGERS
// ========================================

function loadManagers() {

    const users =
        JSON.parse(
            localStorage.getItem(
                "prmUsers"
            )
        ) || [];


    const dropdown =
        document.getElementById(
            "managerFilter"
        );


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
// DISPLAY ACTIVITY
// ========================================

function displayActivity(
    data = activities
) {

    const table =
        document.getElementById(
            "activityTable"
        );


    table.innerHTML = "";


    if (data.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="5">

                    No activity recorded yet.

                </td>

            </tr>

        `;

        return;

    }


    // Latest activity first

    const sortedData =
        [...data].reverse();


    sortedData.forEach(
        function(activity) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${formatDate(
                        activity.date
                    )}
                </td>

                <td>
                    ${activity.username || "-"}
                </td>

                <td>
                    ${activity.apartmentId || "-"}
                </td>

                <td>
                    ${activity.activity || "-"}
                </td>

                <td>
                    ${activity.description || "-"}
                </td>

            `;


            table.appendChild(
                row
            );

        }
    );

}


// ========================================
// FILTER ACTIVITY
// ========================================

function filterActivity() {

    const manager =
        document
            .getElementById(
                "managerFilter"
            )
            .value;


    const activity =
        document
            .getElementById(
                "activityFilter"
            )
            .value;


    const filtered =
        activities.filter(
            function(item) {

                const managerMatch =

                    manager === "ALL"
                    ||
                    item.username
                    ===
                    manager;


                const activityMatch =

                    activity === "ALL"
                    ||
                    item.activity
                    ===
                    activity;


                return (
                    managerMatch &&
                    activityMatch
                );

            }
        );


    displayActivity(
        filtered
    );

}


// ========================================
// CLEAR FILTER
// ========================================

function clearFilter() {

    document
        .getElementById(
            "managerFilter"
        )
        .value = "ALL";


    document
        .getElementById(
            "activityFilter"
        )
        .value = "ALL";


    displayActivity();

}


// ========================================
// DATE FORMAT
// ========================================

function formatDate(date) {

    if (!date) {

        return "-";

    }


    const d =
        new Date(date);


    return d.toLocaleString(
        "en-IN"
    );

}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadManagers();

        displayActivity();

    }
);