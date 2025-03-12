// log-processor.ts
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import { processLogsConcurrently } from "./log-parser";
import { DummyLogFactory } from "./dummy-log-factory";

if (isMainThread) {
  const dummyLogFactory = new DummyLogFactory();
  dummyLogFactory.createDummyLogs(10);

  const logSources = [];
  for (let i = 0; i < 10; i++) {
    logSources.push(`logs/${i}.log`);
  }

  const worker = new Worker(__filename, {
    workerData: logSources,
  });

  worker.on("message", (stats) => {
    console.log("Global stats:", stats);
  });

  worker.on("error", (error) => {
    console.error("Error occurred:", error);
  });
} else {
  processLogsConcurrently(workerData).then((stats) => {
    parentPort?.postMessage(stats);
  });
}
