const fs=require('fs');
const request = require('request');
options = {
    url: 'https://github.com/asucanyh-cn',
    method: "GET"
};
request(options,(err,res,html)=>{
    if(err) return console.log(err);
    console.log(res);
    console.log(html)
    fs.writeFile('./data.html',html,'utf-8',(err)=>{
        console.log(err)
    })
})
