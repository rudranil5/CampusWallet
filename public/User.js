let id = "123";
let firstname = "";
let lastname = "";
let phone_number = "";

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
  fetch("/usertransactionhistory",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({id:id})
    })
    .then(res => res.json())
    .then(data =>
    {
      let balance = 0;
        data.forEach(item => 
            {
              balance = balance + parseFloat(item.Amount);
            })
             sessionStorage.setItem("balanceObject",JSON.stringify(balance));
        console.log(balance);
    });
  fetch("/seenotification",{
  method:"POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({id:id})
})
.then(res => res.json())
.then(data => {

  console.log(data);

  const list = document.getElementById("notificationList");
  

  // Get today's date (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  data.forEach(item => {

    // Convert SQL date to YYYY-MM-DD
    const sqlDate = new Date(item.expected_date).toISOString().split("T")[0];

    if (today === sqlDate) {

      const div = document.createElement("div");
          div.style.background = "#fab4b9";   // 👈 force visible
    div.style.padding = "10px";
    div.style.margin = "5px";
    div.style.height = "100px";
    div.style.color = "black";
      div.classList.add("notification-item");
      div.style.whiteSpace = "pre-line";
div.innerHTML = "<h3>From Library</h3><p>From You have to Return book Today :<p><br>" + item.book_name;
      list.appendChild(div);
    }

  });

});
  fetch("/seeprintingstatus",{
  method:"POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({id:id})
})
.then(res => res.json())
.then(data => {

  console.log(data);

  const list = document.getElementById("notificationList");
  // Get today's date (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  data.forEach(item => {

    // Convert SQL date to YYYY-MM-DD
    const sqlDate = new Date(item.print_date).toISOString().split("T")[0];

    if (today === sqlDate && item.printing_status == 0) {

      const div = document.createElement("div");
          div.style.background = "#fab4b9";   // 👈 force visible
    div.style.padding = "10px";
    div.style.margin = "5px";
    div.style.height = "100px";
    div.style.color = "black";
      div.classList.add("notification-item");
      div.style.whiteSpace = "pre-line";
      div.innerHTML = "<h3>From Xerox</h3><p>Your document is printed.<br><br>Please collect it from the Xerox Center<p> ";
      list.appendChild(div);
    }

  });

});
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


// for notification button

function openSidebar() {
    document.getElementById("notificationSidebar")
            .classList.add("active");
    
    shownofication(); 
}

function closeSidebar() {
    document.getElementById("notificationSidebar")
            .classList.remove("active");
}

function addNotification(message) {
    const list = document.getElementById("notificationList");

    const div = document.createElement("div");
    div.classList.add("notification-item");
    div.textContent = message;

    list.appendChild(div);
}
function shownofication() {

    fetch("/seenotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
    })
    .then(res => res.json())
    .then(data => {

        console.log(data);

        const list = document.getElementById("notificationList");
        list.innerHTML = "";

        const today = new Date().toISOString().split("T")[0];

        data.forEach(item => {

            // const sqlDate = new Date(item.expected_date).toISOString().split("T")[0];
            const sqlDate = new Date(item.expected_date).toLocaleDateString("en-CA"); 
            console.log(today);
            console.log(sqlDate);
            if (today === sqlDate) {

                const div = document.createElement("div");
                div.style.background = "#fab4b9";
                div.style.padding = "10px";
                div.style.margin = "5px";
                div.style.width = "400px";
                div.style.height = "200px";
                div.style.color = "black";
                div.classList.add("notification-item");
                div.style.whiteSpace = "pre-line";

                div.innerHTML = `
                    <h3>From Library</h3>
                    <p>You have to return book today:</p>
                    <b>${item.book_name}</b>
                `;

                list.appendChild(div);
                
            }
        });

    });


    fetch("/seeprintingstatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
    })
    .then(res => res.json())
    .then(data => {

        console.log(data);

        const list = document.getElementById("notificationList");
        const today = new Date().toISOString().split("T")[0];

        data.forEach(item => {

            const sqlDate = new Date(item.print_date).toLocaleDateString("en-CA");

            if (today === sqlDate && item.printing_status == 0) {

                const div = document.createElement("div");
                div.style.background = "#f7f45c";
                div.style.padding = "10px";
                div.style.margin = "5px";
                div.style.width = "400px";
                div.style.height = "200px";
                div.style.color = "black";
                div.classList.add("notification-item");
                div.style.whiteSpace = "pre-line";

                div.innerHTML = `
                    <h3>From Xerox</h3>
                    <p>Your document is printed.</p>
                    <p>Please collect it from the Xerox Center.</p>
                `;

                list.appendChild(div);
            }
        });

    });

}