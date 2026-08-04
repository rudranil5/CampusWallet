let id = "123";
let firstname = " ";
let lastname = " ";
let phone_number = " ";
window.onload = function ()
{
     id = JSON.parse(sessionStorage.getItem("object"));
     if (!id) {
    window.location.href = "login.html";
    return;
  }
  fetch("/Librariandetails",{
    method:"POST",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify({id:id})
  })
  .then(res=>res.json())
  .then(data =>
  {
    console.log(data);
    let new_id = data.firstname +" " + data.lastname+" " + id;
    sessionStorage.setItem("object_notify",JSON.stringify(new_id));
    document.getElementById("show_id").textContent = data.firstname +" " + data.lastname;
       firstname = data.firstname;
       lastname = data.lastname;
       phone_number = data.phone_number;

  }
  )
  fetch("/showstudentlist")
  .then(res=>res.json())
  .then(data =>
  {
      console.log(data);
      tableBody.innerHTML = "";
            data.result.forEach(item => {
                const formattedDate = new Date(item.return_date).toLocaleDateString("en-IN");

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.roll_number}</td>
                    <td>${item.name}</td>
                    <td>${item.book_name}</td>
                    <td>${item.author_name}</td>
                    <td>${item.fine}</td>
                    <td>${formattedDate}</td>
                    <td>
                        <button class="remove-btn"
                        onclick="fine_submitted('${item.roll_number}', this)">
                        Fine Pending
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);
            }
        );

  }
  )
}
const openBtn = document.getElementById("openPanelBtn");
const closeBtn = document.getElementById("closePanelBtn");
const panel = document.getElementById("slidePanel");

openBtn.addEventListener("click", () => {
    panel.classList.add("active");
    document.getElementById("Name").innerHTML = "<span>Name : </span>" + firstname + " " + lastname;
   document.getElementById("unique_id").innerHTML = "<span>ID : </span>" + id;
   document.getElementById("Ph_number").innerHTML = "<span>Phone Number : </span>" + phone_number;
});

closeBtn.addEventListener("click", () => {
    panel.classList.remove("active");
});
const updateBtn = document.getElementById("update_list");
const tableBody = document.querySelector("#libraryTable tbody");

updateBtn.addEventListener("click", remove);

function remove()
{
    fetch("/removelist",)
        .then(res => res.json())
        .then(data => {

            data.forEach(item => {
                const rollToRemove = item.roll_number;
                const rows = document.querySelectorAll("#libraryTable tbody tr");

                rows.forEach(row => 
                {

                    const rollCell = row.children[0].textContent.trim(); // first column = roll number

                    if (rollCell === rollToRemove)
                    {
                        // animation
                        row.style.transition = "0.3s";
                        row.style.opacity = "0";
                        row.style.transform = "translateX(80px)";

                        setTimeout(() => {
                            row.remove();
                        }, 300);
                    }
                });
            }
        );
    });
    }


function fine_submitted(roll,btn)
{
    
      fetch("/finesubmitted",{
    method:"POST",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify({roll:roll})
  })
  .then(res=>res.json())
  .then(massage =>
  {
    btn.textContent = "Fine Submitted";
    btn.disabled = true;
    btn.style.backgroundColor = "green";
  }
  )

}
