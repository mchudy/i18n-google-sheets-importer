import { CommandModule } from 'yargs';
import { generateCSV } from '../parsing';

const command: CommandModule = {
  command: 'export-csv',
  aliases: ['exportCsv', 'exportCSV'],
  describe: 'Exports JSON translation files to a CSV file',
  builder: {
    inputPath: {
      default: '.',
      description: 'Path to a folder where JSON translation files are located',
    },
    outputPath: {
      default: '.',
      description: 'Path to which the result CSV file should be saved',
    },
  },
  handler: (argv: any) => {
    generateCSV(argv.inputPath, argv.outputPath);
  },
};

module.exports = command;
