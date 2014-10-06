var express 	= require('express');
var apicache 	= require('apicache').options({ debug: true }).middleware;
var apiRouter 	= express.Router(); //API Router

apiRouter.route('/directory')
	.get( apicache('12 hours'), function (req, res) {
		var args = {} //no arguments 
		client.get('http://localhost:8086/remote/api/directory',
			args,
			function (data, response) {
				console.log('Get List from API Local');
				data = JSON.parse(data);
				res.json(data);
			});
	});

// Get API URL for individual item
apiRouter.route('/directory/:category_name')
	.get( apicache('3 hours'), function (req, res) {
		var category_name = req.params.category_name;
		client.get('http://localhost:8086/api/v1/directory', {},
			function (data, response) {
				data = JSON.parse(data);
				data.forEach( function (item) {
					if(item.name === category_name){
						res.json(item);
					}
				})
			});
	});


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




module.exports = apiRouter;