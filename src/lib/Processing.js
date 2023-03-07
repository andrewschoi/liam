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
  const alphanumeric =
    "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBN";
  let stack = [];
  while (wordList.length > 0) {
    const elem = wordList.shift();
    if (elem.length == 1 && !alphanumeric.includes(elem[0])) {
      stack.push(stack.pop() + elem[0]);
      stack.push(char);
    } else if (!alphanumeric.includes(elem[elem.length - 1])) {
      stack.push(elem);
      stack.push(char);
    } else {
      stack.push(elem);
    }
  }

  return stack;
};

/**
 * Returns the last [limit] words from wordList
 * @param {string list} wordList
 */
const truncateWords = (wordList, limit) => {
  if (limit == 0) {
    return [];
  }
  return wordList.slice(-limit);
};

/**
 * Creates a prompt that "effectively" uses the context to answer a question
 * @param {string list} context
 * @param {string} question
 */
const createPrompt = (context, question) => {
  const flatten = removeNestedWords(context);
  const editedList = truncateWords(flatten, 100);

  const promptStart = editedList.join(" ");
  const promptEnd = question.trim();
  const prompt =
    "Here is context for a person or people speaking:" +
    `\n\n${promptStart}\n\n${"End of context."}\n\n${promptEnd}?\n`;

  return prompt;
};

/**
 * Creates a prompt that "effectively" uses the context to generate summary
 * @param {string list} context
 */
const summaryPrompt = (context) => {
  const truncatedContext = truncateWords(removeNestedWords(context), 100).join(
    " "
  );
  const prompt =
    "Here is context for a person or people speaking:" +
    `\n\n${truncatedContext}\n\n${"End of context."}\n\n${"Provide a summary"}\n`;

  return prompt;
};

module.exports = {
  removeNestedWords,
  delimitWords,
  truncateWords,
  createPrompt,
  summaryPrompt,
};
