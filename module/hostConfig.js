var host 	= {};
host.name 	= "flipdeal.cloudno.de";
host.port 	= process.env.PORT || "9888";
host.url 	=  "http://" + host.name;

module.exports = host;