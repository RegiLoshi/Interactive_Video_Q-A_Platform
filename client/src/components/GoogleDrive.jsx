import React, { useState, useEffect } from 'react';

const GoogleDriveApp = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = "http://localhost:5173";
  const scope = "https://www.googleapis.com/auth/drive.file";
  
  // Generate the OAuth URL manually instead of using googleapis library
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&access_type=offline&prompt=consent`;
  
  const [authCode, setAuthCode] = useState(null);
  
  // Check for auth code in URL when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      setAuthCode(code);
      // You'll need to exchange this code for tokens via your backend
    }
  }, []);
  
  const handleExchangeCode = async () => {
    if (!authCode) return;
    
    // This part should be done on your backend server
    // In a real app, you would call your backend API here
    alert(`Got authorization code: ${authCode}\nIn a real app, you would send this to your backend to exchange for tokens.`);
  };
  
  return (
    <div className="p-4">
      {!authCode ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Google Drive Integration</h2>
          <p className="mb-4">Click the button below to authenticate with Google Drive:</p>
          <a 
            href={authUrl} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Authenticate with Google
          </a>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Authentication Successful!</h2>
          <p className="mb-4">Authorization code received: {authCode.substring(0, 10)}...</p>
          <button 
            onClick={handleExchangeCode}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Exchange Code for Tokens
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleDriveApp;