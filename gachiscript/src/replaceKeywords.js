const esprima = require('esprima');

function replaceKeywords(code, dict) {
  const tokens = esprima.tokenize(code, {
    tolerant: true,
    range: true
  });

  let result = '';
  let lastIndex = 0;

  for (const token of tokens) {
    result += code.slice(lastIndex, token.range[0]);

    if ((token.type === 'Keyword'
         || token.type === 'Punctuator'
         || token.type === 'Identifier')
        && dict[token.value]) {
      result += dict[token.value];
    } else {
      result += token.value;
    }

    lastIndex = token.range[1];
  }

  result += code.slice(lastIndex);
  return result;
}

module.exports = replaceKeywords;
