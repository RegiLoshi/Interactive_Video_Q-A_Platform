import { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { BsRecordCircle, BsStopCircle, BsPauseCircle, BsPlayCircle, BsUpload, BsTrash, BsDownload } from 'react-icons/bs';

const WebcamStreamCapture = ({step = 0, setStep = () => {}, onVideoCapture}) => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const uploadLocalVideoRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [paused, setPaused] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [videoUploaded, setVideoUploaded] = useState(false);
    const [video, setVideo] = useState();
    const [stream, setStream] = useState(null);
    const [minTimeReached, setMinTimeReached] = useState(false);
    const [cameraPermission, setCameraPermission] = useState('prompt');
    const [permissionError, setPermissionError] = useState(null);

    useEffect(() => {

        const checkCameraPermission = async () => {
            try {
                if ('permissions' in navigator) {
                    const permissionStatus = await navigator.permissions.query({ name: 'camera' });
                    setCameraPermission(permissionStatus.state);

                    permissionStatus.addEventListener('change', () => {
                        setCameraPermission(permissionStatus.state);
                        if (permissionStatus.state === 'granted') {
                            initializeStream();
                        }
                    });
                }
            } catch (error) {
                console.error('Error checking camera permission:', error);
            }
        };

        checkCameraPermission();
    }, []);

    const initializeStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true,
                audio: true 
            });
            setStream(stream);
            setPermissionError(null);
        } catch (err) {
            console.error("Error accessing webcam:", err);
            setPermissionError(err.message);
            setCameraPermission('denied');
        }
    };

    // Initialize webcam stream when component mounts
    useEffect(() => {
        if (cameraPermission === 'granted') {
            initializeStream();
        }

          // Cleanup function to stop all tracks when component unmounts
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraPermission]);
  
    const handleStartCaptureClick = useCallback(() => {
        if (!stream) {
            console.error("No stream available");
            return;
        }

        try {
            setRecordedChunks([]);
            setCapturing(true);
            setMinTimeReached(false);
            
            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: "video/mp4" // Using mp4 since its supported for most browsers
            });

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    setRecordedChunks(prev => {
                        const newChunks = [...prev, event.data];
                        // Check if we've reached minimum recording time (2 chunks)
                        if (newChunks.length >= 2 && !minTimeReached) {
                            setMinTimeReached(true);
                        }
                        return newChunks;
                    });
                }
            };

            mediaRecorderRef.current.start(500);
        } catch (err) {
            console.error("Error starting recording:", err);
            setCapturing(false);
        }
    }, [stream, setCapturing, minTimeReached]);
  
    const handleStopCaptureClick = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setCapturing(false);
            
            const blob = new Blob(recordedChunks, { 
                type: "video/mp4" 
            });
            setVideo(blob);
            setVideoUploaded(true);
            setStep(step + 1);
            // Pass the video blob back to parent
            if (onVideoCapture) {
                onVideoCapture(blob);
            }
        }
    }, [recordedChunks, onVideoCapture]);

    const handlePauseCaptureClick = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
            setPaused(true);
        }
    }, []);

    const handleResumeCaptureClick = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
            setPaused(false);
        }
    }, []);


    const handleLocalVideoUpload = useCallback(() => {
      uploadLocalVideoRef.current.click();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setVideo(file);
            setVideoUploaded(true);
            setStep(step + 1);
            // Pass the file back to parent
            if (onVideoCapture) {
                onVideoCapture(file);
            }
        }
    };

    const handleDownload = useCallback(() => {
        if (video) {
            const url = URL.createObjectURL(video);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "recorded-answer-video.webm";
            a.click();
        }
    }, [video]);

    return (
      <div className="w-full flex flex-col items-center space-y-4">
        <input
          type="file"
          ref={uploadLocalVideoRef}
          onChange={handleFileChange}
          accept="video/*"
          className="hidden"
        />
        
        {cameraPermission === 'granted' ? (
          <Webcam 
            audio={true} 
            ref={webcamRef} 
            className='w-full rounded-lg border-2 border-[#101726] shadow-lg' 
          />
        ) : (
          <div className="w-full h-[400px] rounded-lg border-2 border-[#101726] shadow-lg flex items-center justify-center bg-gray-100">
            <div className="text-center">
              {cameraPermission === 'denied' ? (
                <>
                  <p className="text-red-600 mb-4">Camera access is denied</p>
                  <p className="text-sm text-gray-600 mb-4">Please enable camera access in your browser settings</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Reload Page
                  </button>
                </>
              ) : (
                <>
                  <p className="text-yellow-600 mb-4">Camera access required</p>
                  <p className="text-sm text-gray-600">Please allow camera access to continue</p>
                </>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-center items-center space-x-4 mt-4">
          {!videoUploaded ? (
            <>
              {capturing ? (
                <button
                  type="button"
                  className={`flex items-center justify-center space-x-2 px-6 py-3 ${
                    minTimeReached 
                      ? "bg-red-500 hover:bg-red-600" 
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white rounded-lg transition-all duration-200 shadow-md`}
                  onClick={handleStopCaptureClick}
                  disabled={!minTimeReached}
                >
                  <BsStopCircle className="text-xl" />
                  <span>{minTimeReached ? "Stop" : "Recording..."}</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#101726] text-white rounded-lg hover:bg-[#1c2a43] transition-all duration-200 shadow-md"
                  onClick={handleStartCaptureClick}
                  disabled={!stream || cameraPermission !== 'granted'}
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
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <video 
                src={URL.createObjectURL(video)} 
                controls 
                className="w-full rounded-lg border-2 border-[#101726] shadow-lg"
              />
              <div className='flex items-center justify-center space-x-4'>
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md"
                  onClick={() => {
                    setVideo(null);
                    setVideoUploaded(false);
                    setStep(step - 1);
                  }}
                >
                  <BsTrash className="text-xl" />
                  <span>Remove</span>
                </button>

              {(recordedChunks.length > 0 && minTimeReached && video)&& (
            <button
              type="button"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md"
              onClick={handleDownload}
            >
              <BsDownload className="text-xl" />
              <span>Download</span>
            </button>
          )}
            </div>
            </div>
          )}
          {(!videoUploaded && !capturing) && (
          <button
            type="button"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#101726] text-white rounded-lg hover:bg-[#1c2a43] transition-all duration-200 shadow-md"
            onClick={handleLocalVideoUpload}
          >
            <BsUpload className="text-xl" />
            <span>Upload local video</span>
          </button>
          )}
        </div>
      </div>
    );
};

export default WebcamStreamCapture;

  