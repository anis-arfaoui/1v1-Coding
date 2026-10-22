/**
 * Executes player's code against test cases inside a dedicated Web Worker
 * with an enforced 2-second timeout to terminate infinite loops.
 */
export function executeCode(code, tests, timeoutMs = 2000) {
  return new Promise((resolve) => {
    let worker;
    let isTerminated = false;

    // Safety timeout to catch infinite loops (e.g., while(true))
    const timer = setTimeout(() => {
      if (!isTerminated) {
        isTerminated = true;
        if (worker) worker.terminate();
        resolve({
          success: false,
          allPassed: false,
          error: 'Execution Timed Out (2.0s Limit). Check your code for infinite loops or deep recursion!',
          results: tests.map((t, idx) => ({
            testIndex: idx + 1,
            input: t.input,
            expected: t.output,
            actual: 'TIMEOUT',
            passed: false,
            error: 'Execution halted after 2000ms',
            executionTimeMs: 2000,
            logs: []
          }))
        });
      }
    }, timeoutMs);

    try {
      worker = new Worker('/runner.js');

      worker.onmessage = (event) => {
        if (!isTerminated) {
          isTerminated = true;
          clearTimeout(timer);
          worker.terminate();
          resolve(event.data);
        }
      };

      worker.onerror = (err) => {
        if (!isTerminated) {
          isTerminated = true;
          clearTimeout(timer);
          worker.terminate();
          resolve({
            success: false,
            allPassed: false,
            error: err.message || 'Worker runtime execution error',
            results: []
          });
        }
      };

      // Post execution payload to worker
      worker.postMessage({ code, tests });
    } catch (err) {
      clearTimeout(timer);
      resolve({
        success: false,
        allPassed: false,
        error: `Could not spawn Web Worker: ${err.message}`,
        results: []
      });
    }
  });
}
