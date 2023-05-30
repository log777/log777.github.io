/*
mqws_olmap.js
Version: 1.3.3  @2023/05/28
Wenchin Hsieh @Goomo.Net Studio, wenchin@goomo.net
*/


//var mqServer = "ws://broker.mqttgo.io:8000/mqtt"
var mqServer   = "wss://broker.mqttgo.io:8084/mqtt"
var mqUser     = "";
var mqPwd      = "";
var subTopic   = "Maker/YourName";
var pubTopic   = "Maker/YourName";
var pubPayload = '{ "Id":"goomo", "Label":"龜", "Loc":{ "Lon":121.553139, "Lat":25.067002 }, "Sensors":{ "PM2.5":12, "PM10":80, "Humi":75.2, "Temp":25.3 } }';
var mqClient, mqOpt;
var boxLog;


var onMessage = function (topic, payload) {
    console.log('Received [' + topic + '] ' + payload);

    let dt = new Date();
    boxLog.value += dt.toLocaleString() + ' [' + topic + ']\n' + payload + '\n';
    boxLog.scrollTop = boxLog.scrollHeight;

    // Show on Map
    let json = JSON.parse(payload);
    showOnMap(json);
}


var onConnect = function () {
    console.log('MQTT Server Connected.');

    document.getElementById("connection").textContent = "Connected";
    document.getElementById("connection").style.color = "#0C0";

    subTopic = document.getElementById("subTopic").value;

    if (mqClient.subscribe(subTopic))
        console.log('Topic [' + subTopic + '] subscribed.');

    mqClient.on("message", onMessage);
}


function init() {
    initMap();
    initMqtt();
}


function initMqtt() {
    boxLog = document.getElementById("subLog")

    document.getElementById("mqServer").value = mqServer
    document.getElementById("user").value = mqUser
    document.getElementById("pwd").value = mqPwd
    document.getElementById("pubTopic").value = pubTopic
    document.getElementById("pubPayload").value = pubPayload 
    document.getElementById("subTopic").value = subTopic

    mqttConnecting();
}


function mqttConnecting() {
    console.log('Connecting MQTT Server.');

    mqServer = document.getElementById("mqServer").value;
    mqUser = document.getElementById("user").value;
    mqPwd = document.getElementById("pwd").value;
    mqOpt = { username: mqUser, password: mqPwd };
    mqClient = mqtt.connect(mqServer, mqOpt);
    //mqClient = mqtt.connect(mqServer); // 若不需要帳密，請將上行更換為此行！

    mqClient.on('connect', onConnect);
}


function mqttPublish() {
    console.log('Publishing [' + pubTopic + '] ' + pubPayload);

    pubTopic = document.getElementById("pubTopic").value;
    pubPayload = document.getElementById("pubPayload").value;
    mqClient.publish(pubTopic, pubPayload);
}


function mqttQuit() {
    document.getElementById("connection").textContent = "Offline";
    document.getElementById("connection").style.color = "#F00";
    document.getElementById("subLog").value = "";

    mqClient.end();
    console.log('Quit MQTT Server.');
}


function clearLog() {
    boxLog.value = '';
}