var baselayers;

// Function to draw your map
var drawMap = function() {

  // Create map and set viewd
  var map = L.map('container');
  map.setView([38.9, -94], 4); 

  // Create an tile layer variable using the appropriate url
  var defaultlayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
  
  var Thunderforest_Landscape = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});

  // Add the layer to your map
  defaultlayer.addTo(map);

  baselayers = {
        "Default": defaultlayer,
        "Landscape": Thunderforest_Landscape
      };
      

  // Execute your function to get data
  getData(map);
}

// Function for getting data
var getData = function(map) {

  // Execute an AJAX request to get the data in data/response.js
  var data;
	$.ajax({
	    url:'data/response.json',
	    type: "get",
	    success:function(dat) {
	       data = dat;
	       customBuild(data, map);
	      
	    }, 
	   dataType:"json"
	}) ;

  // When your request is successful, call your customBuild function

}

// Do something creative with the data here!  
var customBuild = function(data, map) {  
   var victimhit = new L.LayerGroup();
   var victimkilled = new L.LayerGroup();
   var victimall = new L.LayerGroup();
  
   var jancount = 0
      ,febcount = 0
      ,marcount = 0
      ,aprcount = 0
      ,maycount = 0
      ,juncount = 0
      ,julcount = 0
      ,augcount = 0
      ,sepcount = 0
      ,octcount = 0
      ,novcount = 0
      ,deccount = 0
      ,unknowncount = 0;

	 data.map(function(d){
      var victimname = d["Victim Name"];
      if (victimname == "na" || victimname == undefined) {
        victimname = "Unavailable";
      }
      var age = d["Victim's Age"];
      if (age == undefined) {
        age = "Unavailable";
      }

      var circlerad = age * 40;
      if (isNaN(circlerad)) {
        circlerad = 300;
      }
      var victimgender = d["Victim's Gender"];
      var victimstatus = d["Hit or Killed?"];
      var thedate = d["Date Searched"];
      var summary = d["Summary"];
      var victimstate = d["State"];
      var victimcity = d["City"];
      var source = d["Source Link"];

      if (victimgender == 'Male') {
        markercolor = '#00ced1';
      } else if (victimgender == 'Female') {
        markercolor = '#ff0080';
      } else {
        markercolor = '#ffd700';  
      }

     	var circle = new L.circle([d.lat, d.lng], circlerad, {color: markercolor, opacity:.5}).addTo(map);
      circle.addTo(victimall);
      if (victimstatus == 'Hit') {
        circle.addTo(victimhit);
      } else if (victimstatus == 'Killed') {
        circle.addTo(victimkilled);
      }

      var d = new Date(thedate);
      var month = d.getMonth();
      
      if (month == 0) {
        jancount++;
      } else if (month == 1) {
        febcount++;
      } else if (month == 2) {
        marcount++;
      } else if (month == 3) {
        aprcount++;
      } else if (month == 4) {
        maycount++;
      } else if (month == 5) {
        juncount++;
      } else if (month == 6) {
        julcount++;
      } else if (month == 7) {
        augcount++;
      } else if (month == 8) {
        sepcount++;
      } else if (month == 9) {
        octcount++;
      } else if (month == 10) {
        novcount++;
      } else if (month == 11) {
        deccount++;
      } else {
        unknowncount++;
      }
      


      circle.bindPopup("<b>Incident Date: </b>" + thedate);
      circle.on('click', CircleClick);
      
      function CircleClick(e) {
        var info = $("#victiminfo");
        var combinedinfo = 
        "<b>Victim's Name:</b> " + victimname + "<br>" +
        "<b>Age: </b>" + age + "<br>" +
        "<b>Gender: </b>" + victimgender + "<br>" +
        "<b>Location: </b>" + victimstate + ", " + victimcity +  "<br>" +
        "<b>Victim's Status: </b>" + victimstatus + "<br>" +
         "<b>Summary: </b>" + summary + "<br>" + 
         "<b>Source link: </b>" + "<a href=" + source + " target='_blank'>" + source + "</a>";
          
        info.html(combinedinfo);
      }
   });
      
      var monthstats = $("#monthstats")
      var combinedstats = 
      "<b style='font-size: 17px'>January: </b>" + jancount + " <br>" +
      "<b style='font-size: 17px'>February: </b>" + febcount + " <br>" +
      "<b style='font-size: 17px'>March: </b>" + marcount +  " <br>" +
      "<b style='font-size: 17px'>April: </b>" + aprcount +  " <br>" +
      "<b style='font-size: 17px'>May: </b>" + maycount + " <br>" +
      "<b style='font-size: 17px'>June: </b>" + juncount +  " <br>" +
      "<b style='font-size: 17px'>July: </b>" + julcount +  " <br>" +
      "<b style='font-size: 17px'>August: </b>" + augcount + " <br>" +
      "<b style='font-size: 17px'>September: </b>" + sepcount + " <br>" +
      "<b style='font-size: 17px'>October: </b>" + octcount +  " <br>" +
      "<b style='font-size: 17px'>November: </b>" + novcount + " <br>" +
      "<b style='font-size: 17px'>December: </b>" + deccount + " <br>" +
      "<b style='font-size: 17px'>Unknown months: </b>" + unknowncount;
      monthstats.html(combinedstats);
      

      var overlays = { 
        "Victim hit": victimhit,
        "Victim killed": victimkilled, 
        "All victims": victimall
      }

      L.control.layers(baselayers, overlays).addTo(map);
      victimall.addTo(map);
}


