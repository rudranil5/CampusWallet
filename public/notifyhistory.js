const tableBody = document.querySelector("#studentTable tbody");

window.onload = function ()
{
    fetch("/notifyhistory")
    .then(res => res.json())
    .then(data =>
    {
        tableBody.innerHTML = "";

        data.forEach(item => {

            const formattedDate = new Date(item.return_date).toLocaleDateString("en-IN");
            const formattedsentDate = new Date(item.notification_sent_date).toLocaleDateString("en-IN");
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.roll_number}</td>
                <td>${item.name}</td>
                <td>${item.library_id}</td>
                <td>${item.book_name}</td>
                <td>${item.author_name}</td>
                <td>${item.fine}</td>
                <td>${formattedDate}</td>
                <td>${formattedsentDate}</td>
            `;

            tableBody.appendChild(row);
        });
    });
}