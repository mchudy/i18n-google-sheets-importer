import { CommandModule } from 'yargs';
import { generateCSV } from '../parsing';

const command: CommandModule = {
  command: 'export-csv',
  aliases: ['exportCsv', 'exportCSV'],
  describe: 'Exports JSON translation files to a CSV file',
  builder: {
    input: {
      default: '.',
      description: 'Path to a folder where JSON translation files are located',
    },
    output: {
      default: '.',
      description: 'Path to which the result CSV file should be saved',
    },
  },
  handler: (argv: any) => {
    generateCSV(argv.input, argv.output);
  },
};

module.exports = command;
