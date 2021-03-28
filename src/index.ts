import { Grading } from "./domain/grading-results.use-case";
require("dotenv").config();

(async () => {
  const grading = new Grading(process.env.SPREADSHEET_ID, process.env.SHEET_ID);
  //This method returns void when the spreadsheet is updated, else it throw an error
  await grading.updateResults();
})();
