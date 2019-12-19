import { CommandModule } from 'yargs';
import { generateCSV } from '../converter';

const command: CommandModule<{}, ExportCsvArgs> = {
  command: 'export-csv',
  aliases: ['exportCsv', 'exportCSV'],
  describe: 'Exports JSON translation files to a CSV file',
  builder: {
    input: {
      default: 'translations',
      description: 'Path to a folder where JSON translation files are located',
    },
    output: {
      default: 'translations.csv',
      description: 'Path to which the result CSV file should be saved',
    },
  },
  handler: argv => {
    generateCSV(argv.input, argv.output);
  },
};

interface ExportCsvArgs {
  input: string;
  output: string;
}

module.exports = command;
