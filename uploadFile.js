var express = require('express');
var fs = require('fs');
var router = express.Router();
var multer = require('multer');
var upload = multer({
	dest: 'uploads/'
});

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://192.168.1.104:8545"));
var swarm = require("swarm-js").at("http://192.168.1.104:8500");
router.post('/', upload.single('file'), function(req, res, next) {
	console.log("req body: \n" + JSON.stringify(req.body));
	console.log("req file: \n" + JSON.stringify(req.file));
	fs.readFile(req.file.path, function(err, data) {
		if (err) {
			res.status(500).send('ko');
			return;
		}
		swarm.upload(new Buffer(data)).then( 
	function(value) {
		console.log(value);
		var filehash = value;
		swarm.download(filehash).then( function (buffer) {
	//console.log(buffer.toString());

	res.setHeader('Content-Disposition', 'attachment; filename=myFile.pdf');
								res.setHeader('Content-type', 'pdf');
								res.charset = 'utf-8';
								
		              res.write(buffer);
				res.end();
});
	});
	


 
    // Closes the Swarm process. 

});
	
});



module.exports = router;
