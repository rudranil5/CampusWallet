const tableBody = document.querySelector("#studentTable tbody");
let id = "123";
window.onload = function ()
{
    id = JSON.parse(sessionStorage.getItem("object"));
    if (!id) {
    window.location.href = "login.html";
    return;
    }
    let Sender = "Xerox";
    fetch("/Xeroxtransactionhistory",
        {
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({Sender:Sender})
        }
    )
    .then(res => res.json())
    .then(data =>
    {
        tableBody.innerHTML = "";
        data.forEach(item => 
            {
            const row = document.createElement("tr");
            let date = new Date(item.paymentTimestamp);
            const formatted = date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, '0') + "-" +
            String(date.getDate()).padStart(2, '0') + "  (" +
            String(date.getHours()).padStart(2, '0') + ":" +
            String(date.getMinutes()).padStart(2, '0') + ":" +
            String(date.getSeconds()).padStart(2, '0')+")";

            console.log(formatted);
            row.innerHTML = `
                <td>${item.Amount}</td>
                <td>${formatted}</td>
                <td>${item.firstname +" "+ item.lastname}</td>
                <td>${item.Mode}</td>
            `;

            tableBody.appendChild(row);
        });
    });
}