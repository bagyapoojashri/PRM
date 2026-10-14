document
    .getElementById("adminLoginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document.getElementById("adminUsername").value;

        const password =
            document.getElementById("adminPassword").value;

        const message =
            document.getElementById("loginMessage");


        /*
         TEMPORARY TEST LOGIN

         We will replace this with a secure
         database/backend later.
        */

        if (username === "PASQPRM" && password === "Abipooja#1428") {

            message.textContent = "Login successful.";

            message.style.color = "green";

            setTimeout(function() {

                window.location.href = "admin-dashboard.html";

            }, 500);

        } else {

            message.textContent =
                "Invalid admin username or password.";

            message.style.color = "red";

        }
    });