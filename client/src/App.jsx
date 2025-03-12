import './App.css'

import React from "react";
import Webcam from "react-webcam";
import WebcamStreamCapture from './components/WebCamTest';
import GoogleDriveApp from './components/GoogleDrive';
function App() {

  return (
    <>
      {/* <WebcamStreamCapture /> */}
      <GoogleDriveApp />
    </>
  )
}

export default App
