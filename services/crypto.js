var crypto 	= module.require("crypto");
var uuid 	= require('node-uuid');

exports.encrypt = function( buffer ) {
	var cipher = crypto.createCipher("aes192", "pass");
	var msg = [];
	msg.push( cipher.update(buffer, "binary", "base64") );
	msg.push( cipher.final("base64") );
	var foo = msg.join("");
	return foo;
}
exports.makeUUID = function () {
	return uuid.v1();
}
exports.decrypt = function( foo ){
	var decipher = crypto.createDecipher("aes192", "pass");
	msg2 = [];
	msg2.push(decipher.update(foo, "base64", "binary"));
	msg2.push(decipher.final("binary"));
	var toReturn = msg2.join("");
	return toReturn;
}
exports.makeHash = function( buffer ){
	var hash = crypto.createHash("sha256").update(buffer).digest("hex");
	return hash;
}

exports.chopString = function( inputString, chunkSize ){
	var re = new RegExp("(.{1,"+chunkSize+"})", "g");
	var result = inputString.match(re);
	return result;
}
