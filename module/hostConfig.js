var host 	= {};
host.name 	= "localhost";
host.port 	= process.env.PORT || "9888";
host.url 	=  "http://" + host.name + ":" + host.port;

module.exports = host;