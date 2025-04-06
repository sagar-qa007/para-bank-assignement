import * as fs from "fs";

function readJsonFile(filePath: string): any {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      console.error("Error reading or parsing the JSON file:", error);
      return null;
    }
  }
  
  export default readJsonFile;