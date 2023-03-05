const endpoint =
  "https://transcribestreaming.region.amazonaws.com/stream-transcription";
const languageCode = "en-US"; // Replace with the desired language code
const sampleRate = 44100; // Replace with the sample rate of your audio stream

const headers = {
  "Content-Type": "application/vnd.amazon.eventstream",
  "X-Amz-Target": "com.amazonaws.transcribe.StartStreamTranscription",
  "X-Amz-Transcribe-Language-Code": languageCode,
  "X-Amz-Transcribe-Sample-Rate": sampleRate.toString(),
};

async function startStreamingTranscription(audioStream) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: audioStream,
  });

  // Process the response as needed
}

export default startStreamingTranscription;
