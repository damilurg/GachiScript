const fs = require('fs');
const { convertToGachi, convertToTs } = require('../src/index');

const code = fs.readFileSync('example.ts', 'utf-8');
const result = convertToGachi(code);

console.log(result);

const backToTsCode = convertToTs(result);

console.log(backToTsCode)
