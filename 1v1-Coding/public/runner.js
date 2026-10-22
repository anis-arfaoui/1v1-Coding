/**
 * Web Worker for running user code against test cases in an isolated thread.
 */

// Deep equality comparator
function isDeepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (a === null || typeof a !== 'object' || b === null || typeof b !== 'object') {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!isDeepEqual(a[key], b[key])) return false;
  }

  return true;
}

// Format values for human-readable display in the test results
function formatValue(val) {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'function') return '[Function]';
  try {
    return JSON.stringify(val);
  } catch (e) {
    return String(val);
  }
}

self.onmessage = function (e) {
  const { code, tests } = e.data;

  // Intercept console.log to capture debugging output from user
  const logs = [];
  const originalLog = console.log;
  console.log = (...args) => {
    logs.push(args.map(formatValue).join(' '));
  };

  try {
    // Compile and extract the user's solve function
    // We execute in function scope to prevent polluting worker globals
    const createFunction = new Function(`
      "use strict";
      ${code}
      if (typeof solve !== 'function') {
        throw new Error("Missing function: you must define a function named 'solve'.");
      }
      return solve;
    `);

    const userSolve = createFunction();
    const results = [];
    let allPassed = true;

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const testLogs = [];
      const previousLogCount = logs.length;

      // Deep clone inputs so test mutation does not affect inputs
      let clonedInput;
      try {
        clonedInput = JSON.parse(JSON.stringify(test.input));
      } catch (err) {
        clonedInput = test.input;
      }

      const startTime = performance.now();
      let actualOutput = undefined;
      let error = null;
      let passed = false;

      try {
        actualOutput = userSolve(...clonedInput);
        passed = isDeepEqual(actualOutput, test.output);
      } catch (err) {
        error = err && err.message ? err.message : String(err);
        passed = false;
      }

      const endTime = performance.now();
      const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;

      // Extract logs generated during this specific test case
      for (let j = previousLogCount; j < logs.length; j++) {
        testLogs.push(logs[j]);
      }

      if (!passed) {
        allPassed = false;
      }

      results.push({
        testIndex: i + 1,
        input: test.input,
        expected: test.output,
        actual: actualOutput,
        passed,
        error,
        executionTimeMs,
        logs: testLogs
      });
    }

    console.log = originalLog;
    self.postMessage({
      success: true,
      allPassed,
      results,
      logs
    });
  } catch (err) {
    console.log = originalLog;
    self.postMessage({
      success: false,
      error: err && err.message ? err.message : String(err),
      allPassed: false,
      results: []
    });
  }
};
