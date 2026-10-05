/**
 * Converts a numeric currency amount into South Asian format words (Crore, Lakh, Thousand, Hundred)
 * with Taka and Poisha suffix.
 *
 * Example:
 * amountToWords(50000) -> "Fifty Thousand Taka Only"
 * amountToWords(100000.5) -> "One Lakh Taka and Fifty Poisha Only"
 */
const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const TENS = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

function convertLessThanThousand(n: number): string {
  let str = '';
  if (n >= 100) {
    str += ONES[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n >= 20) {
    str += TENS[Math.floor(n / 10)] + ' ';
    n %= 10;
  }
  if (n > 0) {
    str += ONES[n] + ' ';
  }
  return str.trim();
}

export function amountToWords(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Zero Taka Only';

  const [takaStr, poishaStr] = Math.abs(amount).toFixed(2).split('.');
  let n = parseInt(takaStr, 10);
  const poisha = parseInt(poishaStr, 10);

  let result = '';

  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  if (crore > 0) {
    result += convertLessThanThousand(crore) + ' Crore ';
  }

  const lakh = Math.floor(n / 100000);
  n %= 100000;
  if (lakh > 0) {
    result += convertLessThanThousand(lakh) + ' Lakh ';
  }

  const thousand = Math.floor(n / 1000);
  n %= 1000;
  if (thousand > 0) {
    result += convertLessThanThousand(thousand) + ' Thousand ';
  }

  const remainder = n;
  if (remainder > 0) {
    result += convertLessThanThousand(remainder) + ' ';
  }

  result = result.trim() + ' Taka';

  if (poisha > 0) {
    result += ' and ' + convertLessThanThousand(poisha) + ' Poisha';
  }

  return result + ' Only';
}
