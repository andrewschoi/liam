import React, { useState, useEffect } from "react";

import getAudioStream from "@/lib/AudioStream";
export default function Home() {
  const [audioBuffer, setAudioBuffer] = useState([]);

  const handleAudioChange = (pcm) => {
    setAudioBuffer(pcm);
  };

  useEffect(() => {
    getAudioStream(handleAudioChange);
  }, []);

  return <div>{audioBuffer}</div>;
}
