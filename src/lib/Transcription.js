import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";

class Transcription {
  constructor() {
    this.transcriptionClient = undefined;
  }

  startStream() {
    this.transcriptionClient = new TranscribeStreamingClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: "YOUR_ACCESS_KEY_ID",
        secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
      },
    });
  }

  stopStream() {
    this.transcriptionClient.destroy();
    if (this.transcriptionClient) {
      this.transcriptionClient = undefined;
    }
  }
}
