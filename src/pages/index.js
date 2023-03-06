import React, { useState, useEffect, useRef } from "react";
import Transcription from "@/lib/Transcription";

const { answerPrompt, provideSummary } = require("../lib/Requests");
const { removeNestedWords, delimitWords } = require("../lib/Processing");

const POLL_RATE = 1000; //ms to poll

export default function Home() {
  const [transcript, setTranscript] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [summary, setSummary] = useState([]);

  //needed to allow browser to capture audio
  const [clickEvent, setClickEvent] = useState(false);

  const timerRef = useRef();
  useEffect(() => {
    if (!clickEvent) return;

    const transcriptionClient = new Transcription();
    transcriptionClient.startRecording("en-US", (res) =>
      setTranscript((prev) => [...prev, res])
    );

    // provide summary at every poll interval
    timerRef.current = setInterval(() => {
      provideSummary(transcript).then((res) =>
        setSummary((prev) => [...prev, res])
      );
    }, POLL_RATE);

    return () => {
      //clear interval
      clearTimeout(timerRef.current);
      timerRef.current = undefined;

      //destroy transcriptionClient
      transcriptionClient.stopRecording();
    };
  }, [clickEvent]);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = () => {
    answerPrompt(transcript, question).then((res) => setAnswer(res));
  };
  return (
    <div>
      <div className="row-container">
        <div className="transcript-container">
          <h1 className="transcript-header">Transcript</h1>
          <button className="begin-button" onClick={() => setClickEvent(true)}>
            Click to begin
          </button>
          <p className="transcript-body">
            {delimitWords(removeNestedWords(transcript), " | ").join(" ")}
          </p>
        </div>

        <div className="summary-container">
          <h1 className="summary-header">Summary</h1>
          <p className="summary-body">{summary}</p>
        </div>
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
