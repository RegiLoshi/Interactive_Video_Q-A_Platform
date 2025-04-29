import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const oauth2client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  oauth2client.setCredentials({refresh_token: process.env.GOOGLE_REFRESH_TOKEN});
  
  const drive = google.drive({
    version: 'v3',
    auth: oauth2client
  });

  export default drive;