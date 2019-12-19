import { CommandModule } from 'yargs';
import { importCSV } from '../converter';

const command: CommandModule<{}, ImportCsvArgs> = {
  command: 'import-csv',
  aliases: ['importCsv', 'importCSV'],
  describe: 'Generate JSON translation files from a single CSV file',
  builder: {
    input: {
      default: 'translations.csv',
      description: 'Path to the CSV file with translations`',
    },
    output: {
      default: 'translations',
      description:
        'Path to a folder where generated JSON files should be saved',
    },
  },
  handler: argv => {
    importCSV(argv.input, argv.output);
  },
};

interface ImportCsvArgs {
  input: string;
  output: string;
}

module.exports = command;
