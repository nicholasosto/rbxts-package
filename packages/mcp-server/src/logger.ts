/**
 * @nicholasosto/mcp-server — Structured Logger
 *
 * Lightweight logger that writes to stderr to avoid polluting the
 * JSON-RPC channel on stdout.
 *
 * LOG_LEVEL env var controls verbosity: debug | info | warn | error (default: info)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function getConfiguredLevel(): LogLevel {
  const env = (process.env.LOG_LEVEL ?? 'info').toLowerCase();
  if (env in LEVEL_ORDER) return env as LogLevel;
  return 'info';
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[getConfiguredLevel()];
}

function formatMessage(level: LogLevel, tag: string, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}] [${tag}]`;
  if (data !== undefined) {
    return `${prefix} ${message} ${JSON.stringify(data)}`;
  }
  return `${prefix} ${message}`;
}

/** Structured logger — all output goes to stderr. */
export const logger = {
  debug(tag: string, message: string, data?: unknown): void {
    if (shouldLog('debug')) console.error(formatMessage('debug', tag, message, data));
  },

  info(tag: string, message: string, data?: unknown): void {
    if (shouldLog('info')) console.error(formatMessage('info', tag, message, data));
  },

  warn(tag: string, message: string, data?: unknown): void {
    if (shouldLog('warn')) console.error(formatMessage('warn', tag, message, data));
  },

  error(tag: string, message: string, data?: unknown): void {
    if (shouldLog('error')) console.error(formatMessage('error', tag, message, data));
  },

  /** Log a tool invocation (at info level). */
  toolCall(toolName: string, params?: Record<string, unknown>): void {
    if (shouldLog('info')) {
      // Redact potentially large fields
      const safe = params ? { ...params } : {};
      if ('fileContent' in safe)
        safe.fileContent = `[base64 ${String(safe.fileContent).length} chars]`;
      if ('value' in safe && typeof safe.value === 'string' && safe.value.length > 200) {
        safe.value = `${safe.value.slice(0, 200)}…`;
      }
      console.error(formatMessage('info', 'tool', `${toolName} called`, safe));
    }
  },

  /** Log an API response time (at debug level). */
  apiResponse(endpoint: string, status: number, durationMs: number): void {
    if (shouldLog('debug')) {
      console.error(formatMessage('debug', 'api', `${endpoint} → ${status} (${durationMs}ms)`));
    }
  },
};
