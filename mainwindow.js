"use strict";

// モジュール読み込み
const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;

// 日付の整形
function monthname(num) {
    var months;
    months = ["January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"];
    if( num > 11 ){
        return false;
    }else{
        return months[num];
    }
}
function addOrdinal(num){
    switch (num){
        case 11:
        case 12:
        case 13:
            return num + "th";
        default:
            switch ( num % 10 ){
                case 1:
                    return num + "st";
                case 2:
                    return num + "nd";
                case 3:
                    return num + "rd";
                default:
                    return num + "th";
            }
    }
}
// 関数名がクソ
function keta(num){
    var ret;
    if(num >= 10){
        ret = num;
    }else{
        ret = "0" + num;
    }
    return ret;
}
function getTime(){
    var nowTime = new Date();
    var nowMonth = monthname(nowTime.getMonth());
    var nowDay = addOrdinal(nowTime.getDate());
    var nowHour = nowTime.getHours();
    var nowMin = keta(nowTime.getMinutes());
    var nowSec = keta(nowTime.getSeconds());
    return "<span style=\"font-size:16px\">" + nowMonth + " " + nowDay + " </span>" + nowHour + ":" + nowMin + "<span style=\"font-size:16px\"> " + nowSec + "</span>";
}

setInterval(() => {
    document.getElementById("time").innerHTML = getTime();
},1000);

// 天気がアメリカ語で飛んでくるので日本語にする
function convertWeather(weather){
    
}

ipcRenderer.on("weather",(event,weather) => {
    console.log("Catch weather info");
    console.dir(weather);
    document.getElementById("weather").innerText = weather;
    console.log("Wether info update complete!");
});
ipcRenderer.on("temp",(temp) => {
    console.log("Catch temp info");
    document.getElementById("temp").innerText = temp;
    console.log("Temp info update complete!");
})