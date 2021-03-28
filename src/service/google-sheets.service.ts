import { google, sheets_v4 } from "googleapis";
import { Authorization } from "./authorization.service";
import * as fs from "fs";

//Instantiates a Google Sheets Service
export class GoogleSheetsService {
  CRED_PATH: string;
  authorization: Authorization;

  constructor() {
    this.CRED_PATH = "credentials.json";
    this.authorization = new Authorization();
  }

  public async getSheetService(): Promise<sheets_v4.Sheets> {
    const auth = await this.authorization.authorize(
      JSON.parse(fs.readFileSync(this.CRED_PATH, "utf8"))
    );
    const sheets = google.sheets({ version: "v4", auth });
    return sheets;
  }
}
