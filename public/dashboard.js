window.onload=function(){
    fetch("/showOrders")
    .then(res=>res.json())
    .then(data => {
    
        const tableBody=document.querySelector(".bookings-table tbody");
        console.log("Here is - ",data);
        data.forEach(item =>{
            const row= document.createElement("tr");
            
            const tuid=document.createElement("td");
            tuid.textContent=item.id;
            const titems=document.createElement("td");
            titems.textContent=item.item;
            const tquantity=document.createElement("td");
            tquantity.textContent=item.quantity;
            const ttime=document.createElement("td");
            ttime.textContent=item.time;
            const tstatus=document.createElement("td");
            const statusButton=document.createElement("select");
            const options_Status=['cancelled','accepted','served','preparing','pending'];
            options_Status.forEach(status=>{
                let option=document.createElement("option");
                option.value=status;
                option.textContent=status;
                if (status==item.status)
                { option.selected=true;}
                statusButton.appendChild(option);
            })
            
            statusButton.addEventListener("change",()=>{
                console.log(statusButton.value);
                //const newStatus=statusButton.value;
                change_order_status(item.id,item.item,statusButton.value);
            })
            tstatus.appendChild(statusButton);

            row.appendChild(tuid);
            row.appendChild(titems);
            row.appendChild(tquantity);
            row.appendChild(ttime);
            row.appendChild(tstatus);
            tableBody.appendChild(row);
            
        });
    })
        .catch(err=>console.log("Cant show orders due to - ",err));

    //Below is to show canteen service status
    
    
    statusGet();
        
        
};

window.statusChange =function(){
    let Uid = JSON.parse(sessionStorage.getItem("object"));
    fetch("/statusChange",{
        method:'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({service:'canteen',id:Uid})
    })
    .then(res=>res.json())
    .then(data=>{console.log(data);})
    .then(()=>{
        statusGet();
        
        
    })
};

window.statusGet =function(){
    let status='';
    let status2='';
    let serviceProvider='canteen';
    fetch ('/statusGet?service=canteen')
    .then(res=>res.json())
    .then(data=>{
        data.forEach(item=>{
            console.log(data);
        if (item.status=='closed'){
            status= 'Closed';
            status2='🔴';
        }
        else if (item.status=='open'){
            status='Open';
            status2='🟢';
        }
        else{
            console.log("Some Error Occured");
            console.log(item.status);
            
        }
        })
        document.getElementById('serviceStatus').innerHTML=(`<b>Canteen is ${status}</b>`);
        document.getElementById('serviceStatus2').innerHTML=(`${status2}`);
        
    })
        .catch(err=>console.log(err));
    

}

window.change_order_status = function(customerId,dishName,newStatus){
    const data={
        orderer:customerId,
        dish:dishName,
        newStatus:newStatus
    };
    console.log(data);

    fetch ("/orderStatusChange",{
        method:"PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then (res=>res.json())
    .then (data=>{
        console.log (data);
    })
}
