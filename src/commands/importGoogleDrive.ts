import { CommandModule } from 'yargs';

const command: CommandModule = {
  command: 'import-google-drive',
  aliases: ['importGoogleDrive'],
  describe: 'Generates JSON translation files from a Google Drive spreadsheet',
  handler: () => {
    console.log('import-google-drive');
  },
};

module.exports = command;
