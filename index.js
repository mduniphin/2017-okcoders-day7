var restify = require('restify');
var server = restify.createServer();
server.use(restify.bodyParser());
var config = require('./config.js')();

const port = config.port //from config
var mongoose = require('mongoose');

var auth = require('./routes/auth');

mongoose.connect(config.mongodb);
var db = mongoose.connection;

db.on('error', function(msg) { //Hook for err
	console.log('Mongoose bit the dust;' + msg);
});

db.once('open', function() {
	console.log("Mongoose connection established.");
});

server.post('/user/add', auth.create); //add user and password
server.post('/user/login', auth.read); //login users

server.get('/', restify.serveStatic({ //serves up static webpage, restify method
	directory: './client',
	default: "index.html"
}));

server.get(/\/private\//, restify.serveStatic({
	directory: './client',
	file: 'private.html'
}));

server.listen(port, function() {
	console.log('%s listening on %s', server.name, port);
});
