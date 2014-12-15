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

// Set up an object that stores the different query urls
var apiUrls =
{
	showCards : "http://api.mtgapi.com/v1/card/name/",
	showCardById : "http://api.mtgapi.com/v1/card/id/",
	showSets: "http://api.mtgapi.com/v2/sets",
	showCardsInSet: "http://api.mtgapi.com/v2/sets?code="
};

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

passport.serializeUser(function(user, done) 
{
	console.log("Serialized");
	done(null,user.id);
});

passport.deserializeUser(function(id, done) 
{
	console.log("Deserialized");

	db.user.find ({ where: { id: id } })
	.then(function(user) { done(null,user); },
	function(err) { done(err,null); }
	);
});




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
	// pulls data from the api db based on search query

	// redirects to cards/show with card list

	var card = req.body.card;

	request(apiUrls["showCards"]+card.name, function (error, response, body) 
	{
		if (!error && response.statusCode == 200) 
		{
			var obj = JSON.parse(body);
			console.log(obj[0].id);
			
			request(apiUrls["showCardById"]+obj[0].id, function (error, response, body) 
			{
				if (!error && response.statusCode == 200) 
				{
					var obj = JSON.parse(body);

		// console.log(obj.id);
		// console.log(obj.name);
		// console.log(obj.image);

					console.log(obj[0].image);
					//res.render("cards/cardList", { cardList : obj} );
				}
			});		

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

app.post('/news', function(req,res) 
{
  var article = req.body.article;

  db.article.create 
  ({ 
    title: article.title, 
    summary: article.summary, 
    content: article.content, 
    imgurl: article.imgurl    
  })
    .then(function(article) {
    res.redirect("/news/" + article.id);
  });  
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