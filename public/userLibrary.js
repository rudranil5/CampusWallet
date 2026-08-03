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
const set_reminder = document.getElementById("set_reminder");
set_reminder.addEventListener("click",set_time_reminder);
function set_time_reminder()
{
    let book_name = document.getElementById("book_name").value;
    let expected_date = document.getElementById("expected_return_date").value;
    data = {
        id:id,
        book_name:book_name,
        expected_date:expected_date
    };
    fetch("/setreminder",
        {
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(data)
        }
    ).then(res=>res.json())
    .then(data=>
    {
        console.log(data.massage);
    }
    )
}
function generateQR() {
    let amount = document.getElementById("amount").value;

    let upiID = "rudranil5@pnb";  // 🔁 Replace with your UPI ID
    let name = "CampusWallet";

    let upiString = `upi://pay?pa=rudranil5@pnb&pn=NAME&am=${amount}&cu=INR`;

    let qrURL = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" 
                + encodeURIComponent(upiString);

    document.getElementById("qrImage").src = qrURL;
}
