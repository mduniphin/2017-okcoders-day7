var restify = require('restify');
var server = restify.createServer();
server.use(restify.bodyParser());
const port = 8088;

var auth = require('./routes/auth');

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

server.post('/user/add', auth.create);
server.get('/', restify.serveStatic({ //serves up static webpage, restify method
	directory: './client',
	default: "index.html"
}));

server.listen(port, function() {
	console.log('%s listening on %s', server.name, port);
});
