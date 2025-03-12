import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';


const WebcamStreamCapture = () => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [paused, setPaused] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);

    const handleDataAvailable = useCallback(
        ({ data }) => {
          if (data.size > 0) {
            setRecordedChunks((prev) => prev.concat(data));
          }
        },
        [setRecordedChunks]
      );
  
    const handleStartCaptureClick = useCallback(() => {
      setRecordedChunks([]);
      setCapturing(true);
      
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/mp4" // i decide to use mp4 because it's more compatible with most browsers
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable", // this event is triggered when the media recorder has a new chunk of data available
        handleDataAvailable // this function is called when the media recorder has a new chunk of data available
      );
      mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);
  
  
    const handleStopCaptureClick = useCallback(() => {
      mediaRecorderRef.current.stop();
      setCapturing(false);
    }, [mediaRecorderRef, setCapturing]);

    const handlePauseCaptureClick = useCallback(() => {
        mediaRecorderRef.current.pause();
        setPaused(true);
    }, [mediaRecorderRef]);

    const handleResumeCaptureClick = useCallback(() => {
        mediaRecorderRef.current.resume();
        setPaused(false);
    }, [mediaRecorderRef]);

    const handleDownload = useCallback(() => {
      if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
           type: "video/mp4"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "react-webcam-stream-capture.webm";
        a.click();
        window.URL.revokeObjectURL(url);
        setRecordedChunks([]);
      }
    }, [recordedChunks]);


  
    return (
      <>
        <Webcam audio={false} ref={webcamRef} />
        {capturing ? (
          <button onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Start Capture</button>
        )}
        {capturing && ( paused == false 
        ? <button onClick={handlePauseCaptureClick}>Pause Capture</button>
        : <button onClick={handleResumeCaptureClick}>Resume Capture</button>
        )}
        {recordedChunks.length > 0 && (
          <button onClick={handleDownload}>Download</button>
        )}
      </>
    );
  };


    export default WebcamStreamCapture;

  