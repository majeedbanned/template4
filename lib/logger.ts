type LogArgs = unknown[];

const createLoggerMethod =
  (method: (...args: LogArgs) => void, level: "INFO" | "WARN" | "ERROR") =>
  (...args: LogArgs) => {
    method(`[${new Date().toISOString()}] [${level}]`, ...args);
  };

export const logger = {
  info: createLoggerMethod(console.info, "INFO"),
  warn: createLoggerMethod(console.warn, "WARN"),
  error: createLoggerMethod(console.error, "ERROR"),
};

