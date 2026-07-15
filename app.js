/*
===========================================
株式会社ヒット
勤怠・PCログ突合システム
app.js
===========================================
*/

//===========================
// GAS API
//===========================

const API_URL =
"https://script.google.com/a/macros/theforestgym.com/s/AKfycbyqo2xpd9Ybv1q0ZKXKnxuku77hX6j5mKlybtVLJOQa8F2WS9VredOwtrF3k3-B6kts/exec";

//===========================
// 初期処理
//===========================

window.onload = function(){

    console.log("システム起動");

    healthCheck();

};


//===========================
// API接続確認
//===========================

async function healthCheck(){

    try{

        const response = await fetch(
            API_URL + "?action=health"
        );

        const data = await response.json();

        console.log(data);

    }catch(e){

        console.error(e);

        alert("GASへ接続できません。");

    }

}
