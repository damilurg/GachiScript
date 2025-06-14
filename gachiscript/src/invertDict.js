function invertDict(dict) {
  const inverted = {};
  for (const key in dict) {
    if (dict.hasOwnProperty(key)) {
      inverted[dict[key]] = key;
    }
  }
  return inverted;
}

module.exports = invertDict;