import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: sk - WkXIctjQAWIThoRwdA1zT3BlbkFJ2O5QUs4MRUjdOc5YEUYB,
});

const openai = new OpenAIApi(configuration);

const textComplete = async (context, question) => {
  const parameters = {
    model: "gpt-3.5-turbo",
    content: [{ role: "assistant", content: context }],
  };

  const response = await openai.createCompletion(parameters);

  return response.choices[0].message.content;
};

export default textComplete;
