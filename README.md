# i18n-google-sheets-importer

<img src="https://img.shields.io/npm/v/i18n-google-sheets-importer">

Automatically generate JSON translation files from Google Docs spreadsheets.

## Installation

```
npm i i18n-google-sheets-importer --save-dev
```

## Quick start

Create a Google Sheet spreadsheet in the following format:

<img width="462" alt="Screen Shot 2019-12-20 at 00 56 23" src="https://user-images.githubusercontent.com/9952229/71218899-927f3a00-22c3-11ea-962b-2e8e53199579.png">

Generate `credentials.json` file to access the Google Sheets API by following Step 1 from [this guide](https://developers.google.com/sheets/api/quickstart/nodejs).

Run the following command from the folder where `credentials.json` file is located:

```
i18n-google-sheets-importer import-google-sheet --spreadsheetId spreadsheetId
```

The script will generate `translations` folder containing files `en.json`, `de.json` and `es.json`.

Nesting is supported, so the above spreadsheet will get converted to a following JSON file (in case of English):

```json
{
  "yes": "Yes",
  "namespace": {
    "hello": "Hello"
  }
}
```

## API

### `import-google-sheet`

```
i18n-google-sheets-importer import-google-sheet
  --spreadsheetId spreadsheetId
  [--output ./translations]
  [--sheetName Sheet1]
  [--credentials credentials.json]
  [--token token.json]
```

Generates JSON translation files from a Google Sheet spreadsheet.

Arguments:

- `spreadsheetId` (required) - Sheet document ID, can be obtained from the URL: ht<span>tps://docs.google.com/spreadsheets/d/**1NYsZowfHbtQqgWWPelYRlDg0OhknpCx2JuL8mE1DSk**/edit?usp=sharing</span>
- `output` (default: `translations`) - Path to a folder where JSON files should be saved
- `sheetName` (default: `Sheet1`) - Name of the sheet which contains i18n data
- `credentials` (default: `./credentials.json`) - Path to file with Google Sheets Node API credentials
- `token` (default: `./token.json`) - Path to a Google Sheets API token (it will get generated on the first run and it can be reused afterwards)

### `export-csv`

```
i18n-google-sheets-importer export-csv --input ./translations --output ./translations.csv
```

Generates a single CSV file from existing JSON files.

Useful if you want to migrate the i18n in an existing project to Google Sheets (the generated CSV can be easily imported in Google Docs).

### `import-csv`

```
i18n-google-sheets-importer import-csv --input ./translations.csv --output ./translations
```

Generates JSON translation files from a local CSV file.

## License

MIT License
