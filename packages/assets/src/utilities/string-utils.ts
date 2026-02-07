/**
 * String utility functions for roblox-ts game development.
 */
export namespace StringUtils {
  /** Convert a PascalCase or camelCase string to Title Case with spaces */
  export function toTitleCase(str: string): string {
    return str.gsub('(%u)', ' %1')[0].gsub('^%s', '')[0];
  }

  /** Convert a string to a URL-safe slug (lowercase, hyphens) */
  export function toSlug(str: string): string {
    return str.lower().gsub('%s+', '-')[0].gsub('[^%w%-]', '')[0];
  }

  /** Truncate a string to maxLength, appending '...' if truncated */
  export function truncate(str: string, maxLength: number): string {
    if (str.size() <= maxLength) return str;
    return str.sub(1, maxLength) + '...';
  }

  /** Pad a number with leading zeros to a fixed width */
  export function zeroPad(value: number, width: number): string {
    return string.format(`%0${width}d`, value);
  }

  /** Format a number with commas (e.g., 1234567 → "1,234,567") */
  export function formatNumber(value: number): string {
    let result = tostring(math.floor(value));
    while (true) {
      const [formatted, count] = result.gsub('(%d)(%d%d%d)$', '%1,%2');
      result = formatted;
      if (count === 0) break;
    }
    return result;
  }

  /** Format seconds into MM:SS display */
  export function formatTime(totalSeconds: number): string {
    const minutes = math.floor(totalSeconds / 60);
    const seconds = math.floor(totalSeconds % 60);
    return `${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}`;
  }
}
