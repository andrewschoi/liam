import React, { useState, useEffect } from "react";
import Transcription from "@/lib/Transcription";

export default function Home() {
  const [transcript, setTranscript] = useState([]);
  const [question, setQuestion] = useState("");

  // useEffect(() => {
  //   const transcriptionClient = new Transcription();
  //   transcriptionClient.startRecording("en-US", (res) =>
  //     setTranscript((prev) => [...prev, res])
  //   );

  //   return () => transcriptionClient.stopRecording();
  // }, []);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = () => {};
  return (
    <div>
      <div className="transcript-container">
        <h1 className="transcript-header">Transcript</h1>
        <p className="transcript-body">{transcript}</p>
      </div>

      <div className="question-container">
        <input
          className="question-field"
          placeholder="ask questions..."
          onChange={(e) => handleQuestionChange(e)}
        />
        <button className="submit-button" onClick={handleSubmit}>
          Ask Question
        </button>
      </div>
    </div>
  );
}
