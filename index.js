// ../index.js

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

app.post('/login', function(req,res)
{
	// displays the login webpage
	res.render('users/login');
});

app.post('/signup', function(req,res)
{
	// displays the sign up webpage
	res.render('users/signup');	
});


app.post('/authenticate/signup', function(req, res)
{
	// validate if information is legit

	// create a new user

	// redirect user to users/dashboard
});


app.post('/authenticate/login', function(req, res)
{
	// validate if input is acceptable

	// checks if user exists
		// if user does not exist, redirect to login page with msg
		// if user exists, redirect to user/dashboard
});


app.post('/search', function(req,res)
{
	// pulls card from the api db based on search query
	// pulls card information from card id
	// redirects to cards/show with cardList

	var card = req.body.card;
	var cardList = [];
	
	request(apiUrls["showCards"]+card.name, function (error, response, body) 
	{
		if (!error && response.statusCode == 200) 
		{	
			var obj = JSON.parse(body);
			var stop = obj.length-1;
			for (var i =0; i<obj.length; i+=1) 
			{
				(function (x) {
					request(apiUrls['showCardById']+ obj[i].id, function(err, response, body) {
						if (!err && response.statusCode === 200) {
							var card = JSON.parse(body);

							cardList[x] = card[0];
						}

						if (x === stop) {
						    setTimeout(function() {
							res.render("cards/cardlist", {cardList: cardList});
						  },500);							
						}
					})
				})(i);
			}
		}
	});		
});



app.post("/users", function (req, res) {
  console.log("POST /users");
  var newUser = req.body.user;
  console.log("New User:", newUser);
  db.user.createSecure(newUser.email, newUser.password, 
    function () {
      res.redirect("/signup");
    },
    function (err, user) {
      req.login(user, function(){
        console.log("Id: ", user.id)
        res.redirect('/users/' + user.id);
      });



    }
  )
});

// app.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login'
// }));


app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});


app.get("/users", function (req, res) {
  console.log(req.user)
  if (req.user) {
    res.render("users/index", {user: req.user});
  } else {
    res.render("users/index", {user: false});
  }
});


app.get('/', function (req, res) {
  res.render('site/index.ejs');
})



app.post('/cards/', function(req,res)
{
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