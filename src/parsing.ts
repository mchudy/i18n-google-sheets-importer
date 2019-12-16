import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import flatten from 'flat';
import Papa from 'papaparse';
const encoding = require('encoding');

const TRANSLATIONS_CSV_FILE_PATH = path.join(__dirname, '../translations.csv');
const TRANSLATIONS_JSON_FOLDER_PATH = path.join(
  __dirname,
  '../src/translations'
);
const SPREADSHEET_ID = process.env.TRANSLATIONS_SPREADSHEET_ID;
const SHEET_NAME = 'FE';

export function generateCSV() {
  const translationFileNames = findJSONTranslationFileNames();
  const languageKeys = translationFileNames.map(name => name.substr(0, 2));
  const translationFiles = readJSONTranslationFiles(translationFileNames);
  const keys = extractKeys(translationFiles);

  const output = Papa.unparse(
    {
      fields: ['id', ...languageKeys],
      data: keys.map(key => [key, ...translationFiles.map(file => file[key])]),
    },
    {
      quotes: true,
      delimiter: ',',
    }
  );

  const outputPath = path.join(TRANSLATIONS_CSV_FILE_PATH);
  const encodedData = encoding.convert(output, 'utf8');

  writeCSVFile(outputPath, encodedData);
}

function writeCSVFile(outputPath: string, encodedData: string) {
  fs.writeFileSync(outputPath, encodedData, { encoding: 'binary' });
}

function extractKeys(translationFiles: object[]) {
  const keys = _.uniq(_.flatten(translationFiles.map(Object.keys)));
  keys.sort();
  return keys;
}

function readJSONTranslationFiles(translationFileNames: string[]) {
  return translationFileNames
    .map(file => {
      const rawData = fs.readFileSync(
        path.join(TRANSLATIONS_JSON_FOLDER_PATH, file),
        'utf8'
      );
      return JSON.parse(rawData);
    })
    .map(flatten);
}

function findJSONTranslationFileNames() {
  let translationFileNames = fs
    .readdirSync(TRANSLATIONS_JSON_FOLDER_PATH)
    .filter(file => file.endsWith('.json') && file !== 'package.json');
  return _.reverse(translationFileNames);
}

function importCSV() {
  const csv = fs.readFileSync(TRANSLATIONS_CSV_FILE_PATH, { encoding: 'utf8' });

  const output = Papa.parse(csv, { header: true, encoding: 'utf8' });
  const languages = output.meta.fields.slice(1);

  generateJSONs(languages, output.data);
}

function generateJSONs(languages: string[], data: any[]) {
  languages.forEach(lng => {
    const translations = {};
    data.forEach(translation => {
      _.set(translations, translation.id, translation[lng]);
    });

    fs.writeFileSync(
      path.join(TRANSLATIONS_JSON_FOLDER_PATH, `${lng}.json`),
      JSON.stringify(translations, null, 2)
    );
  });
}

function importTranslationsFromSpreadsheet(spreadsheetData) {
  const rows = spreadsheetData.data.values;
  if (!rows.length) {
    return console.error('No data found in the spreadsheet');
  }

  const header = rows[0];
  const languages = header.slice(1);

  const data = rows.slice(1).map(row => {
    const result = {
      id: row[0],
    };
    for (let i = 0; i < languages.length; i += 1) {
      result[languages[i]] = row[i + 1] || '';
    }
    return result;
  });

  generateJSONs(languages, data);
}
