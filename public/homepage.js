fetch("/notifyhistory")
.then(res => res.json())
.then(data=>
{
    console.log(data);
}
)