export class Student {
  private id: number;
  private name: string;
  private grades: Array<number>;
  private absences: number;
  private situation: string;
  private scoreToPass: number;

  constructor(id: number, name: string, grades: number[], absences: number) {
    this.id = id;
    this.name = name;
    this.grades = grades;
    this.absences = absences;
    this.situation = "";
    this.scoreToPass = 0;
  }

  public getId(): number {
    return this.id;
  }
  public setId(id: number) {
    this.id = id;
  }

  public getName(): string {
    return this.name;
  }
  public setName(name: string) {
    this.name = name;
  }

  public getAbsences(): number {
    return this.absences;
  }
  public setAbsences(absences: number) {
    this.absences = absences;
  }

  public getScoreToPass(): number {
    return this.scoreToPass;
  }
  public setScoreToPass(scoreToPass: number) {
    this.scoreToPass = scoreToPass;
  }

  public getGrades(): Array<number> {
    return this.grades;
  }
  public setGrades(grades: Array<number>) {
    this.grades = grades;
  }

  public getSituation(): string {
    return this.situation;
  }
  public setSituation(situation: string) {
    this.situation = situation;
  }

  public getMeanGrades() {
    let mean = 0;
    this.grades.map((grade) => {
      mean += grade;
    });
    mean = Math.round(mean / this.grades.length);

    return mean;
  }
}
