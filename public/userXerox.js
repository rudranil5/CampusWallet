let open_status = document.getElementById("status_indicator");
id="123";
window.onload = function ()
{
    id = JSON.parse(sessionStorage.getItem("object"));
     if (!id) {
    window.location.href = "login.html";
    return;
  }
  fetch("/Userdetails",{
    method:"POST",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify({id:id})
  })
  .then(res=>res.json())
  .then(data =>
  {
    console.log(data);
    firstname = data.firstname;
      lastname = data.lastname;
      phone_number = data.phone_number;
    document.getElementById("show_id").textContent = firstname +" " + lastname;
  }
  )
  fetch("/statusGet?service=xerox")
  .then(res=>res.json())
  .then(data=>{
    let status=data[0].status;
    if(status == 'open')
    {
      open_status.style.backgroundColor = "Green";
      open_status.textContent = "Open"
    }
    if(status == 'closed')
    {
      open_status.style.backgroundColor = "Red";
      open_status.textContent = "Closed"
    }
    else{console.log("xerox is : "+status);}
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
let whatsapp = document.getElementById("whatsapp_button");
whatsapp.addEventListener("click",senddoc);
function senddoc()
{
  let massage = document.getElementById("enter_meesage").value;
  console.log(massage)
  data = {
    id:id,
    massage:massage
  }
    fetch("/senddocuments",{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify(data)
    })
    .then(res=>res.json())
    .then(result=>
    {
      console.log(result.message)
    }
    )
}
