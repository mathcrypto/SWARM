
var express = require('express');
var fs = require('fs');
var solc = require('solc');
var randomstring = require("randomstring");
var router = express.Router();
var cryptojs = require("crypto-js");
var sha256 = require("crypto-js/sha256");
var multer = require('multer');
var upload = multer({
	dest: 'uploads/'
});
var ENS = require('ethereum-ens');
var Web3 = require('web3');
var web3 = new Web3();
var ens = new ENS(web3, '0x4ed3fd9a0a22e2dc68340d803aed6a1b2ebe5a04');
//var publicResolver = web3.eth.contract(abi).at(alreadyDeployedContractAddress);

web3.setProvider(new web3.providers.HttpProvider("http://192.168.1.104:8545"));
var address = ens.resolver('tessilab.eth').addr();

var SHA3 = require('keccak');
var swarm = require("swarm-js").at("http://192.168.1.104:8500");

var contract = fs.readFileSync("solidity/ProofExist2.sol").toString("utf-8");
var compiled = web3.eth.compile.solidity(contract);
var code = compiled.code;
var abi = compiled.info.abiDefinition;
var myContract = web3.eth.contract(abi);
var owner = web3.eth.coinbase;
web3.eth.defaultAccount = owner;
var balance = web3.eth.getBalance(owner);


var count = web3.eth.getTransactionCount(owner);
router.post('/', upload.single('file'), function(req, res, next) {
	console.log("req body: \n" + JSON.stringify(req.body));
	console.log("req file: \n" + JSON.stringify(req.file));
	fs.readFile(req.file.path, function(err, data) {
		if (err) {
			res.status(500).send('ko');
			return;
		}
		


var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = randomstring.generate(8);
 
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
 
var hw = encrypt(new Buffer(data, "utf8"));
console.log(hw);


swarm.upload(new Buffer(hw)).then( 
	function(value) {
		console.log(value);
		var filehash = value;

console.log("Unlocking owner account");
		//Deploy a new contract to the blockchain

		var myNewContract = myContract.new({
				from: web3.eth.defaultAccount,
				data: code,
				gas: '4700000'
			},

			function(err, contract) {

				console.log(err, contract);
				if (typeof contract.address !== 'undefined') {
					console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
				}

				//Use an existing contract address that was deployed previously
				var alreadyDeployedContractAddress = "0x06a0afd16ae72f7a1fb3bdef6404268d89a86d6f";
				var contr = web3.eth.contract(abi).at(alreadyDeployedContractAddress);
				//var contr = web3.eth.contract(abi).at(contract.address);
				console.log(contr.address);


				//If the contract address was not of undefined type, we call functions inside 

				if (typeof alreadyDeployedContractAddress !== 'undefined') {
					console.log(contr.documentExists(sha256(cryptojs.enc.Hex.parse(data.toString('hex', 0, data.length))).toString(cryptojs.enc.Hex)));
					//check if the digital print of the document already exists
					if (contr.documentExists(sha256(cryptojs.enc.Hex.parse(data.toString('hex', 0, data.length))).toString(cryptojs.enc.Hex))!== true) {


						//if not we create a new one
						console.log('new contract hash:' + contr.newDocument(sha256(cryptojs.enc.Hex.parse(data.toString('hex', 0, data.length))).toString(cryptojs.enc.Hex)));



						var newdoc = contr.newDocument(sha256(cryptojs.enc.Hex.parse(data.toString('hex', 0, data.length))).toString(cryptojs.enc.Hex));
						// we hash the transaction resulted from new print creation
						var hash = web3.sha3(newdoc);
						//we sign this hash with using our private key with ecdsa algorithm
						var sig = web3.eth.sign(owner, hash).slice(2);
						//we recover parameters of the signature r, s and v
						var r = "0x" + sig.slice(0, 64);
						var s = "0x" + sig.slice(64, 128);
						var v = sig.slice(128);
						if (sig.slice(128) == '00') {
							v = 27;
						} else {
							if (sig.slice(128) == '01') {
								v = 28;
							}
						}
						console.log('r is' + r + 's' + s + 'v' + v);



						var log = contr.recover(hash, v, r, s);
						console.log(contr.recover(hash, v, r, s));

						//Get the receipt of the transaction resulted from deploying a new print on the blockchain


						var receipt = web3.eth.getTransactionReceipt(newdoc);
						console.log(receipt);
						//recover the block timestamp and make it in UTC form
						var blockNumber = parseInt(receipt.blockNumber);
						var date = web3.eth.getBlock(blockNumber).timestamp;
						var date1 = new Date(date * 1000);
						console.log(date1.toUTCString());

					
	res.setHeader('Content-Disposition', 'attachment; filename=receipt.txt');
								res.setHeader('Content-type', 'text/plain');
								res.charset = 'utf-8';
				res.write(JSON.stringify({transactionHash : receipt.transactionHash, transactionIndex : receipt.transactionIndex, blockNumber : receipt.blockNumber, contractAddress : alreadyDeployedContractAddress, tessiAccount: owner, creationTimestamp: date1.toUTCString(), deployementSignature: sig, Key: password, SwarmHash: filehash}, null, 11));
				res.end();

						/*res.render('receipt', {
							'download': JSON.stringify({
								transactionHash: receipt.transactionHash,
								transactionIndex: receipt.transactionIndex,
								blockNumber: receipt.blockNumber,
								contractAddress: alreadyDeployedContractAddress,
								tessiAccount: owner,
								creationTimestamp: date1.toUTCString(),
								deployementSignature: sig,
								UrlSwarm: "localhost:8500/bzzr:/filehash",
							
							}, null, 9)
						});*/
					


					} else {
						// in case digital print already exists, we return this answer to the client
						//res.send(web3.eth.getTransactionsByAccount(owner));

						res.render('response', {
							'creation': 'The digital print of this document already exists on the blockchain'
						});

		



					}
				}
			});


});



});
});


module.exports = router;
	
