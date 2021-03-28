import { GradesSheetDatasource } from "../data/datasource/grades-sheet.datasource";
import { Student } from "../data/entity/student.entity";

//This class represents a grading sistem
//It consumes an array of students and each respective grades and absences
//Also, via grades-sheet.datasource it retrieves the total number of classes
export class Grading {
  gradesSheetDatasource: GradesSheetDatasource;
  totalClasses: number;
  minimumToFinal: number;
  maximumToFinal: number;
  minimumToPassFinal: number;

  constructor(SPREADSHEET_ID: string, SHEET_ID: string) {
    this.gradesSheetDatasource = new GradesSheetDatasource(
      SPREADSHEET_ID,
      SHEET_ID
    );
    this.maximumToFinal = 70;
    this.minimumToFinal = 50;
    this.minimumToPassFinal = 50;
    this.totalClasses = 0;
  }

  //Calls the classes and methods to retrieve, calculate (situation and storeToPass) and push results to spreadsheet
  public async updateResults(): Promise<void> {
    const studentsGradesList = await this.gradesSheetDatasource.getStudentsSheet();
    this.totalClasses = this.gradesSheetDatasource.getTotalClasses();
    this.getFinalResults(studentsGradesList);

    console.log("Students List built.");

    return this.gradesSheetDatasource.updateSpreadSheet(studentsGradesList);
  }

  //Populates an array of students with the calculated situation and scoreToPass
  private getFinalResults(studentsGradesList: Array<Student>): Array<Student> {
    console.log("Calculating results...");
    const updatedStudentsList: Array<Student> = [];
    studentsGradesList.map((student) => {
      this.checkSituation(student);

      if (student.getSituation() == "Final") {
        student.setScoreToPass(this.checkScoreToPass(student));
      } else {
        student.setScoreToPass(0);
      }
      updatedStudentsList.push(student);
    });

    return studentsGradesList;
  }

  //Calculates scoreToPass
  private checkScoreToPass(student: Student): number {
    const scoreToPass = 100 - student.getMeanGrades();

    return scoreToPass;
  }

  //Calculates the situation
  private checkSituation(student: Student): void {
    const absenceLimit = this.totalClasses / 4;

    const meanGrades = student.getMeanGrades();
    if (student.getAbsences() > absenceLimit) {
      student.setSituation("Reprovado por Falta");
    } else if (
      meanGrades >= this.minimumToFinal &&
      meanGrades <= this.maximumToFinal
    ) {
      student.setSituation("Final");
    } else if (meanGrades > this.maximumToFinal) {
      student.setSituation("Aprovado");
    } else if (meanGrades < this.minimumToFinal) {
      student.setSituation("Reprovado por Nota");
    }
  }
}
