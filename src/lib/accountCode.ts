import {
  BASE_DIGIT,
  MAX_LEVEL,
  MAX_CODE_LEN,
  NATURE_CODES,
  Nature,
} from '../constants/accountsTypeTree';
import { Account, HierarchyLevel } from '../types/coa';

/**
 * Pads a number or numeric string to 2 digits (e.g. 1 -> "01", 12 -> "12")
 */
export function pad2(num: number | string): string {
  const str = String(num).padStart(BASE_DIGIT, '0');
  return str.slice(-BASE_DIGIT);
}

/**
 * Formats a 12-digit account code with subtle dot separators:
 * "010103040101" -> "01·01·03·04·01·01"
 */
export function formatAccountCode(code: string): string {
  if (!code) return '——·——·——·——·——·——';
  const clean = code.replace(/[^0-9]/g, '').padEnd(MAX_CODE_LEN, '0').slice(0, MAX_CODE_LEN);
  const segments: string[] = [];
  for (let i = 0; i < MAX_CODE_LEN; i += BASE_DIGIT) {
    segments.push(clean.substring(i, i + BASE_DIGIT));
  }
  return segments.join('·');
}

/**
 * Splits a 12-digit code into its 6 two-digit segments
 */
export function getCodeSegments(code: string): string[] {
  const clean = (code || '').replace(/[^0-9]/g, '').padEnd(MAX_CODE_LEN, '0').slice(0, MAX_CODE_LEN);
  const segments: string[] = [];
  for (let i = 0; i < MAX_LEVEL; i++) {
    segments.push(clean.substring(i * BASE_DIGIT, (i + 1) * BASE_DIGIT));
  }
  return segments;
}

/**
 * Generates the next unique 12-digit code for a new account.
 * - If top-level (level 1): uses Nature code (01..05) + "0000000000"
 * - If under a parent: inherits parent's active segments and calculates next 2-digit index (01..99)
 *   among existing siblings under the same parent.
 */
export function generateNextAccountCode(
  nature: Nature,
  parent: Account | null | undefined,
  allAccounts: Account[]
): { code: string; level: HierarchyLevel } {
  if (!parent) {
    // Top-level Level 1
    const natureSegment = NATURE_CODES[nature] || '01';
    // Find highest sibling at level 1 for this nature (normally single top parent, or sub-blocks)
    const existingTop = allAccounts.filter((a) => a.level === 1 && a.nature === nature);
    let nextIndex = existingTop.length + 1;
    const l1Code = natureSegment;
    const fullCode = l1Code.padEnd(MAX_CODE_LEN, '0');
    return { code: fullCode, level: 1 };
  }

  const childLevel = ((parent.level + 1) as HierarchyLevel);
  if (childLevel > MAX_LEVEL) {
    throw new Error(`Maximum hierarchy depth of ${MAX_LEVEL} exceeded`);
  }

  const parentSegments = getCodeSegments(parent.code);
  const childLevelIndex = childLevel - 1; // 0-based

  // Find all existing sibling accounts that share this exact parent
  const siblings = allAccounts.filter((a) => a.parentId === parent.id);
  const usedSiblingIndices = siblings.map((sib) => {
    const sibSegments = getCodeSegments(sib.code);
    return parseInt(sibSegments[childLevelIndex] || '0', 10);
  });

  let nextSiblingNum = 1;
  while (usedSiblingIndices.includes(nextSiblingNum) && nextSiblingNum < 100) {
    nextSiblingNum++;
  }

  const newSegments = [...parentSegments];
  newSegments[childLevelIndex] = pad2(nextSiblingNum);

  // Fill remaining deeper levels with "00"
  for (let i = childLevelIndex + 1; i < MAX_LEVEL; i++) {
    newSegments[i] = '00';
  }

  const fullCode = newSegments.join('');
  return { code: fullCode, level: childLevel };
}
