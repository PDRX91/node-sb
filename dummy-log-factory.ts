// dummy-log-factory.ts
import * as fs from "fs";
import * as path from "path";

export class DummyLogFactory {
  /**
   * Creates dummy logs with randomized data.
   *
   * @param numSources The number of log sources to create.
   * @param numEntriesPerSource The number of entries per source (default is 100).
   */
  public createDummyLogs(
    numSources: number,
    numEntriesPerSource: number = 100
  ) {
    const logDir = path.join(__dirname, "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    for (let i = 0; i < numSources; i++) {
      const filePath = path.join(logDir, `${i}.log`);
      const entries: string[] = [];

      for (let j = 0; j < numEntriesPerSource; j++) {
        const timestamp = new Date(Date.now() + Math.random() * 100000000);
        const levels = ["INFO", "WARNING", "ERROR", "FATAL"];
        const level = levels[Math.floor(Math.random() * levels.length)];
        const responseTime = Math.random() * 100;

        // Intentionally include errors with missing fields
        if (Math.random() < 0.1) {
          entries.push(`${timestamp.toISOString()},${level}`);
        } else if (Math.random() < 0.2) {
          entries.push(
            `${timestamp.toISOString()},${level},${responseTime.toFixed(4)}`
          );
        } else {
          entries.push(
            `${timestamp.toISOString()},${level},${responseTime.toFixed(4)}`
          );
        }
      }

      fs.writeFileSync(filePath, entries.join("\n"));
    }
  }
}
