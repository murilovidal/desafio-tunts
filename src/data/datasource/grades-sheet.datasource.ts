import { sheets_v4 } from "googleapis";
import { Student } from "../entity/student.entity";
import { GaxiosResponse } from "gaxios";
import { GoogleSheetsService } from "../../service/google-sheets.service";

export class GradesSheetDatasource {
  spreadsheet: GaxiosResponse<sheets_v4.Schema$ValueRange>;
  SPREADSHEET_ID: string;
  SHEET_ID: string;
  googleSheetsService: GoogleSheetsService;

  constructor(SPREADSHEET_ID: string, SHEET_ID: string) {
    this.SPREADSHEET_ID = SPREADSHEET_ID;
    this.SHEET_ID = SHEET_ID;
    this.googleSheetsService = new GoogleSheetsService();
  }

  public getTotalClasses(): number {
    if (this.spreadsheet.data.values[1]) {
      let textTotalClasses = this.spreadsheet.data.values[1].toString();
      textTotalClasses = textTotalClasses.match(/\d+/)[0];
      const totalClasses = parseInt(textTotalClasses);

      return totalClasses;
    } else {
      throw new Error("Unable to locate the total classes value.");
    }
  }

  public async updateSpreadSheet(studentsGradesList: Student[]): Promise<void> {
    console.log("Saving results in the Google Sheets SpreadSheet...");

    const dataToUpdate = this.getDataToUpdate(studentsGradesList);
    const sheets = await this.googleSheetsService.getSheetService();
    const range = this.SHEET_ID + "!G4";
    const request = {
      spreadsheetId: this.SPREADSHEET_ID,
      range: range,
      valueInputOption: "RAW",
      resource: {
        values: dataToUpdate,
      },
    };
    try {
      sheets.spreadsheets.values.update(request);
      console.info("Successfuly updated the spreadsheet.");
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update spreadsheet.");
    }
  }

  private getDataToUpdate(studentsGradesList: Student[]): Array<any> {
    const dataToUpdate = new Array();

    studentsGradesList.map((student) => {
      dataToUpdate.push([student.getSituation(), student.getScoreToPass()]);
    });

    return dataToUpdate;
  }

  public async getStudentsSheet(): Promise<Array<Student>> {
    const studentsGradesList = new Array<Student>();
    this.spreadsheet = await this.getSpreadSheet(
      this.SPREADSHEET_ID,
      this.SHEET_ID
    );
    const rows = await this.spreadsheet.data.values;

    console.log("Building Students List...");

    if (this.spreadsheet) {
      if (rows) {
        if (rows.length) {
          rows.map((row, index) => {
            if (index > 2) {
              const student = new Student(
                parseInt(row[0]),
                row[1],
                [parseInt(row[3]), parseInt(row[4]), parseInt(row[5])],
                parseInt(row[2])
              );
              studentsGradesList.push(student);
            }
          });
        } else {
          console.log("No data found.");
        }
      }
    }
    return studentsGradesList;
  }

  private async getSpreadSheet(
    SPREADSHEET_ID: string,
    SHEET_ID: string
  ): Promise<GaxiosResponse<sheets_v4.Schema$ValueRange>> {
    console.log("Checking Credentials...");

    const sheets = await this.googleSheetsService.getSheetService();

    const spreadsheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_ID,
    });

    return spreadsheet;
  }
}
