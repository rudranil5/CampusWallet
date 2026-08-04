let librarianID = null;

function callid() {
    const library_id = JSON.parse(sessionStorage.getItem("object_notify"));

    if (!library_id) {
        window.location.href = "login.html";
        return;
    }

    let words = library_id.trim().split(/\s+/);

    document.getElementById("show_id").textContent =
        words[0] + " " + words[1];

    librarianID = words[2];  // store globally
}

window.onload = callid;

function storedata() {

    if (!librarianID) {
        alert("Session expired. Please login again.");
        return;
    }

    const data = {
        frollnum: document.getElementById("roll_num").value,
        fullname: document.getElementById("fname").value,
        cardnumber: document.getElementById("card_num").value,
        book: document.getElementById("book_name").value,
        author: document.getElementById("author_name").value,
        ffine: document.getElementById("fine").value,
        fdate: document.getElementById("date").value,
        id: librarianID
    };

    fetch("/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        console.log(result.message);
    });
}