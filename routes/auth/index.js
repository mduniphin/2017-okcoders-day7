var Auth = require('../../models/auth') //getting model
//creating model
exports.create = function(req, res, next){
	var auth = new Auth();
	auth.username = req.params.username;
	auth.password = req.params.password;
	auth.date = new Date();
	auth.is_active = true;

	auth.save(function(err, data){
		if(err){
			console.log("Error saving to db: " + err);
			res.send(404, "Error with database");
		} else {
			res.json(201, {status: "success"}); //if saved
		}
		return next();
	});
}