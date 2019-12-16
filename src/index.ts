import * as yargs from 'yargs';

const argv = yargs.options({
  env: {
      alias: 'e',
      choices: ['dev', 'prod'] as const,
      demandOption: true,
      description: 'app environment'
  },
  port: {
      alias: 'p',
      default: 80,
      description: 'port'
  }
})
  .argv;

console.log(argv);

// function run([_parser, _tool, command, ..._args]) {
//   switch (command) {
//     case 'export-csv':
//       generateCSV();
//       break;
//     case 'import-csv':
//       importCSV();
//       break;
//     case 'import-google-drive':
//       initGoogleAPI(importTranslationsFromSpreadsheet);
//       break;
//     case 'help':
//     default:
//       printUsage();
//       break;
//   }
// }

// function printUsage() {
//   console.log(
//     `Usage: ./translations.js command
// Available commands:
//   export-csv:             Exports translations from local JSON i18next files to a single CSV file
//   import-csv:             Converts a single CSV into multiple JSON files for i18next
//   import-google-drive:    Imports translations from a Google Docs spreadsheet. Requires credentials.json file to be present 
//                           in the same folder as the script (https://developers.google.com/sheets/api/quickstart/nodejs)
// `
//   );
// }

// enum Command {
//   ExportCSV,
//   ImportCSV,
//   ImportGoogleDrive,
//   Help,
//   Version,
// }
