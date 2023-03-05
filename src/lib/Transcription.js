import { Buffer } from "buffer";
const {
  TranscribeStreamingClient,
} = require("@aws-sdk/client-transcribe-streaming");
const MicrophoneStream = require("microphone-stream");

class Transcription {
  constructor() {
    this.sampleRate = 44100;
    this.microphoneStream = undefined;
    this.transcribeClient = undefined;
    this.createTranscribeClient();
    this.createMicrophoneStream();
    this.getAudioStream();
  }

  getAudioStream = async function* () {
    for await (const chunk of this.microphoneStream) {
      if (chunk.length <= this.sampleRate) {
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
    if (this.microphoneStream) {
      this.microphoneStream.stop();
      this.microphoneStream.destroy();
      this.microphoneStream = undefined;
    }
    if (this.transcribeClient) {
      this.transcribeClient.destroy();
      this.transcribeClient = undefined;
    }
  };

  createTranscribeClient = () => {
    this.transcribeClient = new TranscribeStreamingClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: "AKIASYSAF2CEXQTBPF63",
        secretAccessKey: "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",
      },
    });
  };

  createMicrophoneStream = async () => {
    this.microphoneStream = new MicrophoneStream.default();
    this.microphoneStream.setStream(
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
      MediaSampleRateHertz: sampleRate,
      AudioStream: getAudioStream(),
    });
    const data = await this.transcribeClient.send(command);
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
