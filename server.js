var express = require('express');
var app = express();

var Client = require('node-rest-client').Client;
client = new Client();

var apicache = require('apicache').options({ debug: true }).middleware;

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

/**************************************
* API Route
***************************************
* This has to be cached for 1 Min
*/
var apiRouter = express.Router(); //API Router

apiRouter.route('/:name')
	.get( apicache('1 minutes'), function (req, res) {

		//request to remote api
		var args = {};

		client.get('http://localhost:8086/remote/api/data',
			args, 
			function (data, response){
				data = JSON.parse(data);
				res.json(data);
			});

	});

app.use('/api/v1', apiRouter);

/**************************************
* Test Remote API Route
***************************************
*
*/

var remoteRouter = express.Router();
remoteRouter.route('/data')
	.get( function (req, res) {
		console.log('Hi! from Remote Server...');

		//request to remote api
		var args = {};

		client.get('http://localhost:8086/response.json',
			args, 
			function (data, response){
				res.json(data);
			});
	});

// Get Directory API List
remoteRouter.route('/directory')
	.get( function (req, res) {
		console.log('Getting API List');

		var args = {
			"headers" : {
				"Content-Type" : "application/json"
			}
		};

		client.get('https://affiliate-api.flipkart.net/affiliate/api/chetankan.json',
			args,
			function (data, response){
				
				var apiListings = data.apiGroups.affiliate.apiListings;
				var apiNames = Object.keys(apiListings);
				//res.send(data.title);

				apiNames.forEach( function(api) {
					console.log(apiListings[api].apiName);
					console.log(apiListings[api].availableVariants['v0.1.0'].get);
				});

				//console.log(apiNames);
				res.json(apiListings);
			});
	});
app.use('/remote/api', remoteRouter);


app.listen(port, function(){
	console.log('Server Started On Port : ', port );
});