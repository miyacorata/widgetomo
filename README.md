# WidgeTomo
ウィジェット + ふじとも = うぃじぇとも

## Notice
現状これ動きません いずれ動くようにします

## Description
現在時刻、現在の天気情報を表示するデスクトップウィジェットアプリです。

KNCT ProLab 技術LT会に出展するために作成したデモアプリです。
そのうち機能強化するつもりはあったりなかったりします。

天気情報の取得のためにOpenWeatherMapのAPIキーと都市コードが必要です

## Requirement
* Node.js v8.9.4以上
* npm v5.6.0以上

* [OpenWeatherMap](http://openweathermap.org) API key (Free) & CityCode
## Usage
1. このリポジトリをクローン
1. コンソールで `npm install`  
(必要なライブラリのインストールを行います)
1. 設定ファイルを作成(settings-default.jsonを参考にsettings.jsonを作成してください)
1. コンソールで `./node_modules/.bin/electron .`

## License
このソフトウェアは MIT License で公開しています