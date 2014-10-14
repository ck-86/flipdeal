var express 	= require('express');
var compression = require('compression');
var app 		= express();
var Client 		= require('node-rest-client').Client;
var host 		= require('./module/hostConfig.js');
var cors 		= require('./module/cors.js');
var apiRouter 	= require('./module/apiRouter.js');

client = new Client();


/**************************************
* CORS Middleware
***************************************
* Allow all domain
*/
app.use(cors);

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
* Test Remote API Route
***************************************
*
*/
app.use('/api/v1', apiRouter);


app.listen(host.port, function(){
	console.log('Server Started On Port : ', host.port );
});