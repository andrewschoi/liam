const { Configuration, OpenAIApi } = require("openai");

const { createPrompt } = require("./Processing");

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

/**
 * Returns the result from openai language model given context and question
 * @param {string} context
 * @param {string} question
 */
const answerPrompt = async (context, question) => {
  const parameters = {
    model: "text-davinci-002",
    prompt: createPrompt(context, question),
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  const response = await openai.createCompletion(parameters);
  return response.data.choices[0].text;
};

const provideSummary = async (context) => {
  console.log("test");
};

module.exports = {
  answerPrompt,
  provideSummary,
};
