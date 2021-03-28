import { GradesSheetDatasource } from "../data/datasource/grades-sheet.datasource";
import { Student } from "../data/entity/student.entity";
import { CheckStudentsSituation } from "./check-student-situation.use-case";
import { StudentGrades } from "./students-grades.use-case";

//This class represents a grading sistem
//It consumes an array of students and each respective grades and absences
//Also, via grades-sheet.datasource it retrieves the total number of classes
export class Grading {
  gradesSheetDatasource: GradesSheetDatasource;
  studentGrades: StudentGrades;
  checkStudentSituation: CheckStudentsSituation;
  PERCENTILE_ABSENCE_LIMIT: number;

  constructor(SPREADSHEET_ID: string, SHEET_ID: string) {
    this.gradesSheetDatasource = new GradesSheetDatasource(
      SPREADSHEET_ID,
      SHEET_ID
    );
    this.PERCENTILE_ABSENCE_LIMIT = 0.25;
    this.studentGrades = new StudentGrades();
    this.checkStudentSituation = new CheckStudentsSituation();
  }

  //Calls the classes and methods to retrieve, calculate (situation and storeToPass) and push results to spreadsheet
  public async updateResults(): Promise<void> {
    const studentsGradesList = await this.gradesSheetDatasource.getStudentsSheet();
    this.getFinalResults(studentsGradesList);

    console.log("Students List built.");

    return this.gradesSheetDatasource.updateSpreadSheet(studentsGradesList);
  }

  //Populates an array of students with the calculated situation and scoreToPass
  private getFinalResults(studentsGradesList: Array<Student>): void {
    console.log("Calculating results...");
    const absenceLimit: number =
      this.gradesSheetDatasource.getTotalClasses() *
      this.PERCENTILE_ABSENCE_LIMIT;

    studentsGradesList.map((student) => {
      this.checkStudentSituation.checkSituation(student, absenceLimit);

      if (student.getSituation() == "Exame Final") {
        student.setScoreToPass(
          this.studentGrades.calculateStudentScoreToPass(student)
        );
      } else {
        student.setScoreToPass(0);
      }
    });
  }
}
