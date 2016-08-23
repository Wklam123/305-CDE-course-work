
var express = require('express');
var app = express();

var nano = require('nano')('http://localhost:5984');
var test_db = nano.db.use('demo');

app.get('/insert', function(req, res){
//req.param('email'),



var url = "http://api.openweathermap.org/data/2.5/weather?q=HongKong&appid=31538fe27dd36887159b09eb67838b37"
//c8d1e16fce9a81cb2c9df0ce0026a09a
//31538fe27dd36887159b09eb67838b37
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

test_db.insert(data,null, function(err,body){
    if(!err){
        console.log('Insert completed');

    }else{
        console.log(err);
    }
});
})
});


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


app.delete('/delete', function(req, res){

test_db.destroy('11', null, function(err, body) {
  if (!err)
    console.log('delete complete');
});



});
/*

app.get('/update', function(req, res){
test_db.update = function(obj,key, callback){
	var db= this;
	db.get(key, function(error, existing){
		if(!error)obj._rev=existing._rev;
		db.insert(obj, key,callback);
	});
}
var name = 'pikachu';
test_db.view('sample','by_name',{'key':name,'include_docs':true},function(select_err, select_body){
    if (!select_err){
        var doc_id = select_body.rows[0].id;
        var doc = select_body.rows[0].doc;
        doc.age = 99; // I add a new field, you can change any existing field docs.[fieldname]
        test_db.update(doc, doc_id, function(err,res){
            if (!err){
                console.log("Document updated");

            }else{
                console.log(err);
            }
            });

        }else{
            console.log(select_err);
        }
    });

*/

app.listen(8081);


