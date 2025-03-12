// stats.test.ts
import { processLogsConcurrently } from "./log-parser";
import { DummyLogFactory } from "./dummy-log-factory";

describe("processLogsConcurrently", () => {
  it("should process logs concurrently and return accurate stats", async () => {
    const dummyLogFactory = new DummyLogFactory();
    dummyLogFactory.createDummyLogs(10);

    const logSources = [];
    for (let i = 0; i < 10; i++) {
      logSources.push(`logs/${i}.log`);
    }

    const stats = await processLogsConcurrently(logSources);
    expect(stats.errorCount).toBeGreaterThan(0);
    expect(stats.warningCount).toBeGreaterThan(0);
    expect(stats.validResponseCount).toBeGreaterThan(0);
  });
});
