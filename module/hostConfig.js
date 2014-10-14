var host 	= {};
host.name 	= "localhost";
host.port 	= process.env.PORT || "80";
host.url 	= "http://" + host.name;
module.exports = host;