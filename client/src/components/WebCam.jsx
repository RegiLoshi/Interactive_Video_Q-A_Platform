import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { BsRecordCircle, BsStopCircle, BsPauseCircle, BsPlayCircle, BsUpload } from 'react-icons/bs';

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

    const handleUpload = useCallback(() => {
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
      <div className="w-full flex flex-col items-center space-y-4">
        <Webcam 
          audio={true} 
          ref={webcamRef} 
          className='w-full rounded-lg border-2 border-[#101726] shadow-lg ' 
        />
        
        <div className="flex justify-center items-center space-x-4 mt-4">
          {capturing ? (
            <button
              type="button"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md"
              onClick={handleStopCaptureClick}
            >
              <BsStopCircle className="text-xl" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="button"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#101726] text-white rounded-lg hover:bg-[#1c2a43] transition-all duration-200 shadow-md"
              onClick={handleStartCaptureClick}
            >
              <BsRecordCircle className="text-xl text-red-500 animate-pulse" />
              <span>Record</span>
            </button>
          )}

          {capturing && (
            <button
              type="button"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#101726] text-white rounded-lg hover:bg-[#1c2a43] transition-all duration-200 shadow-md"
              onClick={paused ? handleResumeCaptureClick : handlePauseCaptureClick}
            >
              {paused ? (
                <>
                  <BsPlayCircle className="text-xl" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <BsPauseCircle className="text-xl" />
                  <span>Pause</span>
                </>
              )}
            </button>
          )}

          {recordedChunks.length > 0 && (
            <button
              type="button"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md"
              onClick={handleUpload}
            >
              <BsUpload className="text-xl" />
              <span>Upload</span>
            </button>
          )}
        </div>
      </div>
    );
};

export default WebcamStreamCapture;

  