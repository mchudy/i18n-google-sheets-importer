import { CommandModule } from 'yargs';
import { generateCSV } from '../parsing';
import path from 'path';

const command: CommandModule = {
  command: 'export-csv',
  aliases: ['exportCsv', 'exportCSV'],
  describe: 'Exports JSON translation files to a CSV file',
  handler: () => {
    generateCSV(
      path.join(__dirname, '../translations'),
      path.join(__dirname, '../translations/translations.csv')
    );
  },
};

module.exports = command;
