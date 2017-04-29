var restify = require('restify');
var server = restify.createServer();
var port = 8088;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testing3');
var db = mongoose.connection;
//Hook for err
db.on('error', function(msg) {
	console.log('Mongoose bit the dust;' + msg);
});

db.once('open', function() {
	console.log("Mongoose connection established.");
});
//serves up static webpage, restify method
server.get('/', restify.serveStatic({
	directory: './client',
	default: "index.html"
}));

server.listen(port, function() {
	console.log('%s listening on %s', server.name, port);
});
