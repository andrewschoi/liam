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
  if (context === []) return [];
  if (question === "") return [];

  const lastMessage = truncateWords(
    delimitWords(removeNestedWords(context), ""),
    150
  ).join(" ");

  const messageContext = [
    { role: "user", content: lastMessage },
    {
      role: "assistant",
      content: `answer the following question with this context to the best of your ability: ${question}`,
    },
  ];

  return messageContext;
};

/**
 * Creates a prompt that "effectively" uses the context and previous summaries
 * to generate summary
 * @param {string list} context
 * @param {string list} prevSummaries
 */
const summaryPrompt = (context, prevSummaries) => {
  if (context === []) {
    return [];
  }
  const lastMessage = truncateWords(
    delimitWords(removeNestedWords(context), ""),
    100
  ).join(" ");

  if (prevSummaries === [])
    return [
      { role: "user", content: lastMessage },
      {
        role: "assistant",
        content: "concisely summarize the above to the best of your ability",
      },
    ];

  const prevSummariesWithRoles = prevSummaries.map((summary) => ({
    role: "user",
    content: summary,
  }));

  const messageContext = [
    ...prevSummariesWithRoles,
    { role: "user", content: lastMessage },
    {
      role: "assistant",
      content: "concisely summarize the above to the best of your ability",
    },
  ];

  return messageContext;
};

module.exports = {
  removeNestedWords,
  delimitWords,
  truncateWords,
  createPrompt,
  summaryPrompt,
};
