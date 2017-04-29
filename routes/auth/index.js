var Auth = require('../../models/auth') //getting model
var bcrypt = require('bcrypt');
const saltRounds = 2;

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