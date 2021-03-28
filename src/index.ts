import { Grading } from "./domain/grading.use-case";
require("dotenv").config();

(async () => {
  const grading = new Grading(process.env.SPREADSHEET_ID, process.env.SHEET_ID);
  await grading.updateResults();
})();
