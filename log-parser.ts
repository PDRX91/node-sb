// log-parser.ts
import * as fs from "fs";
import * as path from "path";
import { Mutex } from "async-mutex";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

interface LogEntry {
  timestamp: Date;
  level: string;
  responseTime: number;
}

interface GlobalStats {
  errorCount: number;
  warningCount: number;
  totalResponseTime: { [level: string]: number };
  validResponseCount: number;
}

/**
 * Parses a log line into a LogEntry object.
 *
 * @param line The log line to parse.
 * @returns The parsed LogEntry object, or null if the line is invalid.
 */
export function parseLogLine(line: string): LogEntry | null {
  const parts = line.split(",");

  // Check if the line has the correct number of parts
  if (parts.length < 3) {
    return null;
  }

  // Parse the timestamp
  let timestamp: Date;
  try {
    timestamp = new Date(parts[0]);
    if (isNaN(timestamp.getTime())) {
      return null;
    }
  } catch (error) {
    return null;
  }

  // Parse the log level
  const level = parts[1].trim();

  // Parse the response time
  let responseTime: number;
  try {
    responseTime = parseFloat(parts[2]);
    if (isNaN(responseTime)) {
      return null;
    }
  } catch (error) {
    return null;
  }

  return { timestamp, level, responseTime };
}

/**
 * Updates the global stats object with a parsed log entry.
 *
 * @param stats The global stats object.
 * @param entry The parsed log entry.
 * @param mutex The mutex to use for thread-safe updates.
 */
async function updateGlobalStats(
  stats: GlobalStats,
  entry: LogEntry,
  mutex: Mutex
) {
  await mutex.runExclusive(async () => {
    if (entry.level === "ERROR") {
      stats.errorCount++;
    } else if (entry.level === "WARNING") {
      stats.warningCount++;
    }

    if (!stats.totalResponseTime[entry.level]) {
      stats.totalResponseTime[entry.level] = 0;
    }
    stats.totalResponseTime[entry.level] += entry.responseTime;

    stats.validResponseCount++;
  });
}

/**
 * Processes logs concurrently from multiple sources.
 *
 * @param logSources The array of log sources.
 * @returns A promise that resolves with the global stats object.
 */
export async function processLogsConcurrently(
  logSources: string[]
): Promise<GlobalStats> {
  const stats: GlobalStats = {
    errorCount: 0,
    warningCount: 0,
    totalResponseTime: {},
    validResponseCount: 0,
  };

  const mutex = new Mutex();

  const promises = logSources.map(async (source) => {
    const fileContent = fs.readFileSync(source, "utf8");
    const lines = fileContent.split("\n");

    for (const line of lines) {
      const entry = parseLogLine(line);
      if (entry) {
        await updateGlobalStats(stats, entry, mutex);
      }
    }
  });

  await Promise.all(promises);

  return stats;
}
