export function isWithinExpirationDate(expirationDate: Date): boolean {
  const currentDate = new Date();

  const expiration = new Date(expirationDate);

  return currentDate < expiration;
}
