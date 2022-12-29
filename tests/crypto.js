var CryptoJS = require('crypto-js');
var path = require('path');
require('dotenv').config({
  path: path.resolve(process.cwd(), '../.env'),
});
// console.log(CryptoJS.HmacSHA1('Message', 'Key'));
// console.log(CryptoJS.SHA1('Heyman'));
// console.log(CryptoJS.MD5('Heyman'));

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(
  JSON.stringify('heyman'),
  process.env.CRYPTO_JS_SECRET
).toString();

// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext, process.env.CRYPTO_JS_SECRET);
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

console.log(`Current directory: ${process.cwd()}`);
console.log(process.env.CRYPTO_JS_SECRET);
console.log(ciphertext);
console.log(decryptedData); // [{id: 1}, {id: 2}]
