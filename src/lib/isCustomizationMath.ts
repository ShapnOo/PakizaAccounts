import type { ISCustomRow } from '../types/isCustomization';

/**
 * Build DISPLAY label with parenthetical suffix.
 * Suffix is DERIVED from code/formula — never stored.
 */
export function buildDisplayLabel(row: ISCustomRow): string {
  const text = row.particulars || '';
  if (row.kind !== 'parent') return text;
  if (!row.formula) return row.code ? `${text}(${row.code})` : text;

  // If formula references other parents (letters), show formula (e.g. A-B, C+D-E)
  // If pure child sum (only digits/+), show letter (e.g. A, B, D, E)
  const hasLetters = /[A-Z]/.test(row.formula);
  const suffix = hasLetters ? row.formula : row.code;
  return `${text}(${suffix})`;
}

/**
 * Next available child code (numeric, sequential: 1, 2, 3...).
 */
export function nextChildCode(rows: ISCustomRow[]): string {
  const used = new Set(
    rows
      .filter((r) => r.kind === 'child')
      .map((r) => parseInt(r.code, 10))
      .filter((n) => !isNaN(n))
  );
  let n = 1;
  while (used.has(n)) n++;
  return String(n);
}

/**
 * Next available parent letter (A-Z).
 */
export function nextParentCode(rows: ISCustomRow[]): string {
  const used = new Set(
    rows.filter((r) => r.kind === 'parent').map((r) => r.code.toUpperCase())
  );
  for (const l of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    if (!used.has(l)) return l;
  }
  return 'Z';
}

/**
 * When a child is added, auto-append childCode to parent formula.
 */
export function appendChildToFormula(
  formula: string | undefined,
  childCode: string
): string {
  if (!formula || !formula.trim()) return childCode;
  return `${formula.trim()}+${childCode}`;
}

/**
 * When a child is deleted, auto-remove childCode from parent formula.
 */
export function removeChildFromFormula(
  formula: string,
  childCode: string
): string {
  if (!formula) return '';
  const tokens = formula.split(/([+\-])/);
  const result: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i].trim();
    if (t === '') continue;
    if (t === '+' || t === '-') {
      result.push(t);
    } else if (t !== childCode) {
      result.push(t);
    } else {
      if (
        result.length > 0 &&
        (result[result.length - 1] === '+' || result[result.length - 1] === '-')
      ) {
        result.pop();
      }
    }
  }

  while (
    result.length > 0 &&
    (result[result.length - 1] === '+' || result[result.length - 1] === '-')
  ) {
    result.pop();
  }

  while (result.length > 0 && (result[0] === '+' || result[0] === '-')) {
    result.shift();
  }

  return result.join('');
}

/**
 * When a code (letter or number) is renamed, replace occurrences in formulas.
 */
export function renameCodeInFormula(
  formula: string | undefined,
  oldCode: string,
  newCode: string
): string {
  if (!formula) return '';
  const tokens = formula.split(/([+\-])/);
  const updated = tokens.map((t) => {
    const trimmed = t.trim();
    if (trimmed === oldCode) return newCode;
    return trimmed;
  });
  return updated.join('');
}

/**
 * Live validation for formula string.
 */
export function validateFormula(
  formula: string | undefined,
  rows: ISCustomRow[]
): { valid: boolean; error?: string } {
  if (!formula || !formula.trim()) {
    return { valid: false, error: 'Formula is empty' };
  }
  const t = formula.trim().replace(/\s+/g, '');
  if (!/^[A-Z0-9+\-]+$/.test(t)) {
    return { valid: false, error: 'Only uppercase letters, digits, +, - allowed' };
  }
  if (/^[+\-]/.test(t)) {
    return { valid: false, error: 'Cannot start with operator' };
  }
  if (/[+\-]$/.test(t)) {
    return { valid: false, error: 'Cannot end with operator' };
  }
  if (/[+\-]{2,}/.test(t)) {
    return { valid: false, error: 'Double operators not allowed' };
  }

  const tokens = t.split(/[+\-]/);
  const codes = new Set(rows.map((r) => r.code.toUpperCase()));
  for (const tok of tokens) {
    if (!codes.has(tok.toUpperCase())) {
      return { valid: false, error: `Unknown code "${tok}"` };
    }
  }

  return { valid: true };
}
