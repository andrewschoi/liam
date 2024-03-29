import React, { useState, useEffect, useRef } from "react";
import Transcription from "@/lib/Transcription";

const { answerPrompt, provideSummary } = require("../lib/Requests");
const { removeNestedWords, delimitWords } = require("../lib/Processing");

const POLL_RATE = 120000; //ms to poll

export default function Home() {
  const [transcript, setTranscript] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [summary, setSummary] = useState([]);

  //needed to allow browser to capture audio
  const [isRecording, setIsRecording] = useState(false);

  const timerRef = useRef();
  const submitButtonRef = useRef();

  const transcriptRef = useRef([]);
  const summariesRef = useRef([]);

  useEffect(() => {
    transcriptRef.current = delimitWords(removeNestedWords(transcript), "");
    summariesRef.current = summary;
  }, [summary, transcript]);

  useEffect(() => {
    if (!isRecording) return;

    const transcriptionClient = new Transcription();
    transcriptionClient.startRecording("en-US", (res) =>
      setTranscript((prev) => [...prev, res])
    );

    // provide summary at every poll interval
    timerRef.current = setInterval(() => {
      provideSummary(transcriptRef.current, summariesRef.current).then(
        (res) => {
          setSummary((prev) => [...prev, res]);
        }
      );
    }, POLL_RATE);

    return () => {
      //clear interval
      clearTimeout(timerRef.current);
      timerRef.current = undefined;

      //destroy transcriptionClient
      transcriptionClient.stopRecording();
    };
  }, [isRecording]);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = () => {
    submitButtonRef.current.disabled = true;
    answerPrompt(transcript, question).then((res) => {
      setAnswer(res);
      submitButtonRef.current.disabled = false;
    });
  };

  return (
    <div>
      <div className="title-container">
        <h1 className="title-header">LIAM</h1>
        <h3 className="subtitle-header">Listening Integrated with AI Model</h3>
      </div>
      <main>
        <div>
          <div className="row-container">
            <div className="transcript-container">
              <div className="transcript-header">
                <h1 className="transcript-title">Transcript</h1>
                <button
                  className="begin-button"
                  onClick={() => setIsRecording(true)}
                >
                  Click to begin
                </button>
              </div>

              <div className="row-container">
                <p className="transcript-body">
                  {delimitWords(removeNestedWords(transcript), "").join(" ")}{" "}
                </p>
                {isRecording ? (
                  <div className="loader-container">
                    <div className="spinner"></div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="summary-container">
              <h1 className="summary-header">Summary</h1>
              <ul className="summary-list">
                {summary.map((point, i) => {
                  return (
                    <li className="summary-body" key={i}>
                      {point}
                    </li>
                  );
                })}
              </ul>
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
            <button
              ref={submitButtonRef}
              className="submit-button"
              onClick={handleSubmit}
            >
              Ask Question
            </button>
          </div>
        </div>
        <div className="footer">
          <p className="footer-text">Andrew Choi, Mason Bulling, Alex Giang</p>
        </div>
      </main>
    </div>
  );
}
