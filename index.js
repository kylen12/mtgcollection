var express = require('express');
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));

// Set up an object that stores the different query urls
var apiUrls =
{
	showCards : "http://api.mtgapi.com/v1/card/name/",
	showCardById : "http://api.mtgapi.com/v1/card/id/",
	showSets: "http://api.mtgapi.com/v2/sets",
	showCardsInSet: "http://api.mtgapi.com/v2/sets?code="
};




app.get('/', function (req, res) {
  res.render('index.ejs');
})



app.post('/cards/', function(req,res)
{
	var card = req.body.card;

	request(apiUrls["showCards"]+card.name, function (error, response, body) 
	{
		if (!error && response.statusCode == 200) 
		{
			var obj = JSON.parse(body);
			//console.log(obj);
			
			res.render("cards/index", { cardList : obj} );
		}
	});		
});




app.get('/cards/:id', function(req, res)
{
	request(apiUrls["showCardById"]+req.params.id, function (error, response, body) 
	{
		if (!error && response.statusCode == 200) 
		{
			var obj = JSON.parse(body);
			//console.log(obj);

			res.render("cards/show", { card : obj[0]} );
		}
	});		
});








// Start the server
var server = app.listen(3001, function () 
{

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})