/**
 * Returns a "flattened" list, list whose elements contain no spaces and
 * "nested" elements with spaces are separated into distinct elements,
 * preserving order
 * @param {string list} wordList
 */

const removeNestedWords = (wordList) => {
  const flattenedList = [];
  for (let i = 0; i < wordList.length; i++) {
    const word = wordList[i];
    const subwords = word.split(" ");
    for (let j = 0; j < subwords.length; j++) {
      const subword = subwords[j];
      flattenedList.push(subword);
    }
  }
  return flattenedList;
};

/**
 * Returns a modified list st. every word that ends with a non-alphanumeric
 * character is succeeded by element char
 * @param {string list} wordList
 * @param {string} char
 */
export const delimitWords = (wordList, char) => {
  const delimitList = [];
  for (let i = 0; i < wordList.length; i++) {
    const word = wordList[i];
    delimitList.push(word);
    if (/\W$/.test(word)) {
      delimitList.push(char);
    }
  }
  return delimitList;
};

export default removeNestedWords;
