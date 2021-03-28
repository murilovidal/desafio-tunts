import { Student } from "../data/entity/student.entity";

export class CheckStudentsSituation {
  minimumToFinal: number;
  maximumToFinal: number;
  minimumToPassFinal: number;
  constructor() {
    this.maximumToFinal = 70;
    this.minimumToFinal = 50;
    this.minimumToPassFinal = 50;
  }

  public checkSituation(student: Student, absenceLimit: number): Student {
    const meanGrades = student.getMeanGrades();
    if (student.getAbsences() > absenceLimit) {
      student.setSituation("Reprovado por Falta");
    } else if (
      meanGrades >= this.minimumToFinal &&
      meanGrades <= this.maximumToFinal
    ) {
      student.setSituation("Exame Final");
    } else if (meanGrades > this.maximumToFinal) {
      student.setSituation("Aprovado");
    } else if (meanGrades < this.minimumToFinal) {
      student.setSituation("Reprovado por Nota");
    }

    return student;
  }
}
