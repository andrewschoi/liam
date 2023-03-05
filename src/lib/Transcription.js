import AWS from "aws-sdk";

const getTranscription = () => {
  const transcribeservice = new AWS.TranscribeService({
    apiVersion: "2017-10-26",
  });

  transcribeservice.createCallAnalyticsCategory(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });
  return transcribeservice;
};

export default getTranscription;
