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
      if (!/^\s*$/.test(subword)) {
        flattenedList.push(subword);
      }
    }
  }
  return flattenedList;
};

/**
 * Returns a list st. every word that ends with a non-alphanumeric
 * character is succeeded by element char. If an element in a punctuation
 * character on its own, combine with with the last element
 * @param {string list} wordList
 * @param {string} char
 */
const delimitWords = (wordList, char) => {
  const delimitList = [];
  let prevWord = "";

  for (let i = 0; i < wordList.length; i++) {
    const word = wordList[i];
    if (/^\W+$/.test(word)) {
      //word is punctuation char
      if (prevWord === "") {
        delimitList.push(word);
      } else {
        delimitList[delimitList.length - 1].concat(word);
      }
    } else {
      //word is not punctuation char
      if (/\W$/.test(prevWord)) {
        //prev word ends with non-alphanumeric char
        delimitList.push(char);
      }
      delimitList.push(word);
    }
    prevWord = word;
  }
  return delimitList;
};

/**
 * Returns the last {limit} characters from wordList
 * @param {string list} wordList
 */
const truncateWords = (wordList, limit) => {
  truncateList = [];
  for (let i = 0; i < wordList.length; i++) {
    const word = wordList[i];
    if (word.length <= limit) {
      truncateList.push(word);
    } else {
      truncateList.push(word.slice(-limit));
    }
  }
  return truncateList;
};

/**
 * Creates a prompt that "effectively" uses the context to answer a question
 * @param {string list} context
 * @param {string} question
 */
export const createPrompt = (context, question) => {
  const flatten = removedNestedWords(context);
  const delimit = delimitWords(flatten);
  const editedList = truncateWords(delimit, 10);

  const promptStart = editedList.join(" ");
  const promptEnd = question.trim();
  const prompt = "Here is context for a person or people speaking:" + `\n\n${promptStart}\n\n${"End of context."}\n\n${promptEnd}?\n`;

  return prompt
};
export default createPrompt;
