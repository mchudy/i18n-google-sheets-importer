import { CommandModule } from 'yargs';
import { OAuth2Client } from 'google-auth-library';
import { initGoogleAPI } from '../googleApi';

const command: CommandModule = {
  command: 'import-google-drive',
  aliases: ['importGoogleDrive'],
  describe: 'Generates JSON translation files from a Google Drive spreadsheet',
  handler: () => {
    initGoogleAPI((auth: OAuth2Client) => console.log(auth));
  },
};

module.exports = command;
