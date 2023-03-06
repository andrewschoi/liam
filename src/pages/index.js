import React, { useState, useEffect } from "react";
import Transcription from "@/lib/Transcription";

export default function Home() {
  const [transcript, setTranscript] = useState([]);
  useEffect(() => {
    const transcriptionClient = new Transcription();
    transcriptionClient.startRecording("en-US", (res) =>
      setTranscript((prev) => [...prev, res])
    );

    return () => transcriptionClient.stopRecording();
  }, []);
  return (
    <div>
      <div className="transcript-container">
        <h1 className="transcript-header">Transcript</h1>
        <p className="transcript-body">{transcript}</p>
      </div>
    </div>
  );
}
