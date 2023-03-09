const { Configuration, OpenAIApi } = require("openai");

const { createPrompt, summaryPrompt } = require("./Processing");

const API_KEY = "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";
const configuration = new Configuration({
  apiKey: API_KEY,
});

const openai = new OpenAIApi(configuration);

/**
 * Returns the result from openai language model given context and question
 * @param {string} context
 * @param {string} question
 */
const answerPrompt = async (context, question) => {
  if (question.length < 1) {
    return "";
  }
  const messageContext = createPrompt(context, question);

  const response = await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messageContext,
    })
    .then((response) => response.data.choices[0].message.content)
    .catch((e) => {
      return "[error] could not answer this question";
    });

  return response;
};

const provideSummary = async (context, prevSummaries) => {
  const messageContext = summaryPrompt(context, prevSummaries);

  if (messageContext === []) return "";

  const response = await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messageContext,
    })
    .then((response) => response.data.choices[0].message.content)
    .catch((e) => {
      return "[error] could not capture last audio context";
    });

  return response;
};

module.exports = {
  answerPrompt,
  provideSummary,
};
