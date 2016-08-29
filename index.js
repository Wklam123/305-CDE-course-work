var express = require('express');
var app = express();
app.use(express.static('public'));
var jsrender = require('jsrender');
var request1 = require("request");
var bodyParser = require('body-parser');
var http = require ('http');
var cfenv = require('cfenv');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var mongoose = require("mongoose");
var db = mongoose.connection;
//mongodb://<dbuser>:<dbpassword>@ds017886.mlab.com:17886/weatherabcd


var url1 = 'mongodb://user2:12345@ds017886.mlab.com:17886/weatherabcd';
mongoose.connect('mongodb://user2:12345@ds017886.mlab.com:17886/weatherabcd',
function (err){
    if (err){
        console.log('connection error', err);

    }else{
        console.log('Connection established to', url1,'connect success !!');

        var url = "http://api.openweathermap.org/data/2.5/forecast?q=hong%20kong,hk&&appid=31538fe27dd36887159b09eb67838b37"

        //http://api.openweathermap.org/data/2.5/forecast?q=hong%20kong,hk&&appid=31538fe27dd36887159b09eb67838b37
		//c8d1e16fce9a81cb2c9df0ce0026a09a
		//31538fe27dd36887159b09eb67838b37

		app.get('/insert', function(req, res){
		//req.param('email'),




		var request = require("request")
		request({
		    url: url,
		    json: true
		}, function (error, response, body) {

		    if (!error && response.statusCode === 200) {
		        console.log(body)

		var data = {
		    name:body.name,
		    id:body.id,
		    cod:body.cod,
		    base:body.base,
		    weather:body.weather,
		    main:body.main,
		    visibility:body.visibility,
		    wind:body.wind,

		   //weather: response.body[0].main,
		};
		// Print the json response
		    }

		db.insert(data,null, function(err,body){
		    if(!err){
		        console.log('Insert completed');

		    }else{
		        console.log(err);
		    }
		});
		})
});

    }
});

/*



app.get('/get', function(req, res){
 test_db.view('ab', 'ab', function(err, body){
  if(!err){
   var rows = body.rows;
   //console.log(rows);
   res.setHeader('Content-Type', 'application/json');
   return res.send(rows);
  }
   console.log(err);
   return res.send(err);
  }
 );
});


var TodoSchema = new mongoose.Schema({
    name: String,
    completed: Boolean,
    note: String,
    updated_at: {type:Date, default: Date.now},
});

var Todo = mongoose.model('Todo', TodoSchema);
Todo.create({
    name: 'Demo Now',
    completed: true,
    note: 'Easy job'
}, function(err, todo){
    if(err)
        console.log(err);
    else
        console.log(todo);
});

var callback= function(err, data){
    if (err) return console.error(err);
    else
    console.log(data);
}
Todo.find(function(err, todos){
    if (err) return console.error(err);
    console.log(todos);
});

Todo.find({completed:true}, callback());

*/

app.get('/', function (request, response) {

	var tmpl = jsrender.templates('./views/start.html');
	var html = tmpl.render();
	response.send(html);
	response.end();

});
app.get('/app', function (request, response) {

	var tmpl = jsrender.templates('./views/form.html');
	var html = tmpl.render();
	response.send(html);
	response.end();

});
app.post('/', function (request, response) {

		var lat = request.body['object HTMLInputElement'][1];
		var lon = request.body['object HTMLInputElement'][0];
//api key using latitude and longtitude
		var url = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid=1867031257943895e9c93efec73a91be";



		request1({
		    url: url,
		    json: true
		}, function (error, response1, body) {


		    if (!error && response1.statusCode === 200) {
				var json = transform(body);
				console.log(json);
				var tmpl = jsrender.templates('./views/second.html');
				var html = tmpl.render({content : json});
				response.send(html);
				response.end();
		    }
		});
});

app.post('/app', function (request, response) {
	var city = request.body.city;


	var url = "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid=1867031257943895e9c93efec73a91be";

	request1({
	    url: url,
	    json: true
	}, function (error, response1, body) {


	    if (!error && response1.statusCode === 200) {
			var json = transform(body);
			console.log(json);
			var tmpl = jsrender.templates('./views/second.html');
			var html = tmpl.render({content : json});
			response.send(html);
			response.end();
	    }
	})

});
var appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});


var transform = function( body){
	console.log(body);
	var json ={};
json.name = body.city.name;
json.lon = body.city.coord.lon;
json.lat = body.city.coord.lat;
json.country = body.city.country;
var list = [];
body.list.forEach(function (o){
	 var temp ={};
	 temp=o;
	 temp.dt_txt = temp.dt_txt.substring(0,10);
	 list.push(temp);
});

//console.log(list);
function hash(o){
    return o.dt_txt;
}

var hashesFound = {};

list.forEach(function(o){
    hashesFound[hash(o)] = o;
})

var temp = Object.keys(hashesFound).map(function(k){
    return hashesFound[k];
})
list =[];
temp.forEach(function(o){
	var tmp = {};
	tmp.temp = ((o.main.temp - 273)+"").substring(0,4)+" °C";
	tmp.temp_min = ((o.main.temp_min- 273)+"").substring(0,4)+" °C";
	tmp.temp_max = ((o.main.temp_max- 273)+"").substring(0,4)+" °C";
	tmp.humidity = o.main.humidity + " %";
	tmp.weather = o.weather[0].main;
	tmp.desc = o.weather[0].description;
	tmp.icon = "http://openweathermap.org/img/w/"+o.weather[0].icon+".png";
	tmp.wind_speed = ((o.wind.speed*3.6)+"").substring(0,4)+" Km/H";
	tmp.wind_deg = (o.wind.deg+"").substring(0,4)+" °";
	tmp.date = o.dt_txt;
	var gsDayNames = new Array(
	  'Sunday',
	  'Monday',
	  'Tuesday',
	  'Wednesday',
	  'Thursday',
	  'Friday',
	  'Saturday'
	);

	var d = new Date(tmp.date);
	var dayName = gsDayNames[d.getDay()];
	tmp.day = dayName;


	list.push(tmp);
});
json.list = list;
return json ;


}
