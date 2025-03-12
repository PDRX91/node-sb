// log-parser.test.ts
import { parseLogLine } from "./log-parser";

describe("parseLogLine", () => {
  it("should parse a valid log line", () => {
    const line = "2022-01-01T12:00:00.000Z,INFO,10.1234";
    const entry = parseLogLine(line);
    expect(entry).not.toBeNull();
    expect(entry?.timestamp.toISOString()).toBe("2022-01-01T12:00:00.000Z");
    expect(entry?.level).toBe("INFO");
    expect(entry?.responseTime).toBe(10.1234);
  });

  it("should handle a log line with missing fields", () => {
    const line = "2022-01-01T12:00:00.000Z,INFO";
    const entry = parseLogLine(line);
    expect(entry).toBeNull();
  });

  it("should handle a log line with invalid timestamp", () => {
    const line = "Invalid timestamp,INFO,10.1234";
    const entry = parseLogLine(line);
    expect(entry).toBeNull();
  });

  it("should handle a log line with invalid response time", () => {
    const line = "2022-01-01T12:00:00.000Z,INFO,Invalid response time";
    const entry = parseLogLine(line);
    expect(entry).toBeNull();
  });
});
