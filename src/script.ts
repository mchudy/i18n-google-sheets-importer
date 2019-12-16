const encoding = require('encoding');
const Papa = require('papaparse');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const flatten = require('flat');
const { google } = require('googleapis');
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const GOOGLE_CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const TRANSLATIONS_CSV_FILE_PATH = path.join(__dirname, '../translations.csv');
const TRANSLATIONS_JSON_FOLDER_PATH = path.join(
  __dirname,
  '../src/translations'
);
const SPREADSHEET_ID = process.env.TRANSLATIONS_SPREADSHEET_ID;
const SHEET_NAME = 'FE';

run(process.argv);

function importTranslationsFromSpreadsheet(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
    },
    (err, res) => {
      if (err) {
        return console.error(`The API returned an error: ${err}`);
      }
      const rows = res.data.values;
      if (!rows.length) {
        return console.error('No data found in the spreadsheet');
      }

      const header = rows[0];
      const languages = header.slice(1);

      const data = rows.slice(1).map(row => {
        const result = {
          id: row[0],
        };
        for (let i = 0; i < languages.length; i += 1) {
          result[languages[i]] = row[i + 1] || '';
        }
        return result;
      });

      generateJSONs(languages, data);
    }
  );
}

function generateCSV() {
  let translationFileNames = fs
    .readdirSync(TRANSLATIONS_JSON_FOLDER_PATH)
    .filter(file => file.endsWith('.json') && file !== 'package.json');
  translationFileNames = _.reverse(translationFileNames);

  const translationFiles = translationFileNames
    .map(file => {
      const rawData = fs.readFileSync(
        path.join(TRANSLATIONS_JSON_FOLDER_PATH, file)
      );
      return JSON.parse(rawData);
    })
    .map(flatten);

  const keys = _.uniq(_.flatten(translationFiles.map(Object.keys)));
  keys.sort();

  const languageKeys = translationFileNames.map(name => name.substr(0, 2));
  const output = Papa.unparse(
    {
      fields: ['id', ...languageKeys],
      data: keys.map(key => [key, ...translationFiles.map(file => file[key])]),
    },
    {
      quotes: true,
      delimiter: ',',
    }
  );

  const outputPath = path.join(TRANSLATIONS_CSV_FILE_PATH);
  const encodedData = encoding.convert(output, 'utf8');

  fs.writeFileSync(outputPath, encodedData, { encoding: 'binary' });
}

function importCSV() {
  const csv = fs.readFileSync(TRANSLATIONS_CSV_FILE_PATH, { encoding: 'utf8' });

  const output = Papa.parse(csv, { header: true, encoding: 'utf8' });
  const languages = output.meta.fields.slice(1);

  generateJSONs(languages, output.data);
}

function generateJSONs(languages, data) {
  languages.forEach(lng => {
    const translations = {};
    data.forEach(translation => {
      _.set(translations, translation.id, translation[lng]);
    });

    fs.writeFileSync(
      path.join(TRANSLATIONS_JSON_FOLDER_PATH, `${lng}.json`),
      JSON.stringify(translations, null, 2)
    );
  });
}

function initGoogleAPI(callback) {
  const content = fs.readFileSync(GOOGLE_CREDENTIALS_PATH);
  authorize(JSON.parse(content), callback);
}

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return getNewToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
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
      if (err) {
        return console.error(
          'Error while trying to retrieve access token',
          err
        );
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFior(TOKEN_PATH, JSON.stringify(token), error => {
        if (error) {
          return console.error(error);
        }
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
