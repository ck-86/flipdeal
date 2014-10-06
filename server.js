var express = require('express');
var app 	= express();

var Client = require('node-rest-client').Client;
client = new Client();

var apiRouter	 = require('./module/apiRouter.js');
var remoteRouter = require('./module/remoteRouter.js');

var port = process.env.PORT || 8086;


/**************************************
* Static Folder
***************************************
*
*/
app.use(express.static(__dirname + '/public'));

/**************************************
* Application Route
***************************************
*
*/
app.get('/app', function (req,res) {
	res.send("Hello World");
});

app.get('/all', function (req, res) {

	var args = {}; //No arguments for client
	client.get('http://localhost:8086/api/v1/directory', args,
		function (data, response) {
			data = JSON.parse(data);

			var list = '';

			data.forEach( function (item) {
				list = list + '<li>' + item.name + '</li>';
			});

			res.send('<ul>'+list+'</ul>');
		});

	//res.send("Show all categories...");
});

/**************************************
* API Route
***************************************
* This has to be cached for 1 Min
*/
app.use('/api/v1', apiRouter);

/**************************************
* Test Remote API Route
***************************************
*
*/
app.use('/remote/api', remoteRouter);


app.listen(port, function(){
	console.log('Server Started On Port : ', port );
});