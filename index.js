const express=require('express');


const app=express();






app.get("/api",(req,res)=>{
    console.log(req.query);
    res.send('ok')
})

app.listen(8080)