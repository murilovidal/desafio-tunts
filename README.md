# Tunts-test

This an application made in NodeJS using TypeScript and the Google Sheets for Developers API.

## About

This application reads and updates a specific Google Docs Spreadsheet via API to demonstrate my skill in writing code consuming API.

### Prerequisites

```
dotenv: 8.2.0
googleapis: 68.0.0
readline: 1.3.0

```

And Docker Compose.

### Installation

Clone the repository with command `git clone https://github.com/murilovidal/apod-telegram-bot`
Fill the `.env` with your the spreadsheetId, your GoogleAPI credentials and token path. Refer to `.sample.env` as an example.
If you do not have a token, the application will prompt the authentication code you get from Google APIs service.

Run `docker-compose up` if you like it containerized.
Otherwise, run `npm start` on the project root directory

## Built With

- [Typescript](https://www.typescriptlang.org/)
- [NodeJS](https://nodejs.org/)
- [Google Sheets API](https://developers.google.com/sheets)
- [DOTENV](https://www.npmjs.com/package/dotenv)

## Authors

- [**Murilo Vidal**](https://murilovidal.xyz/)
