// ========================================
// PRM COMMON EXCEL FUNCTIONS
// ========================================


// ========================================
// DOWNLOAD EXCEL
// ========================================

function downloadPRMExcel(
    storageKey,
    fileName,
    sheetName
) {

    const data =
        JSON.parse(
            localStorage.getItem(storageKey)
        ) || [];

    if (data.length === 0) {

        alert(
            "No data available to download."
        );

        return;
    }


    const worksheet =
        XLSX.utils.json_to_sheet(data);


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        sheetName
    );


    XLSX.writeFile(
        workbook,
        fileName
    );

}


// ========================================
// UPLOAD EXCEL
// ========================================

function uploadPRMExcel(
    event,
    storageKey
) {

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


                const firstSheet =
                    workbook.Sheets[
                        workbook.SheetNames[0]
                    ];


                const rows =
                    XLSX.utils.sheet_to_json(
                        firstSheet,
                        {
                            defval: ""
                        }
                    );


                if (rows.length === 0) {

                    alert(
                        "Excel file is empty."
                    );

                    return;

                }


                const existing =
                    JSON.parse(
                        localStorage.getItem(
                            storageKey
                        )
                    ) || [];


                rows.forEach(
                    function(row) {

                        existing.push(row);

                    }
                );


                localStorage.setItem(
                    storageKey,
                    JSON.stringify(
                        existing
                    )
                );


                alert(
                    rows.length +
                    " records uploaded successfully."
                );


                location.reload();

            }

            catch(error) {

                console.error(
                    error
                );

                alert(
                    "Unable to read Excel file."
                );

            }

        };


    reader.readAsArrayBuffer(
        file
    );

}