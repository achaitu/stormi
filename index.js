'use strict';
var express = require('express');
var http = require('http');
var request = require('request');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
var server = require('http').createServer(app);

var port_number = server.listen(process.env.PORT || 3000);
app.listen(port_number);

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  var city = 'delhi';
  console.log('city',city);
  var apikey = 'd0cc67f8a917083b671dbff5518891ee';
  var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
  request(url,function(error,responseurl,bodyurl){
    var weather_json = JSON.parse(bodyurl);
    var weather = {
      city : city,
      temperature :weather_json.main.temp,
      description :weather_json.weather[0].description
    }
    console.log(weather);

  })
  
});


console.log('Server started');

app.post('/webook',function(req,res){
  console.log('Received a post request');
  if(!req.body) return res.sendStatus(400);
  console.log('Here is the post request');
  console.log(req.body);
  console.log('Got geo parameters from dialog' + req.body.queryResult.parameters['geo-city']);
  var city = req.body.queryResult.parameters['geo-city'];
  console.log('city',city);
  var w = gettemp(city); 
  let response = " ";
  let responseObj = {"fulfillmentText":respons,"fulfillmentMessages":[{"text":{"text":[w]}}]  ,"source":"" };
  //agent.add('url is '+url);

  //agent.add('it is 'weather.main.temp);
  console.log(responseObj);
  return response.json(responseObj);

  })

  var result;
  var apikey = 'd0cc67f8a917083b671dbff5518891ee';
  // var weather= {'temperature': 30};
  function cb(err,response,body) {
    
    var weather = JSON.parse(body);
    if(weather.message==='city not found'){
      result = 'unable to get weather '+ weather.message; 
    }
    else{
      result =  'right now, it is '+ weather.main.temp+'degress with' + weather.weather[0].description; 
    }
  }

  function gettemp(city) {
    result = undefined;
    
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    console.log(url);
    var req = request(url,cb);
    while(result===undefined){
      require('deasync').runLoopOnce();
    }
    return result;
  }
