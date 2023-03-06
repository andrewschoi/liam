import React, { useState, useEffect } from "react";
import Transcription from "@/lib/Transcription";

const { answerPrompt } = require("../lib/Requests");
const { removeNestedWords, delimitWords } = require("../lib/Processing");

export default function Home() {
  const [transcript, setTranscript] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [summary, setSummary] = useState([]);

  //needed to allow browser to capture audio
  const [clickEvent, setClickEvent] = useState(false);

  useEffect(() => {
    if (!clickEvent) return;

    const transcriptionClient = new Transcription();
    transcriptionClient.startRecording("en-US", (res) =>
      setTranscript((prev) => [...prev, res])
    );

    return () => transcriptionClient.stopRecording();
  }, [clickEvent]);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = () => {
    textComplete(transcript, question).then((res) => setAnswer(res));
  };
  return (
    <div>
      <div className="transcript-container">
        <h1 className="transcript-header">Transcript</h1>
        <button onClick={() => setClickEvent(true)}>Click to begin</button>
        <p className="transcript-body">
          {delimitWords(removeNestedWords(transcript), " | ").join(" ")}
        </p>
      </div>

      <div>
        <h1 className="summary-header">Summary</h1>
        <p className="summary-body">{summary}</p>
      </div>

      <div className="answer-container">
        <h1 className="answer-header">Answer</h1>
        <p className="answer-body">{answer}</p>
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
