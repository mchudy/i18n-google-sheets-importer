import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import flatten from 'flat';
import Papa from 'papaparse';
const encoding = require('encoding');

const DEFAULT_ENCODING = 'utf8';

export function generateCSV(baseJSONPath: string, csvPath: string) {
  const translationFileNames = findJSONTranslationFileNames(baseJSONPath);
  const translationFiles = readJSONTranslationFiles(
    baseJSONPath,
    translationFileNames
  );

  const languageKeys = translationFileNames.map(name => name.substr(0, 2));
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

  const outputPath = path.join(csvPath);
  const encodedData = encoding.convert(output, DEFAULT_ENCODING);
  writeCSVFile(outputPath, encodedData);
}

export function importCSV(csvPath: string, outputPath: string) {
  const csv = fs.readFileSync(csvPath, { encoding: DEFAULT_ENCODING });

  const output = Papa.parse(csv, { header: true, encoding: DEFAULT_ENCODING });
  const languages = output.meta.fields.slice(1);

  generateJSONs(outputPath, languages, output.data);
}

export function importTranslationsFromSpreadsheet(
  spreadsheetData: any,
  outputPath: string
) {
  const rows = spreadsheetData.data.values as string[][];
  if (!rows.length) {
    return console.error('No data found in the spreadsheet');
  }

  const header = rows[0];
  const languages = header.slice(1);

  const data = rows.slice(1).map(row => {
    const result: any = {
      id: row[0],
    };
    for (let i = 0; i < languages.length; i += 1) {
      result[languages[i]] = row[i + 1] || '';
    }
    return result;
  });

  generateJSONs(outputPath, languages, data);
}

function writeCSVFile(outputPath: string, encodedData: string) {
  fs.writeFileSync(outputPath, encodedData, { encoding: 'binary' });
}

function extractKeys(translationFiles: object[]) {
  const keys = _.uniq(_.flatten(translationFiles.map(Object.keys)));
  keys.sort();
  return keys;
}

function readJSONTranslationFiles(
  basePath: string,
  translationFileNames: string[]
): any[] {
  return translationFileNames
    .map(file => {
      const rawData = fs.readFileSync(
        path.join(basePath, file),
        DEFAULT_ENCODING
      );
      return JSON.parse(rawData);
    })
    .map(value => flatten(value));
}

function findJSONTranslationFileNames(translationJSONFolderPath: string) {
  let translationFileNames = fs
    .readdirSync(translationJSONFolderPath)
    .filter(file => file.endsWith('.json') && file !== 'package.json');
  return _.reverse(translationFileNames);
}

function generateJSONs(
  outputPath: string,
  languages: string[],
  data: { [key: string]: string }[]
) {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  languages.forEach(lng => {
    const translations = {};
    data.forEach(translation => {
      _.set(translations, translation.id, translation[lng]);
    });

    fs.writeFileSync(
      path.join(outputPath, `${lng}.json`),
      JSON.stringify(translations, null, 2)
    );
  });
}
