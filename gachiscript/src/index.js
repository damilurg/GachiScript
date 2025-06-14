
const dictionary = require('./dictionary.js');
const reverseDictionary = require('./invertDict')(dictionary);
const replaceKeywords = require('./replaceKeywords.js');

function convertToGachi(code) {
  return replaceKeywords(code, dictionary)
}

function convertToTs(code) {
   return replaceKeywords(code, reverseDictionary)
}


module.exports = { convertToTs, convertToGachi };
