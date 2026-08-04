const tableBody = document.querySelector("#studentTable tbody");

window.onload = function ()
{
    fetch("/printlisthistory")
    .then(res => res.json())
    .then(data =>
    {
        tableBody.innerHTML = "";
        data.forEach(item => {
            let color = "Green";
            let word = "Printed";
            const printing_status = item.printing_status;
            if(printing_status == "1")
            {
                color = "Red";
                word = "Not Printed Yet"
            }

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.roll_number}</td>
                <td>${item.firstname + " " + item.lastname}</td>
                <td>${item.phone_number}</td>
                <td style="background-color:${color}">${word}</td>
            `;

            tableBody.appendChild(row);
        });
    });
}