const express = require('express');
const request = require('request');

// const fs = require('fs');
// let html = fs.readFileSync('data.html', 'utf-8');

const app = express();
app.use(express.json())
app.get("/api/", (req, res) => {
    const name =Object.keys(req.query)[0] ;
    console.log(name);
    options = {
        url: 'https://github.com/' + name,
        method: "GET"
    };
    let html='';
    request(options, (err, res, dat) => {
        if (!err && res.statusCode === 200) {
            html = dat;
          } else {
            console.error(err);
          }
        next();
    })
    function next(){
        console.log(html);
        const countReg = /<span class=\"sr-only\">(\w*) contribution/g;
        const dateReg = /data-date="(.*?)" data-level/g
        const countRaw = html.match(countReg);
        const dateRaw = html.match(dateReg);
    
        let count = [];
        countRaw.forEach(ele => {
            ele = ele.slice(22,).split(' ')[0];
            if (ele == 'No') {
                count.push(0)
            } else {
                count.push(Number(ele))
            }
        });
        // console.log(count);
    
        let date = [];
        dateRaw.forEach(ele => {
            date.push(ele.split('"')[1])
        });
        // console.log(date)
    
        function getnewarr(keyArr, valueArr) {
            var obj = {};
            keyArr.map((v, i) => {
                obj[keyArr[i]] = valueArr[i];
            })
            return obj;
        }
        //按时间排序
        const length = dateRaw.length;
        let nosort_data = getnewarr(date, count)
        let sorted_data = {};
        const sorted_date = date.sort();
        // console.log(sorted_date);
        for (let i = 0; i < length; i++) {
            let key = sorted_date[i];
            sorted_data[key] = nosort_data[key];
        }
        date = sorted_date;
        count = Object.values(sorted_data);
    
        let dataArr = [];
        for (let k = 0; k < length; k++) {
            let itemArr = { "date": date[k], "count": count[k] }
            dataArr.push(itemArr);
        }
        console.log(dataArr);
    
        function arrSplit(arr, n) {
            return arr.reduce(function (result, item, index) {
                if (index % n === 0) {
                    result.push([]);
                }
                result[result.length - 1].push(item);
                return result;
            }, []);
        }
    
        //总提提交数
        function sumArr(arr) {
            let sum = 0;
            arr.forEach((e) => {
                sum += e;
            })
            return sum;
        }
        const totals = sumArr(count);
    
        result = {
            "total": totals,
            "contributions": arrSplit(dataArr, 7)
        }
        res.set('Content-Type', 'application/json')
        res.send(result);
    }
})

app.listen(8080)
