
var express = require('express');
var fs = require('fs');
var router = express.Router();
var multer = require('multer');
var upload = multer({
dest: 'uploads/'
});
var cryptojs = require("crypto-js");
var sha256 = require("crypto-js/sha256");
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://192.168.1.104:8545"));
var swarm = require("swarm-js").at("http://192.168.1.104:8500");
router.post('/', upload.single('swarm'), function(req, res, next) {
console.log("req body: \n" + JSON.stringify(req.body));
console.log("req file: \n" + JSON.stringify(req.file));
fs.readFile(req.file.path,'utf-8', function(err, content) {
if (err) {
res.status(500).send('ko');
return;
}

var Key = content.substring(content.indexOf("Key") + "Key".length, content.indexOf("SwarmHash"));
						         Key = Key.slice(4, 12).toString();

  var filehash = content.substring(content.indexOf("SwarmHash") + "SwarmHash".length, content.indexOf("}"));
  filehash = filehash.slice(4, 68).toString();

console.log("filehash is" + filehash);


swarm.download(filehash).then( function (file) {
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = Key;
 
function encrypt(buffer){
  var cipher = crypto.createCipher(algorithm,password);
  var crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
  return crypted;
}
 
function decrypt(buffer){
  var decipher = crypto.createDecipher(algorithm,password);
  var dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
  return dec;
}
var Hash = decrypt(file);
//console.log(buffer.toString());
res.setHeader('Content-Disposition', 'attachment; filename=myFile.pdf');
res.setHeader('Content-type', 'pdf');
res.charset = 'utf-8';
res.write(Hash);
res.end();
});

});
// Closes the Swarm process.

});
module.exports = router;
