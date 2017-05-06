function _development(){
	return {
		"mongodb": "mongodb://localhost/testing3", //development address
		"port": 8088
	}
}

function _production(){
	if (!process.env.NODE_PASSWORD){
		throw new Error("MISSING PASSWORD");
	}
	return {
		"mongodb": "mongodb://localhost/production", //production address
		"password": process.env.NODE_PASSWORD,
		"port": 9000	//can be different port
	}
}

module.exports = function(){
	switch(process.env.NODE_ENV){
		case 'development':
			return _development();
		case 'production':  //will need NODE_PASSWORD="X" NODE_ENV='productiom' npm start
			return _production();
		default:
			return _development();
	}
}