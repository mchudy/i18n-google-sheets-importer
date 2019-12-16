import { CommandModule } from 'yargs';

const command: CommandModule = {
  command: 'import-csv',
  aliases: ['importCsv', 'importCSV'],
  describe: 'Generate JSON translation files from a single CSV file',
  handler: () => {
    console.log('import-csv');
  },
};

module.exports = command;
