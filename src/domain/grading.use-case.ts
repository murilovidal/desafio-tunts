import { GradesSheetDatasource } from "../data/datasource/grades-sheet.datasource";
import { Student } from "../data/entity/student.entity";

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

  public async updateResults() {
    const studentsGradesList = await this.gradesSheetDatasource.getStudentsSheet();
    this.totalClasses = this.gradesSheetDatasource.getTotalClasses();
    this.getFinalResults(studentsGradesList);

    console.log("Students List built.");

    return this.gradesSheetDatasource.updateSpreadSheet(studentsGradesList);
  }

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

  private checkScoreToPass(student: Student): number {
    const scoreToPass = 100 - student.getMeanGrades();

    return scoreToPass;
  }

  private checkSituation(student: Student) {
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
