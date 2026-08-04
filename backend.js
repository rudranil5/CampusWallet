const express = require("express");
const database = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const app = express();
const isProd = process.env.NODE_ENV === "production";

app.use(express.json());
app.use(express.static("public"));
const student_db = database.createConnection({
  host: process.env.DHost,
  user: process.env.DUsername,
  password: process.env.DPassword,
  database: process.env.DDatabase,
  port:process.env.DPORT,
   ...(isProd && {ssl: {
        ca: fs.readFileSync(
            path.join(__dirname, "isrgrootx1.pem")
        )
        }
      })

});
/*
 student_db.query(
    "INSERT INTO details(firstname,lastname,phone_number,password,occupation,id) VALUES (?,?,?,?,?,?)",
    ['first', 'last', 'phone_number', 'fpassword', 'foccupation', 'value'],
   (err, result) => {
      if (err) {
        console.log(err);
        console.log( "Database error" );
      }

      console.log("Successfully saved in database" );
    }
  );

*/
app.post("/homepage",(req,res) =>
{
    res.json(
      {
        massage:"successfully entered"
      }
    )
})
app.post("/register", (req, res) => {
  let { first,last,phone_number,fpassword,foccupation,fid } = req.body;
  console.log("Received:", first,last,phone_number,fpassword,foccupation,fid);
  if (fid == "-1")
  {
    student_db.query(("SELECT max(serial_no) as max_serial FROM details"),(err,rest)=>
    {
      if(err)
      {
        console.log(err);
      }
      max = rest[0].max_serial;
      nid = String(max + 1);
      let val = foccupation[0]+foccupation[1]+"00"+nid; 
      let value = val.toUpperCase();
      console.log(value);
    });
  } 
  else
    {
      value = fid;
    } 
      student_db.query(
    "INSERT INTO details(firstname,lastname,phone_number,password,occupation,id) VALUES (?,?,?,?,?,?)",
    [first, last, phone_number, fpassword, foccupation, value],
   (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Database error" });
      }

      return res.json({ message: "Successfully saved in database" });
    }
  );
    
    
});


// * for login page 
app.post("/login", (req, res) => {
  const { id, password, scheck } = req.body;

  let query = "";
  let value = id;

  // ! decide which column to use
  if (scheck == "1") {
    query = "SELECT * FROM details WHERE phone_number = ? AND password = ?";
  } else {
    query = "SELECT * FROM details WHERE id = ? AND password = ?";
  }

  student_db.query(query, [value, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    if (result.length > 0) {
      const user = result[0];
      let redirectpage = "User.html";
      if (user.occupation == "Librarian")
      {
        redirectpage = "Librarian.html";
      }
      else if (user.occupation == "Canteen-Service")
      {
        redirectpage = "Canteen-Service.html";
      }
      else if (user.occupation == "Xerox")
      {
        redirectpage = "Xerox.html";
      }
      return res.json({
        success: true,
        user: user,
        redirect:redirectpage,
        occupation: user.occupation,
        id: user.id
      });
      
      
    } else {
      return res.json({
        success: false,
        message: "Invalid login credentials"
      });
    }
  });
});

// * for User page

// to show the name 
app.post("/Userdetails",(req,res)=>{
  const {id} = req.body;
  student_db.query("Select firstname,lastname,phone_number from details where id = ?",[id],(err,data)=>{
    if(err)
    {
      console.log("Error:"+err);
    }
    if (data.length === 0) {
        return res.json({ success: false, message: "User not found" });
      }
    return res.json({
        firstname:data[0].firstname,
        lastname:data[0].lastname,
        phone_number:data[0].phone_number
    }
    );
  });
}
)     

// * for library page
// to show their name
app.post("/Librariandetails",(req,res)=>{
  const {id} = req.body;
  student_db.query("Select firstname,lastname,phone_number from details where id = ?",[id],(err,data)=>{
    console.log(data);
    if(err)
    {
      console.log("Error:"+err);
    }
    if (data.length === 0) {
        return res.json({ success: false, message: "User not found" });
      }
    return res.json({
        
        firstname:data[0].firstname,
        lastname:data[0].lastname,
        phone_number:data[0].phone_number,
    }
    );
  });
}
) 

// * Removing the student list who already submitted the fine
app.get("/removelist", (req, res) => {
  const sql = "SELECT `Roll Number` from library where notified = 0 ";

  student_db.query(sql,(err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error");
    }
    
    res.json(result);
  });
});

// * show list of students if exists
app.get("/showstudentlist", (req, res) => {
  const sql = "SELECT * FROM library where notified = 1";

  student_db.query(sql,(err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error");
    }
    
    res.json({
      result:result,
      notified:result.notified
    }
    );
  });
});

app.post("/finesubmitted",(req,res)=>{
  const {roll} = req.body;
  let queary = "update library set notified = 0 where `Roll Number` = ? ;"
  student_db.query(queary,[roll],(err,result)=>
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
       return res.json({
        message:"Successfully inserted"
        });
    }
  })
})


// * for notifying students from library
app.post("/notify",(req,res)=>{
  const { frollnum,
    fullname,
    cardnumber,
    book,
    author,
    ffine,
    id,
    fdate} = req.body;
  console.log(req.body);
  let notified = 1;
  student_db.query("INSERT INTO library(`Roll Number`,name,library_id,book_name,author_name,fine,librarian_id,return_date,notified,notification_sent_date) VALUES(?,?,?,?,?,?,?,?,?,CURDATE())",[frollnum,fullname,cardnumber,book,author,ffine,id,fdate,notified],(err,data)=>{
    if(err)
    {
      console.log("Error:"+err);
    }
    else
    {
      console.log("Successful");
        return res.json({
        message:"Successfully inserted"
        }
        );
    }
   
  });
}
)


app.get("/notifyhistory", (req, res) => {
  const sql = "SELECT * FROM library where notified = 0";

  student_db.query(sql,(err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error");
    }
    
    res.json(
      result
    );
  });
});



app.get("/showprintlist", (req, res) => {
  const sql = "SELECT details.id, details.firstname,details.lastname,details.phone_number,printinglist.printing_status,printinglist.message FROM details INNER JOIN printinglist ON details.id = printinglist.roll_number where printinglist.printing_status = 1;";
  
  student_db.query(sql,(err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error");
    }
    console.log(result);
    res.json(result);
  });
});

app.post("/Xeroxdetails",(req,res)=>{
  const {id} = req.body;
  student_db.query("Select firstname,lastname,phone_number from details where id = ?",[id],(err,data)=>{
    console.log(data);
    if(err)
    {
      console.log("Error:"+err);
    }
    if (data.length === 0) {
        return res.json({ success: false, message: "User not found" });
      }
    return res.json({
        
        firstname:data[0].firstname,
        lastname:data[0].lastname,
        phone_number:data[0].phone_number,
    }
    );
  });
}
) 


app.post("/printed",(req,res)=>{
  const {roll} = req.body;
  let queary = "update printinglist set printing_status = 0 where roll_number = ? ;"
  student_db.query(queary,[roll],(err,result)=>
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
       return res.json({
        message:"Successfully inserted"
        });
    }
  })
})
app.get("/openstatus",(req,res)=>
{
  let queary = "select xerox from set_active_time where serial = 1";
   student_db.query(queary,(err,result)=>
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      console.log(result);
       return res.json(result);
    }
  })
})
app.post("/settimexerox",(req,res)=>{
  let {time} = req.body;
  let queary = "update set_active_time set xerox = ? where serial = 1 ;"
  student_db.query(queary,[time],(err,result)=>
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
       return res.json({
        message:"Successfully updated"
        });
    }
  })
})


app.get("/printlisthistory", (req, res) => {
  const sql = "SELECT details.id, details.firstname,details.lastname,details.phone_number,printinglist.printing_status,printinglist.message FROM details INNER JOIN printinglist ON details.id = printinglist.roll_number";

  student_db.query(sql,(err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error");
    }
    res.json(
      result
    );
  });
});
app.get("/removeprinted", (req, res) => {
  const sql = "SELECT roll_number from printinglist where printing_status = 0 ";

  student_db.query(sql,(err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error");
    }
    
    res.json(result);
  });
});
app.get("/activetime", (req, res) => {
  const sql = "SELECT xerox from set_active_time where serial = 1 ";

  student_db.query(sql,(err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error");
    }
    
    res.json({
      status:result[0].xerox
    });
  });
});

app.post("/senddocuments",(req,res)=>{
  let {id,massage} = req.body;
  let firstqueary = "select * from printinglist where roll_number = ?";
  let queary = "insert into printinglist(roll_number,printing_status,message,print_date) values(?,?,?,CURDATE());"
  student_db.query(firstqueary,[id,1,massage],(err,result)=>
  {
    if(err)
    {
      console.log(err);
    }
    else if(result.length == 0)
    {
        student_db.query(queary,[id,1,massage],(err,rest)=>
        {
          if(err)
          {
            console.log(err);
          }
          else
          {
            return res.json({
              message:"Successfully inserted"
              });
          }
        })
    }
    else
    {
      queary = "update printinglist set printing_status = 1 , message = ? where roll_number = ?;"
        student_db.query(queary,[massage,id],(err,result)=>
        {
          if(err)
          {
            console.log(err);
          }
          else
          {
            return res.json({
              message:"Successfully updated"
              });
          }
        })
    }
  })
  
})

app.post("/setreminder",(req,res)=>{
  let {id,book_name,expected_date} = req.body;
  let queary = "insert into librarynotification(id,book_name,expected_date) values(?,?,?);"
  student_db.query(queary,[id,book_name,expected_date],(err,result)=>
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
       return res.json({
              message:"Successfully notification sent"
              }); 
    }
  })
  
})

app.post("/seenotification",(req,res)=>{
  let {id} = req.body;
  let queary = "select * from  librarynotification where id = ? ;"
  student_db.query(queary,[id],(err,result)=>
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      console.log(result)
       return res.json(result);
    }
  })
})
app.post("/seeprintingstatus",(req,res)=>{
  let {id} = req.body;
  let queary = "select * from  printinglist where roll_number = ? ;"
  student_db.query(queary,[id],(err,result)=>
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      console.log(result)
       return res.json(result);
    }
  })
})
app.post("/usertransactionhistory",(req,res)=>{
  const {id} = req.body;
  student_db.query("Select * from transactions where sender = ?",[id],(err,data)=>{
    console.log(data);
    if(err)
    {
      console.log("Error:"+err);
    }
    return res.json(data);
  });
}
) 
app.post("/Xeroxtransactionhistory",(req,res)=>{
  const {Sender} = req.body;
  student_db.query("Select details.firstname,details.lastname,transactions.Amount,transactions.paymentTimestamp,transactions.Mode from transactions join details on details.id = transactions.Sender where Reciever = ?",[Sender],(err,data)=>{
    console.log(data);
    if(err)
    {
      console.log("Error:"+err);
    }
    return res.json(data);
  });
}
) 
app.post("/Librarytransactionhistory",(req,res)=>{
  const {Sender} = req.body;
  student_db.query("Select details.firstname,details.lastname,transactions.Amount,transactions.paymentTimestamp,transactions.Mode from transactions join details on details.id = transactions.Sender where Reciever = ?",[Sender],(err,data)=>{
    console.log(data);
    if(err)
    {
      console.log("Error:"+err);
    }
    return res.json(data);
  });
}
) 

app.post("/recordTransaction",(req,res)=>{
    const {TrData}= req.body
    const Amount=TrData.Amount;
    const Sender=TrData.Sender;
    const Reciever=TrData.Reciever;
    const Mode=TrData.Mode;
    const Remarks=TrData.Remarks;
    if (Amount.length!=null || Sender.length!=null || Reciever.length!=null){

        student_db.query("insert into transactions (Amount,Sender,Reciever,Mode,Remarks) values (?,?,?,?,?)",[Amount,Sender,Reciever,Mode,Remarks],(err,data)=>{
            if(err){console.log("Error: ",err);}
            else{
                console.log("Success");
                return res.json("Payment Successfully Updated");
            }
        })
        }
    else {return res.json("An Error Occured !!! Please Try Again ")}
})

// down changed r

app.get("/statusGet",(req,res)=>{
  const serviceProvider=req.query.service;
  console.log("Status requested of: ",serviceProvider);
  student_db.query(`select status from services where name='${serviceProvider}'`,(err,data)=>{
    if(err){console.log(`error while checking status of ${serviceProvider} : `+err)}
    else{ return res.json(data);}
  });
})

app.put("/statusChange",(req,res)=>{
  let {service}=req.body;
  student_db.query(`update services 
    set status= case
    when status='open' then 'closed'
    else 'open'
    end
    where name=?`,[service],(err,data)=>{
      if(err){console.log(`While changing ${service} status : `+err);}
      else{return res.json({messege:"success"}) ;}
    });
});

app.put("/orderStatusChange",(req,res)=>{
  let {orderer,dish,newStatus}=req.body;
  student_db.query("update orders set status=? where id=? and item=?;",[newStatus,orderer,dish],(err,data)=>{
    if (err){console.log("Updation of order failed due to "+err);}
    else{return res.json("Status of item Changed");}
  });
})


app.post("/save",(req,res)=>{
    console.log("FUcci");
    const {itemList} = req.body;
    const cost=234;
    let success={};
    console.log("Selected Items  "+itemList);
    student_db.query("delete from Menu",(err,data)=>{
        if(err){console.log("Error: "+err)}
        else{return res.json("The existing Menu is about to be replaced with New !!!")}
    });
    for (let i=0;i<itemList.length;i++){
        let Item=itemList[i];
        //let cost=itemList[i];
        student_db.query("insert into menu (items,cost) values (?,?)",[Item,cost],(err,data)=>{
        if(err)
        {
        console.log("Error:"+err);
        return err;
        }
        
        });
    }
}

)


app.get("/showMenu",(req,res)=>{
    dataToInsert={}
    student_db.query("select menuitems.items, menuitems.price from menu join menuitems on menu.Items=menuitems.items",(err,data)=>{
        if (err){console.log("Error : ",err);}
        else{

            console.log("THE MENU TODAY-"+JSON.stringify(data));
            return res.json(data);
        }
        
    })
    
})

// below showorders history is changed;

app.get("/showOrders",(req,res)=>{
  student_db.query("select id,item,quantity,time_format(time,'%h:%i %p') as time,status from orders ",(err,data)=>{
    if(err)
      {
        console.log("Cant show orders due to : ",err);
      }
    else
    {
      
      return res.json(data);
    }
    console.log(data);

  })
})
app.get("/showOrderHistory",(req,res)=>{
  student_db.query("select date_format(date,'%d %M, %Y') as date,id,item,quantity,code,status from orderHistory order by date",(err,data)=>{
    console.log("OrderHist-",data);
    if(err){ console.log("Unable to show Order History due to- ",err)}
    else{ return res.json(data);}
    
  })
})

app.post("/saveCode",(req,res)=>{
  let {data}=req.body;
  //let a  = req.body;
console.log(data);

 // let {id} = req.body;
  let queary = "insert into orders (id,item,cost,quantity,code)values(?,?,?,?,?);"
  student_db.query(queary,[data.uid,data.menuitem,data.cost,data.quantity,data.code],(err,result)=>
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      console.log("Result of order: ",+result);
       return res.json(result);
    }
  })
})

app.use(express.static(path.join(__dirname, "public")));

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on :${PORT}`));