export function calcAge(birthday: Date | null | undefined, at: Date = new Date()): number | null {
  if (!birthday) return null;
  let age = at.getFullYear() - birthday.getFullYear();
  const monthDiff = at.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && at.getDate() < birthday.getDate())) age--;
  return age;
}

export function securityCode(id: string): string {
  const clean = id.toUpperCase().replace(/[^A-Z0-9]/g, "").padEnd(20, "0");
  return clean.slice(0, 20).match(/.{1,5}/g)!.join("-");
}
