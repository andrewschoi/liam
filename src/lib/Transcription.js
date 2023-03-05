import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import { Buffer } from "buffer";
import MicrophoneStream from "microphone-stream";

class Transcription {
  constructor() {
    this.SAMPLE_RATE = 44100;
    this.microphoneStream = undefined;
    this.transcribeClient = undefined;
  }

  getAudioStream = async function* () {
    for await (const chunk of microphoneStream) {
      if (chunk.length <= SAMPLE_RATE) {
        yield {
          AudioEvent: {
            AudioChunk: encodePCMChunk(chunk),
          },
        };
      }
    }
  };

  encodePCMChunk = (chunk) => {
    const input = MicrophoneStream.default.toRaw(chunk);
    let offset = 0;
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return Buffer.from(buffer);
  };

  stopRecording = function () {
    if (microphoneStream) {
      microphoneStream.stop();
      microphoneStream.destroy();
      microphoneStream = undefined;
    }
    if (transcribeClient) {
      transcribeClient.destroy();
      transcribeClient = undefined;
    }
  };

  createTranscribeClient = () => {
    transcribeClient = new TranscribeStreamingClient({
      region: awsID.REGION,
      credentials: {
        accessKeyId: "YOUR_ACCESS_KEY_ID",
        secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
      },
    });
  };

  createMicrophoneStream = async () => {
    microphoneStream = new MicrophoneStream.default();
    microphoneStream.setStream(
      await window.navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      })
    );
  };

  startStreaming = async (language, callback) => {
    const command = new StartStreamTranscriptionCommand({
      LanguageCode: language,
      MediaEncoding: "pcm",
      MediaSampleRateHertz: SAMPLE_RATE,
      AudioStream: getAudioStream(),
    });
    const data = await transcribeClient.send(command);
    for await (const event of data.TranscriptResultStream) {
      for (const result of event.TranscriptEvent.Transcript.Results || []) {
        if (result.IsPartial === false) {
          const noOfResults = result.Alternatives[0].Items.length;
          for (let i = 0; i < noOfResults; i++) {
            console.log(result.Alternatives[0].Items[i].Content);
            callback(result.Alternatives[0].Items[i].Content + " ");
          }
        }
      }
    }
  };
}

export default Transcription;
