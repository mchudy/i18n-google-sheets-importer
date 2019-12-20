import { CommandModule } from 'yargs';
import { OAuth2Client } from 'google-auth-library';
import { initGoogleAPI, downloadSpreadsheet } from '../googleApi';
import { importTranslationsFromSpreadsheet } from '../converter';

const command: CommandModule<{}, ImportGoogleSheetsArgs> = {
  command: 'import-google-sheet',
  aliases: ['importGoogleSheet'],
  describe: 'Generates JSON translation files from a Google Drive spreadsheet',
  builder: {
    spreadsheetId: {
      required: true,
      description: 'Spreadsheet ID',
    },
    output: {
      default: 'translations',
      description:
        'Path to a folder where generated JSON files should be saved',
    },
    sheetName: {
      default: 'Sheet1',
      description: 'Name of the sheet which contains translations',
    },
    credentials: {
      default: 'credentials.json',
      description:
        'File with Google API credentials. It can be generated on https://developers.google.com/sheets/api/quickstart/nodejs',
    },
    token: {
      default: 'token.json',
      description:
        'File with Google API token. If it has not been generated yet, the script will create it',
    },
  },
  handler: argv => {
    initGoogleAPI(argv.credentials, argv.token, async (auth: OAuth2Client) => {
      const spreadsheet = await downloadSpreadsheet(
        auth,
        argv.spreadsheetId,
        argv.sheetName
      );
      importTranslationsFromSpreadsheet(spreadsheet, argv.output);
    });
  },
};

interface ImportGoogleSheetsArgs {
  spreadsheetId: string;
  sheetName: string;
  credentials: string;
  token: string;
  output: string;
}

module.exports = command;
