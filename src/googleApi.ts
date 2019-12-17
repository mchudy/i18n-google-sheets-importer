import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import readline from 'readline';

const GOOGLE_API_VERSION = 'v4';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

interface GoogleAPICredentials {
  installed: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

type GoogleAPICallback = (auth: OAuth2Client) => void;

export async function downloadSpreadsheet(
  auth: OAuth2Client,
  spreadsheetId: string,
  sheetName: string
) {
  const sheets = google.sheets({ version: GOOGLE_API_VERSION, auth });
  return await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetName,
  });
}

export function initGoogleAPI(credentialsPath: string, tokenPath: string, callback: GoogleAPICallback) {
  const rawCredentials = fs.readFileSync(credentialsPath, 'utf8');
  const credentials = JSON.parse(rawCredentials) as GoogleAPICredentials;
  authorize(credentials, tokenPath, callback);
}

function authorize(
  credentials: GoogleAPICredentials,
  tokenPath: string,
  callback: GoogleAPICallback
) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(tokenPath, 'utf8', (err, token) => {
    if (err) {
      return getNewToken(tokenPath, oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(tokenPath: string, oAuth2Client: OAuth2Client, callback: GoogleAPICallback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err || !token) {
        return console.error(
          'Error while trying to retrieve access token',
          err
        );
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(tokenPath, JSON.stringify(token), error => {
        if (error) {
          return console.error(error);
        }
        console.log('Token stored to', tokenPath);
      });
      callback(oAuth2Client);
    });
  });
}
