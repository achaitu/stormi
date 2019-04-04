'use strict';
var express = require('express');
var http = require('http');
var request = require('request');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var deasync = require('deasync');
var server = require('http').createServer(app);

app.use(bodyParser.urlencoded({
   extended: false
}));

app.use(bodyParser.json());


var port_number = server.listen(process.env.PORT || 3000);
app.listen(port_number);

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
})


console.log('Server started');

app.post('/webhook',function(req,res){
  console.log('Received a post request');
  if(!req.body) return res.sendStatus(400);
  console.log('Here is the post request');
  console.log(req.body);
  console.log('Got geo parameters from dialog' + req.body.queryResult.parameters['geo-city']);
  var city = req.body.queryResult.parameters['geo-city'];
  console.log('city',city);
  var w = gettemp(city); 
  let response = " ";
  let responseObj = {"fulfillmentText":w,"fulfillmentMessages":[{"text":{"text":[w]}}]  ,"source":"" };
  console.log(responseObj);
  return res.json(responseObj);

  })

  var result;
  var apikey = 'd0cc67f8a917083b671dbff5518891ee';

  function gettemp(city) {
    result = undefined;
    
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    console.log(url);

    var req = request(url,function(err,response,body){
    var weather = JSON.parse(body);
    if(weather.message==='city not found'){
      result = 'unable to get weather '+ weather.message; 
    }
    else{
      var temp_celsius = round((weather.main.temp - 273.15),1);
      var maxtemp_celsius = round((weather.main.temp_max - 273.15),1);
      var mintemp_celsius = round((weather.main.temp_min - 273.15),1);
      result =  'Right now, it is '+ temp_celsius +'°C in '+city+' with ' + weather.weather[0].description +'. The projected maximum temperature for the day is '+ maxtemp_celsius +'°C with a minimum of '+ mintemp_celsius +'°C.'; 
    } 
    
    })

    while(result===undefined){
      require('deasync').runLoopOnce();
    }

    return result;
  }

  function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

