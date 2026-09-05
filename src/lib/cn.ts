/** Joins class names, dropping falsy values. Later strings win by convention. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
