import { Student } from "../data/entity/student.entity";

export class StudentGrades {
  public calculateStudentScoreToPass(student: Student): number {
    const scoreToPass = 100 - student.getMeanGrades();

    return scoreToPass;
  }
}
