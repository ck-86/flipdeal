var express = require('express');
var compression = require('compression');
var app 	= express();
var Client 	= require('node-rest-client').Client;
client = new Client();

var host = require('./module/hostConfig.js');

var apiRouter = require('./module/apiRouter.js');

/**************************************
* Compress (Gzip)
***************************************
* zip every response
*/
app.use(compression());

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
	client.get(host.url + 'api/v1/directory', args,
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
* Test Remote API Route
***************************************
*
*/
app.use('/api/v1', apiRouter);


app.listen(host.port, function(){
	console.log('Server Started On Port : ', host.port );
});