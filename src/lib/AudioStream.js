const getAudioStream = (handler) => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true }) //request user microphone
      .then((stream) => {
        const audioContext = new AudioContext();
        const sourceNode = audioContext.createMediaStreamSource(stream);
        const scriptProcessorNode = audioContext.createScriptProcessor(
          4096, //process audio data in real time
          1,
          1
        );

        //listen for audio events, extract from event object
        scriptProcessorNode.addEventListener("audioprocess", (event) => {
          const inputBuffer = event.inputBuffer;
          const channelData = inputBuffer.getChannelData(0);
          handler(channelData);
        });

        sourceNode.connect(scriptProcessorNode);
        scriptProcessorNode.connect(audioContext.destination);

        stream.onended = () => {
          console.log("stopped audio capture");
          resolve();
        };
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default getAudioStream;
