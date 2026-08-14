const occupation_choose = document.getElementById("Ocupation");
const roll_disable = document.getElementById("Roll");
const unique_id_disable = document.getElementById("Unique_id");
const unique_id = document.getElementById("default");
const unique_id_default = document.getElementById("default_visible");
const User_id_web = document.getElementById("User_id");
const occupation_student = document.getElementById("student_occupation");
const unique_num=document.getElementById("unique_number");
User_id_web.textContent = "Your Id"
occupation_choose.addEventListener("change",
function()
{

    occupation_choose.transparancy = false;
    occupation_student.selected = false;
    roll_disable.disabled = false;
    roll_disable.selected = false;
  unique_id_disable.disabled = false;
  unique_id_disable.selected = false;
  unique_id.style.visibility = "visible";
  unique_id_default.style.visibility = "hidden";
  let firstname = document.getElementById("fname");
let lastname =  document.getElementById("lname");
let phone_num = document.getElementById("phone");
let phoneVal = phone_num.value;
let length = phoneVal.length;
let id="";
   if(this.value == "Student")
   {
     unique_num.required=true;
     unique_id_disable.disabled = true;
       roll_disable.selected = true;
       if(id == "")
       {
        unique_id_default.style.visibility = "visible"
        User_id_web.textContent ="If you dont have makaut roll number enter you library card number";
       }
   }
   else if (this.value == "Teacher")
   {
     unique_num.required=true;
     roll_disable.disabled = true;
      unique_id_disable.selected = true;
   }
   else
   {
      if(firstname.value.length != 0 && lastname.value.length!=0 && length!=0)
      {
        
        roll_disable.disabled = true;
        unique_id_disable.disabled = true;
        unique_id.style.visibility = "hidden";
        unique_id_default.style.visibility = "visible";
        User_id_web.textContent =  "You can enter in your web page with your phone number . You can get your id in the login page";
      }
      else
      {
        alert("Fill up the upper tables and then choose your occupation");
        occupation_student.selected = "true";
      }
       

   }
});
// // Client-side JavaScript
async function sendData(event) 
{
event.preventDefault();
let firstname = document.getElementById("fname").value;
let lastname =  document.getElementById("lname").value;
let phone_num = document.getElementById("phone").value;
let password = document.getElementById("password").value;
let occupation_choose = document.getElementById("Ocupation").value;
let length = phone_num.length;
const unique_id_default = document.getElementById("default_visible");
const User_id_web = document.getElementById("User_id");
 unique_id_default.style.visibility = "hidden";
let id = "";
if ( occupation_choose == "Student" || occupation_choose == "Teacher")
{
  if(User_id_web == "")
  {
    alert("Fill out every form");
    unique_id_default.style.visibility = "visible"
    User_id_web.textContent ="If you dont have makaut roll number enter you library card number";
  }
 
   id = document.getElementById("unique_number").value;
}
else
{
  
   id= phone_num;
}
const data = 
{
  first:firstname,
  last:lastname,
  phone_number:phone_num,
  fpassword:password,
  foccupation:occupation_choose,
  fid:id
};

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        console.log("Server response:", result.message);
        if (result.message==='Id already Registered'){
          alert(`THE ID ${id} is already registered with us. Kindly contact Admins if you think this is a mistake.🥲`);
          return;
        }
        else if (result.messege==="Database error"){alert("Oops , Something Went Wrong, Please try agail later");}
    } catch (error) {
        console.error("Error:", error);
    }
    

    if(firstname.length != 0 && lastname.length !=0  && password.length != 0 && id != 0)
    {
      window.location.href="/login.html";
    }
    
}