import React, { useState, useEffect } from "react";

import getAudioStream from "@/lib/AudioStream";
export default function Home() {
  useEffect(() => {
    getAudioStream();
  }, []);

  return <div></div>;
}
