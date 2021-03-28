import { google } from "googleapis";
import * as fs from "fs";
import * as readline from "readline";
import { OAuth2Client } from "google-auth-library";

//This class checks for a token or checks credentials and prompts for a token
export class Authorization {
  TOKEN_PATH: any;
  SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

  constructor() {
    this.TOKEN_PATH = "token.json";
  }

  public async authorize(cred: any) {
    const { client_secret, client_id, redirect_uris } = cred.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    if (fs.existsSync(this.TOKEN_PATH)) {
      console.log("Token Found.");
      oAuth2Client.setCredentials(
        JSON.parse(fs.readFileSync(this.TOKEN_PATH, "utf8"))
      );

      return oAuth2Client;
    }
    console.log("Token not Found. Requesting new Token...");
    return this.getNewToken(oAuth2Client);
  }

  private async getNewToken(oAuth2Client: OAuth2Client): Promise<OAuth2Client> {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.SCOPES,
    });

    console.log("Authorize this app by visiting this url: ", authUrl);

    return (await new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question("Enter the code from that page here: ", (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          reject(err);
          if (!token) {
            reject();
          }
          oAuth2Client.setCredentials(token!);

          fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(token));

          resolve(oAuth2Client);
        });
      });
    })) as OAuth2Client;
  }
}
