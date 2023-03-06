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
 * Returns an updated list st. every isolated punctuation element is combined
 * with its preceding element
 * @param {string list} wordList
 */
export const delimitWords = (wordList) => {};

export default removeNestedWords;
