// ../index.js

var express = require('express');
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var db = require("./models");
var passport = require("passport");
var session = require("cookie-session");
var sequelize = require("sequelize");

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







app.get("/", function (req, res) 
{
  //res.render('site/index.ejs');
   var user = req.user;
  //req.user is the user currently logged in
  if (user) 
  {
    res.redirect('/users/' + user.id);
    // var collections = [];  

    //  db.collection.findAll(
    //  {
    //     where: 
    //     {
    //       userId: req.user.id
    //     },
    //     include: [db.user]
    //   })
    //   .then(function(cols) 
    //   {
    //     console.log(cols);
    //   });

  } 
  
  else 
  {
    console.log("User signed out");
    res.render("site/index.ejs", {user: false});
  }    
  
});


app.post('/users', function(req,res)
{
  var user = req.body.user;

    db.user.createSecure(user.email, user.password, 
    function () 
    {
      res.redirect("/signup");
    },

    function (err, user) 
    {
      req.login(user, function()
      {

        db.user.find( {
          where : { id : req.user.id }

        })
        .then(function (user) {
          db.collection
        .create({name:"", userId: user.id})
        })
        .then (function() {
          res.redirect('/users/' + user.id);
        });

      });
    })
});

app.get("/users/:id", function (req, res) {
  var id = req.params.id;


  db.user.find(id)
    .then(function (user) {
      db.collection.findAll(
         where : { userId : id },
        {include: [db.user]}
      ).then(function(cols) 
      {

        if (cols.length > 0)
        {
          var counter = 0;
          var numCols = cols.length;

          cols.forEach(function (collection)
          {
            console.log(collection.name);
            console.log("in collection");

              db.card.findAll({
                where: {
                  collectionId : collection.id
                },
                include: [db.collection]

              })
              .then(function(cards) {
                  collections[counter] = 
                  new Collection(cards[0].collection.name, cards);

              })
              .then (function() {
                  counter += 1;

                  if (counter === numCols)
                  {
                    res.render("users/dashboard", { collections : collections});
                  }
              })

        });        

    })
    .error(function () {
      //res.redirect("/signup");
    })
});

app.get("/users/dashboard", function(req, res)
{
  console.log("Here");
   // db.card.findAll(
   //    {include: [db.collection]}
   //    ).then(function(cards) {
   //    console.log("Showing all books:",cards);
   //    cards.forEach(function (card) {
   //      console.log(new Array(51).join("*"));
   //      console.log(card.image);
   //    })
   //       // res.render("users/dashboard");

   //  });
});

// Authenticating a user
  var Collection = function(name, cards)
  {
    this.name = name;
    this.cards = cards;

  }



app.post('/cards/:id', function(req, res)
{

  request(apiUrls["showCardById"]+req.params.id, function (error, response, body) 
  {
    var user = req.user;
    console.log(user);
    if (user !== false || user !== 'undefined')
    {
    if (!error && response.statusCode == 200) 
    {
      var obj = JSON.parse(body);

      console.log("adding card");
      db.collection.find( {
        where : { userId : req.user.id },
        include : [db.user]
      })
      .then(function (collection) {
        db.card
      .create({image: obj[0].image, collectionId: collection.id})
      })
      .then (function() {
        console.log("In Cards id"); 
        res.redirect('/users/dashboard');
      });



    }
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

      res.render("cards/show", { card : obj[0]} );
    }
  });   
});


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

app.get("/contact", function(req, res)
{
  res.render("site/contact");
});











  //       if (cols.length > 0)
  //       {
  //         var counter = 0;
  //         var numCols = cols.length;

  //         cols.forEach(function (collection)
  //         {
  //           console.log(collection.name);
  //           console.log("in collection");

  //             db.card.findAll({
  //               where: {
  //                 collectionId : collection.id
  //               },
  //               include: [db.collection]

  //             })
  //             .then(function(cards) {
  //                 collections[counter] = 
  //                 new Collection(cards[0].collection.name, cards);

  //             })
  //             .then (function() {
  //                 counter += 1;

  //                 if (counter === numCols)
  //                 {
  //                   res.render("users/dashboard", { collections : collections});
  //                 }
  //             })

  //       });
  // }

  //   })

      //   console.log("# of collections: " + cols.length);
      //   for (var i = 0; i < cols.length; i += 1)
      //   {
      //     console.log("Collection " + (i+1) + " name: " + 
      //       cols[i].name);

      //     db.card.findAll({
      //       where: {
      //         collectionId : cols[i].id
      //       },
      //       include: [db.collection]

      //     })
      //     .then(function(cards) {
            
      //       for (var j = 0, k = cards.length;
      //         j < k; j += 1)
      //       {
      //         collections[i] = 
      //         new Collection(cards[j].collection.name, cards);

      //         console.log("i = " + i + " |||| col length: " + cols.length);
      //         console.log("k = " + k + " |||| k length: " + cards.length);
      //         if (i === cols.length && k === cards.length)
      //         {
      //           console.log("DONE");
      //         }
      //       }

      //     })
      //   }



      // for (var i =0; i<obj.length; i+=1) 
      // {
      //   (function (x) {
      //     request(apiUrls['showCardById']+ obj[i].id, function(err, response, body) {
      //       if (!err && response.statusCode === 200) {
      //         var card = JSON.parse(body);

      //         cardList[x] = card[0];
      //       }

      //       if (x === stop) {
      //           setTimeout(function() {
      //         res.render("cards/cardlist", {cardList: cardList});
      //         },500);             
      //       }
      //     })
      //   })(i);
      // }

        //res.render("users/dashboard", { cardList : collections});





    //    db.card.findAll({
    //       where: {
    //       collectionId: cols[i].id
        
    //   .then(function(cards) {

    //       console.log(cards);
    // }  )} 

    //   })
          




 // db.card
 //      .create({image: "img2", collectionId: 6})
 //      .then(function () {
 //          console.log("Successfully insert into collection");
         
 //      });      
  
      // console.log("User signed in");


      // db.collection.findAll(
      // {include: [db.user]}
      // ).then(function(cols) {
      //   for (var i = 0; i < cols.length; i += 1)
      //   {
      //     var name = cols[i].name;
      //     console.log(name);
      //     db.card.findAll(
      //       { include: [db.collection]}
      //       ). then(function(cards) {
      //         console.log()
      //           collections[i] = new Collection(name, cards);

      //       })
      //   }

      //   res.render("users/dashboard", { cardList : collections});
      // })

    // res.render('users/dashboard', 
    //   {
    //     user : req.user,
    //     collections : collections
    //   });

    
 // db.card.findAll(
 //      {include: [db.collection]}
 //      ).then(function(cards) {
 //      console.log("Showing all books:",cards);
 //      cards.forEach(function (card) {
 //        console.log(new Array(51).join("*"));
 //        console.log(card.image);
 //      })
 //         // res.render("users/dashboard");

 //    });    
  

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


db.sequelize.sync({force:true}).then(function() {
   app.listen(process.env.PORT || 3001);

   console.log("Listening on 3001");
});