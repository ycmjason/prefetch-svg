module.exports = async (str, regex, aReplacer) => {
  regex = new RegExp(regex, 'g')
  const replacedParts = []
  let match
  let i = 0
  while ((match = regex.exec(str)) !== null) {
    // put non matching string
    replacedParts.push(str.slice(i, match.index))
    // call the async replacer function with the matched array spreaded
    replacedParts.push(aReplacer(...match))
    i = regex.lastIndex
  }

  // put the rest of str
  replacedParts.push(str.slice(i))

  // wait for aReplacer calls to finish and join them back into string
  return (await Promise.all(replacedParts)).join('')
};
