var Auth = require('../../models/auth') //getting model
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../../config.js')();

const saltRounds = 2; //rounds of Bcrypt

var getToken = function(user){
	var date = ( Date.now() / 1000 ); // Date.now() return the epoch time in milliseconds
	var exp = date + (60 * 120) //two hour expiration time
	return jwt.sign({	//pass in secret from config.js
		user: user._id,
		iat: date,
		exp: exp
	}, config.secret); 
}

exports.create = function(req, res, next){ //creating model
	var auth = new Auth();
	var user = req.body.username;
	var pass = req.body.password;

	if(!user || !pass){ //check for username and password
		res.send(404, "Username or password missing");
		return next();
	}

	bcrypt.hash(pass, saltRounds, function(err, hash){
		if(err){
			console.log(err);
			res.send(404);
		} 	else {
		  	auth.username = user;
		  	auth.password = hash;
		  	auth.date = new Date();
	      	auth.is_active = true;

	      	auth.save(function(err, data){
				if(err){
					console.log("Error saving to db: " + err);
					res.send(404, "Error with database");
				} 	else {
				  	res.json(201, {status: "success"}); //if saved
				}
			});
			return next();
		}			
	});
}

exports.read = function(req, res, next){
	var user = req.body.username; //does not send URL info, must use POST command
	var pass = req.body.password;

	if(!user || !pass){ //check for username and password
		res.send(404, "Username or password missing");
		return next();
	}
	Auth.findOne({username: user, is_active: true}).exec(function(err,data){ //we findone and pass data
		if(!data){ 
			res.send(400, {status: "failed", reason: "Invalid user account"});
			return next();
		}	

		bcrypt.compare(pass, data.password, function(err, status){//lookup salt value and number of rounds
			if (status === false) {
				res.send(400, {status: "failed", reason: "Invalid Password"});
				return next();
			}
			res.send(200, {status:"success", token: getToken(data)});  //pass jwt for future request
			return next();
		}); 
	});
}

exports.verify = function(req, res, next){ 
	var token = req.header('authorization');

	if(!token){
		console.log("no authorization header value");
		res.json(404, {status: "failed", reason:"user needs to login"});
	} else {
		jwt.verify(token, config.secret, function(err, decoded){
			if(err){
				console.log(err);
				res.json(404, {status: "failed", reason:"JWT is not valid"});
			} else {
				Auth.findOne({_id: decoded.user, is_active:true}).exec(function(err2, data){
					if(err2){
						console.log(err2);
						res.json(404, {status: "failed", reason:"Not a valid user"});
					} else {
						return next();
					}
				});
			}
	  });
	}
}