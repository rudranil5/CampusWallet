let time = 0;
window.onload = function ()
  {
    fetch("/statusGet?service=xerox")
    .then(res=>res.json())
    .then(data=>{
        if(data[0].xerox == 'open')
        {
              settime.style.backgroundColor= "Green";
              settime.innerText = "⏰ Open";
              time = 1;
        }
        else
        {
            settime.style.backgroundColor= "red"
            settime.innerText = "⏰ close";
        }
    }
       
    );
     id = JSON.parse(sessionStorage.getItem("object"));
     if (!id) {
    window.location.href = "login.html";
    return;
  }
  fetch("/Xeroxdetails",{
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
    fetch("/showprintlist")
  .then(res=>res.json())
  .then(data =>
  {
    if(data.length != 0)
    {
     document.getElementById("large_box").style.backgroundColor = "transparent";
      const tableBody = document.querySelector("#libraryTable tbody");
      console.log(data);
      tableBody.innerHTML = "";
            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.firstname+" "+item.lastname}</td>
                    <td>${item.phone_number}</td>
                    <td>${item.message}</td>
                    <td>
                        <button class="remove-btn"
                        onclick="printed('${item.id}', this)">
                        Print
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);
            }
        );
    }
  })
  
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
function printed(roll,btn)
{
    fetch("/printed",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({roll:roll})
    })
    .then(res=>res.json())
    .then(messege=>
    {
        console.log(messege);
        btn.textContent = "Printed";
        btn.disabled = true;
        btn.style.backgroundColor = "green";
    }
    )
}
const settime = document.getElementById("active_time");
settime.addEventListener("click",set);
let status_color = "red";
let status_word = "⏰ Closed"

function set()
{
    let Uid = JSON.parse(sessionStorage.getItem("object"));
    if (!Uid) {
    window.location.href = "login.html";}
    else{
    if(time == 0)
{
    time = 1;
    status_color = "green";
    status_word = "⏰ Open"
}
else if(time == 1)
{
    time = 0;
    status_color = "red";
    status_word = "⏰ Closed"
}
    fetch("/statusChange",{
        method:"PUT",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({service:'xerox',id:Uid})
    })
    .then(res=>res.json())
    .then(massage=>
        console.log(massage),
        settime.style.backgroundColor= status_color,
        settime.innerText= status_word,

    );
}
    
}

const getit = document.getElementById("print_list_history");
getit.addEventListener("click",getvalue);
function getvalue()
{
    window.location.href="printlist.html";
}
const remove_button = document.getElementById("remove");
remove_button.addEventListener("click",remove_func);
function remove_func()
{
    console.log("error");
    fetch("/removeprinted")
    .then(res=>res.json())
    .then(data=>
    {
      data.forEach(items=>
      {
        let rollToremove = items.roll_number;
        const rows = document.querySelectorAll("#libraryTable tbody tr");
        rows.forEach(row=>
        {
            rowcell = row.children[0].textContent.trim();
            if(rowcell == rollToremove)
            {
                row.style.transition = "0.3s";
                row.style.opacity = "0";
                row.style.transform = "translateX(80px)";

                setTimeout(() => {
                    row.remove();
                }, 300);
            }
        }
        )
        
      }
      )   
    }
    )
}