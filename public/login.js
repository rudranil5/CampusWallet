
async function sendData( ) 
{
   let fpassword = document.getElementById("password").value;
   let fid = document.getElementById("userid").value;
   let selected = document.querySelector('input[name="choice"]:checked');
   let fcheck = 0;
   if (selected && selected.value === "phone_number")
   {
        fcheck = 1;
   }
   if (selected && selected.value === "login")
   {
        fcheck = 0;
   }
   console.log(fcheck);
   const data =
   {
     password:fpassword,
     id:fid,
     scheck:fcheck

   };
   try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log(result);
        if(fcheck == 1)
        {
            alert("Your id is "+result.id+".You can enter with your id and password");
        }
        if(result.success)
        {
            sessionStorage.setItem("object",JSON.stringify(result.id));
            window.location.href = "/"+result.redirect;
        }
    } catch (error) {
        console.error("Error:", error);
    }

}