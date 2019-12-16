import { CommandModule } from 'yargs';

const command: CommandModule = {
  command: 'export-csv',
  aliases: ['exportCsv', 'exportCSV'],
  describe: 'Exports JSON translation files to a CSV file',
  handler: () => {
    console.log('export-csv');
  },
};

module.exports = command;
