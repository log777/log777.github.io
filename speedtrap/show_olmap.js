/*
show_olmap.js
Version: 1.3.2  @2023/05/21
Wenchin Hsieh @Goomo.Net Studio, wenchin@goomo.net
*/


var mapCenter = [121.50, 25.07];
var poiFeatures = [];
var poiIds = [];


// 建立 ol.style.Circle
var poiImageCircle = new ol.style.Circle({
    radius: 18,
    fill: new ol.style.Fill({ color: "#FF9" }),
    stroke: new ol.style.Stroke({
        color: "#71F",
        width: 2
    }),
});


// 建立 Vector Layer
var poiLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [
        ]
    }),
});


// 建立 Tile Layer
var tileLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
});


function initMap() {
    // 建立 Map Object
    var map = new ol.Map({
        target: 'emap',
        layers: [
            tileLayer,
            poiLayer
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat(mapCenter),
            zoom: 12
        })
    });
}


function showOnMap(json) {
    //console.log(json.Id, json.Label, json.Loc.Lon, json.Loc.Lat, json.Sensors.Temp);

    // 建立 ol.style.Style
    let poiStyle = new ol.style.Style({
        image: poiImageCircle,
        text: new ol.style.Text({
            text: json.Label,
            offsetY: 2,
            scale: 1.5
        }),
    });

    // 建立 ol.Feature
    let loc = [json.Loc.Lon, json.Loc.Lat];

    let poiFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(loc))
    });

    // 為 Feature 指定 Style
    poiFeature.setStyle(poiStyle);

    let id = json.Id;
    let index = poiIds.indexOf(id);
    
    if (index >= 0) {
        poiLayer.getSource().removeFeature(poiFeatures[index]);
        poiIds.splice(index, 1);
        poiFeatures.splice(index, 1);
    }
   
    poiIds.push(id);
    poiFeatures.push(poiFeature);
    poiLayer.getSource().addFeature(poiFeature);

    //console.log(poiIds);
}