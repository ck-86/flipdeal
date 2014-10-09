var express = require('express');
var apiRouter = express.Router();
var host = require('./hostConfig.js'); //Host Configuration
var apicache = require('apicache').options({
    debug: true
}).middleware;


var blacklistedItems = [
    'bags_wallets_belts',
    'fragrances',
    'tv_video_accessories',
    'camera_accessories',
    'sports_fitness',
    'mobile_accessories',
    'software',
    'televisions',
    'computer_storage',
    'stationery_office_supplies',
    'video_players',
    'household',
    'tablets',
    'kids_footwear',
    'sunglasses',
    'air_coolers',
    'music_movies_posters',
    'desktops',
    'gaming',
    'home_decor',
    'microwave_ovens',
    'laptop_accessories',
    'tablet_accessories',
    'grooming_beauty_wellness',
    'kitchen_appliances',
    'cameras',
    'home_improvement_tools',
    'landline_phones',
    'network_components',
    'laptops',
    'luggage_travel',
    'home_entertainment',
    'air_conditioners',
    'computer_peripherals',
    'audio_players',
    'home_furnishing',
    'baby_care',
    'e_learning',
    'toys',
    'home_appliances',
    'computer_components'
];

//
apiRouter.route('/data')
    .get(function(req, res) {
        console.log('Hi! from Remote Server...');

        //request to remote api
        var args = {};

        client.get('http://localhost:8086/response.json',
            args,
            function(data, response) {
                res.json(data);
            });
    });



// Get Directory API List
apiRouter.route('/directory')
    .get(apicache('12 hours'), function(req, res) {
        var args = {
            "headers": {
                "Content-Type": "application/json"
            }
        };

        client.get('https://affiliate-api.flipkart.net/affiliate/api/chetankan.json',
            args,
            function(data, response) {

                var apiListings = data.apiGroups.affiliate.apiListings;
                var apiNames = Object.keys(apiListings);
                //res.send(data.title);

                var directoryList = [];

                apiNames.forEach(function(api) {
                    var category = {};
                    category.name = apiListings[api].apiName;
                    category.url = apiListings[api].availableVariants['v0.1.0'].get;

                    blacklistedItems.forEach(function(item) {
                        if (category.name === item) {
                            category = {}; //RESET
                        }
                    })

                    //if object has property then push
                    if (Object.keys(category).length > 0) {
                        directoryList.push(category);
                    }

                });

                //console.log(apiNames);
                res.json(directoryList);
            });
    });

// Get API URL for individual item
apiRouter.route('/directory/:category_name')
    .get(apicache('1 hours'), function(req, res) {

        var category_name = req.params.category_name;

        client.get(host.url + '/api/v1/directory', {},
            function(data, response) {
                data = JSON.parse(data);
                data.forEach(function(item) {
                    if (item.name === category_name) {
                        res.json(item);
                    }
                })
            });
    });


//Get Products List
apiRouter.route('/products')
    .get(apicache('12 hours'), function(req, res) {
        var args = {};

        client.get(host.url + '/api/v1/directory', args,
            function(data, response) {
                var items = {"products":[]};
                data = JSON.parse(data);

                data.forEach( function(product) {
                    items.products.push(product.name);
                });

                res.json(items);
            });
    });

// Get all products in specified category
apiRouter.route('/products/:category_name')
    .get(apicache('1 hours'), function(req, res) {
        var category_name = req.params.category_name;
        var url = '';

        client.get(host.url + '/api/v1/directory/' + category_name, {},
            function(data, response) {
                data = JSON.parse(data);
                url = data.url;

                args = {
                    "headers": {
                        "Content-Type": "application/json",
                        "Fk-Affiliate-Token": "2b0731fd6d9e4f1da517236f53d3c5a2",
                        "Fk-Affiliate-Id": "chetankan",
                        "Accept-Encoding": "gzip"
                    }
                };

                client.get(url, args, function(data, response) {
                    res.json(data);
                });
            });
    });

//Get products via pagination
apiRouter.route('/products/:category_name/:page_number')
    .get(apicache('1 hours'), function(req, res) {
        var category_name = req.params.category_name;
        var page_number = req.params.page_number;
        var url = host.url + '/api/v1/products/' + category_name;
        var args = {};

        client.get(url, args, function(data, response) {
            page_number = (page_number - 1) * 10;
            data = JSON.parse(data);
            result = data.productInfoList.splice(page_number, 10);
            res.json(result);
        });
    });


module.exports = apiRouter;
