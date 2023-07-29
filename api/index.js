const express = require('express');
const request = require('request');

const app = express();
app.use(express.json())
app.get("/api/", (req, res) => {
    const name = Object.keys(req.query)[0];
    options = {
        url: `https://github.com/${name}`,
        method: "GET"
    };
    let html = '';
    request(options, (err, res, dat) => {
        !err && res.statusCode === 200 ?html = dat:console.error(err);
        next();
    })
    function next() {
        const countRaw = html.match(/<span class=\"sr-only\">(\w*) contribution/g);
        const dateRaw = html.match(/data-date="(.*?)" data-level/g);
        let count = [];
        countRaw.forEach(ele => {
            ele = ele.slice(22,).split(' ')[0];
            ele === 'No' ? count.push(0) : count.push(Number(ele));
        });
        let date = [];
        dateRaw.forEach(ele => {
            date.push(ele.split('"')[1])
        });
        function getnewarr(keyArr, valueArr) {
            var obj = {};
            keyArr.map((v, i) => {
                obj[keyArr[i]] = valueArr[i];
            })
            return obj;
        }
        const length = date.length;
        let nosort_data = getnewadaterr(date, count)
        let sorted_data = {};
        const sorted_date = date.sort();
        for (let i = 0; i < length; i++) {
            let key = sorted_date[i];
            sorted_data[key] = nosort_data[key];
        }
        count = Object.values(sorted_data);
        let dataArr = [];
        for (let k = 0; k < length; k++) {
            let itemArr = { "date": sorted_date[k], "count": count[k] }
            dataArr.push(itemArr);
        }
        function arrSplit(arr, n) {
            return arr.reduce((resultList, itemArr, index) => {
                index % n === 0 ? resultList.push([]) : resultList[resultList.length - 1].push(itemArr);
                return resultList;
            }, []);
        }
        function sumArr(arr) {
            let sum = 0;
            arr.forEach((e) => {
                sum += e;
            })
            return sum;
        }
        result = {
            "total": sumArr(count),
            "contributions": arrSplit(dataArr, 7)
        }
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Content-Type', 'application/json');
        res.set({
            'Content-Type': 'application/json;charset=utf-8',
        });
        res.json(result);
    }
})
app.listen(8080)
