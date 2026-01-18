/**
 * Returns an ISO-like string with local timezone offset.
 * Example: "2026-01-18T08:12:34.567-05:00"
 */
export function nowIsoLocal(): string {
  const now = new Date();
  const tzOffsetMin = now.getTimezoneOffset();
  const tzOffsetHours = Math.floor(Math.abs(tzOffsetMin) / 60);
  const tzOffsetMins = Math.abs(tzOffsetMin) % 60;
  const tzSign = tzOffsetMin <= 0 ? '+' : '-';
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
  const offsetStr = `${tzSign}${String(tzOffsetHours).padStart(2, '0')}:${String(tzOffsetMins).padStart(2, '0')}`;
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetStr}`;
}

/**
 * Formats an ISO date string to a user-friendly local format.
 */
export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}
