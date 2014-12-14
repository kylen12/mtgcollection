var express = require('express');
var app = express();




/*	***************************  */
/*		Initialize annyang       */
/*	***************************	 */

var Annyang = require('annyang');
var annyang = new Annyang();

if (annyang) 
{
  var commands = {
    'say hello' : function() 
    {
        console.log("Hello");
    }
  };

  annyang.init(commands);

}


app.get('/', function (req, res) {
  res.render('index.ejs');
})












// Start the server
var server = app.listen(3001, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})