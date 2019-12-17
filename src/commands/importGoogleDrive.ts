import { CommandModule } from 'yargs';
import { OAuth2Client } from 'google-auth-library';
import { initGoogleAPI } from '../googleApi';

const command: CommandModule = {
  command: 'import-google-drive',
  aliases: ['importGoogleDrive'],
  describe: 'Generates JSON translation files from a Google Drive spreadsheet',
  builder: {
    spreadsheetId: {
      required: true,
      description: 'Spreadsheet ID'
    },
    spreadsheetName: {
      default: 'Sheet1',
      description: 'Name of the sheet which contains translations'
    },
    credentials: {
      default: 'credentials.json',
      description: 'File with Google API credentials. It can be generated on https://developers.google.com/sheets/api/quickstart/nodejs'
    },
    token: {
      default: 'token.json',
      description: 'File with Google API token. If it has not been generated yet, the script will create it',
    },
  },
  handler: (argv: any) => {
    initGoogleAPI(argv.credentials, argv.token, (auth: OAuth2Client) => {
      console.log(auth)
    });
  },
};

module.exports = command;
