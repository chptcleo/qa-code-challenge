/**
 * Generate a random six-digit string
 * @returns A random six-digit string, padded with leading zeros if necessary
 */
export function generateRandomSixDigitString(): string {
  const randomNum = Math.floor(Math.random() * 1000000);
  return randomNum.toString().padStart(6, "0");
}
