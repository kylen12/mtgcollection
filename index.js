// ../index.js

var express = require('express');
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var db = require("./models");
var passport = require("passport");
var session = require("cookie-session");

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));

/*
  What is the session?

  It is the object that lives in our app
    and records relevant info about users
    who are signed in
*/
app.use(session( {
  secret: 'thisismysecretkey',
  name: 'chocolate chip',
  // this is in milliseconds
  maxage: 3600000
  })
);

// get passport started
app.use(passport.initialize());
app.use(passport.session());

/*
SERIALizING
Turns relevant user data into a string to be 
  stored as a cookie
*/
passport.serializeUser(function(user, done){
  console.log("SERIALIZED JUST RAN!");

  done(null, user.id);
});

/*
DeSERIALizing

Taking a string and turns into an object
  using the relevant data stored in the session
*/
passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN!");
  db.user.find({
      where: {
        id: id
      }
    })
    .then(function(user){
      done(null, user);
    },
    function(err) {
      done(err, null);
    });
});



var apiUrls =
{
        showCards : "http://api.mtgapi.com/v1/card/name/",
        showCardById : "http://api.mtgapi.com/v1/card/id/",
        showSets: "http://api.mtgapi.com/v2/sets",
        showCardsInSet: "http://api.mtgapi.com/v2/sets?code="
};

// When someone searches for a card
app.post("/search", function (req, res) 
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

app.post('/cards/:id', function(req, res)
{
	request(apiUrls["showCardById"]+req.params.id, function (error, response, body) 
	{
		if (!error && response.statusCode == 200) 
		{
			var obj = JSON.parse(body);
			//console.log(obj[0]);

			// Add Card to DB
			// Redirect to users library
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

app.post('/users', function(req,res)
{
  console.log("POST /users");
  var newUser = req.body.user;
  console.log("New User:", newUser);
  //CREATE a user and secure their password
  db.user.createSecure(newUser.email, newUser.password, 
    function () {
      // if a user fails to create make them signup again
      res.redirect("/signup");
    },
    function (err, user) {
      // when successfully created log the user in
      // req.login is given by the passport
      req.login(user, function(){
        // after login redirect show page
        console.log("Id: ", user.id)
        res.redirect('/users/' + user.id);
      });
    })
});

app.get("/users/:id", function (req, res) {
  var id = req.params.id;
  db.user.find(id)
    .then(function (user) {
      res.render("users/dashboard", {user: user});
    })
    .error(function () {
      res.redirect("/signup");
    })
});

// Authenticating a user
app.get("/", function (req, res) {
  // req.user is the user currently logged in
  console.log(req.user);
  if (req.user) {
    console.log("User signed in");
    res.render("users/dashboard", {user: req.user});
  } else {
    console.log("User signed out");
    res.render("site/index.ejs", {user: false});
  }
});

// WHEN SOMEONE WANTS THE SIGNUP PAGE
app.get("/signup", function (req, res) {
  res.render("users/signup");
});

app.post("/login", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// When someone wants the login page
app.get("/login", function (req, res) {
  res.render("users/login");
});

app.get("/logout", function (req, res) {
  // log out
  req.logout();
  res.redirect("/");
});


// Start the server
var server = app.listen(3001, function () 
{

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})