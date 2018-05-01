"use strict";
// おまじない（迫真）

// 必要なモジュールの読み込み
const electron = require("electron");
const app = electron.app;
const Menu = electron.Menu;
const dialog = electron.dialog;
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const http = require("http");

let mainWindow = null;

// OpenWeatherMapのAPIドキュメント => http://openweathermap.org/current
const url = "http://api.openweathermap.org/data/2.5/weather"; // APIのエンドポイント
var args = "?units=metric"; // 華氏なんか使ってられるか
var weather = null; // 結果ぶちこむための変数

// 天気をgetで取得する関数
// 気合で読んで => https://nodejs.org/api/https.html#https_https_get_options_callback
function getWeather(targetUrl){
    http.get(targetUrl,(res) => {
        let body = ""; // 一旦データを受け止めてもらう
        res.on("data",(chunk) => {
            body += chunk; // ちくせきします
        });
        res.on("end",() => { // データが終わったら
            console.log("API get Success!");
            let wj = JSON.parse(body);
            console.log(wj.weather[0].description);
            // let ret = [wj.weather[0].description,wj.main.temp];
            return wj.weather[0].description.toString();
        });
    }).on("error",(e) => {
        // エラーが起きた時
        dialog.showMessageBox(
            {
                type:'error',
                title:'API Get Error',
                message:'天気情報の取得に失敗しました',
                detail:'何らかの原因で天気情報を取得できませんでした\n\n'+e.message
            }
        );
        console.error("API get error : "+e.message);
        return false;
    });
}

// ウィンドウが全部死んだらアプリ本体が死ぬようにする
app.on("window-all-closed",() => {
    app.quit();
});

// アプリの準備ができたらウィンドウその他の準備をさせる
app.on("ready",() => {
    // try-catchがわからないなら例外処理でググろう
    try{
        // settings.json の読み込みとパース
        const config = JSON.parse(require("fs").readFileSync("./settings.json","utf-8"));
        if(config.APIkey === undefined || config.cityId === undefined){
            // (dialogモジュール).showMessageBox はめっちゃ便利
            dialog.showMessageBox(
                {
                    type:'error',
                    title:'Error',
                    message:'設定ファイルが正しくありません',
                    detail:'設定ファイルには少なくともAPIキーと都市IDの設定が必要です\n設定ファイルを確認の上再起動してください'
                }
            );
            app.quit();
        }else{
            //都市IDとAPIキーのひっつけ
            args += "&id=" + config.cityId + "&appid=" + config.APIkey;
        }
    }catch(err){
        if(err.code === 'ENOENT'){
            dialog.showMessageBox(
                {
                    type:'error',
                    title:'Error',
                    message:'設定ファイルが読み込めませんでした',
                    detail:'適切な設定ファイルをアプリケーションと同じディレクトリに配置して再起動してください\n設定ファイルを作成していない場合は settings-default.json を参考に作成してください'
                }
            );
        }else{
            dialog.showMessageBox(
                {
                    type:'error',
                    title:'Error',
                    message:'設定ファイルの読み込みに失敗しました',
                    detail:'エラーコード : '+err.code
                }
            );
        }
        app.quit();
    }

    // ウィンドウの作成
    // ドキュメント => https://electronjs.org/docs/api/browser-window
    mainWindow = new BrowserWindow(
        {
            width:330,
            height:200,
            resizable:false,
            frame:false,
            transparent:true,
            title:'うぃじぇとも',
            useContentSize:true
        }
    );
    // ウィンドウが読み込むHTMLの指定
    mainWindow.loadURL("file://"+__dirname+"/index.html");
    mainWindow.on("closed",() => {
        mainWindow = null;
    });

    // ショートカットで開発者ツール出します
    globalShortcut.register('F12',() => {
        mainWindow.webContents.toggleDevTools();
    })

    // setIntervalには罠があります
    // mainWindow.on("ready-to-show",() => {
    //     mainWindow.webContents.send("weather",getWeather(url+args));
    // });

    // setIntervalで1分ごとに定期更新させる
    setTimeout(() => {
        // getWeatherの結果をレンダラプロセスに飛ばす
        let send = String(getWeather(url+args));
        console.dir(send);
        if(send.indexOf('clear') !== -1){
            mainWindow.webContents.send("weather","快晴");
        }else if(send.indexOf('few') !== -1){
            mainWindow.webContents.send("weather","晴れ");
        }else if(send.indexOf('cloud') !== -1){
            mainWindow.webContents.send("weather","くもり");
        }else if(send.indexOf('rain') !== -1){
            mainWindow.webContents.send("weather","雨");
        }else if(send.indexOf("storm") !== -1){
            mainWindow.webContents.send("weather","雷雨")
        }else{
            mainWindow.webContents.send("weather","やばい");
        }
    },5 * 1000);
});