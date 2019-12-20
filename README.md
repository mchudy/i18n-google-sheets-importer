# i18n-google-sheets-importer

Automatically generate JSON translation files from Google Drive spreadsheets.

## Installation

```
npm i i18n-google-sheets --save-dev
```

## Quick start

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
i18n-google-sheets --spreadsheetId spreadsheetId [--output ./translations] [--sheetName Sheet1] [--credentials credentials.json] [--token token.json]
```

Generates JSON translation files from a Google Sheet spreadsheet.

Arguments:

- `spreadsheetId` (required) - Sheet document ID, can be obtained from the URL: ht<span>tps://docs.google.com/spreadsheets/d/**1NYsZowfHbtQqgWWPelYRlDg0OhknpCx2JuL8mE1DSk**/edit?usp=sharing</span>
- `output` (default: `translations`) - Path to a folder where JSON files should be saved
- `sheetName` (default: `Sheet1`) Name of the sheet which contains i18n data

### `export-csv`

```
i18n-google-sheets export-csv --input ./translations --output ./translations.csv
```

Generates a single CSV file from existing JSON files.

Useful if you want to migrate the i18n in an existing project to Google Sheets (the generated CSV can be easily imported in Google Docs).

### `import-csv`

```
i18n-google-sheets import-csv --input ./translations.csv --output ./translations
```

Generates JSON translation files from a local CSV file.

## License

MIT License
