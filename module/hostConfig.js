var host 	= {};
host.name 	= "flipdeal.cloudno.de";
host.port 	= process.env.PORT || "9888";
host.url 	=  "http://" + host.name + ":" + host.port;

module.exports = host;