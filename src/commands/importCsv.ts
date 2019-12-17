import { CommandModule } from 'yargs';

const command: CommandModule = {
  command: 'import-csv',
  aliases: ['importCsv', 'importCSV'],
  describe: 'Generate JSON translation files from a single CSV file',
  builder: {
    input: {
      default: '.',
      description: 'Path to the CSV file with translations`',
    },
    output: {
      default: '.',
      description: 'Path to a folder where generated JSON files should be saved',
    },
  },
  handler: () => {
    console.log('import-csv');
  },
};

module.exports = command;
