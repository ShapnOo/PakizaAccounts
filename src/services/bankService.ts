import { Bank } from '../types/bank';
import { MOCK_BANKS } from '../mock/banks';
import { listBranches } from './branchService';

const LS_BANKS_KEY = 'banks';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function listBanks(): Promise<Bank[]> {
  await delay(200);
  const raw = localStorage.getItem(LS_BANKS_KEY);
  if (!raw) {
    localStorage.setItem(LS_BANKS_KEY, JSON.stringify(MOCK_BANKS));
    return MOCK_BANKS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return MOCK_BANKS;
  }
}

export async function getBank(id: string): Promise<Bank | null> {
  await delay(150);
  const all = await listBanks();
  return all.find((b) => b.id === id) ?? null;
}

export async function createBank(payload: { name: string; alias: string }): Promise<Bank> {
  await delay(300);
  const all = await listBanks();
  const trimmedName = payload.name.trim();
  const trimmedAlias = payload.alias.trim().toUpperCase();

  // Check if bank name or alias already exists (case-insensitive)
  const existing = all.find(
    (b) =>
      b.name.toLowerCase() === trimmedName.toLowerCase() ||
      b.alias.toUpperCase() === trimmedAlias
  );
  if (existing) {
    throw new Error(`Bank "${trimmedName}" or alias "${trimmedAlias}" already exists`);
  }

  const next: Bank = {
    id: `bank-${Date.now().toString(36)}`,
    name: trimmedName,
    alias: trimmedAlias,
    createdAt: new Date().toISOString(),
  };

  const updated = [...all, next];
  localStorage.setItem(LS_BANKS_KEY, JSON.stringify(updated));
  return next;
}

export async function updateBank(id: string, patch: { name?: string; alias?: string }): Promise<Bank> {
  await delay(250);
  const all = await listBanks();
  const existing = all.find((b) => b.id === id);
  if (!existing) throw new Error('Bank not found');

  const updatedBank: Bank = {
    ...existing,
    name: patch.name ? patch.name.trim() : existing.name,
    alias: patch.alias ? patch.alias.trim().toUpperCase() : existing.alias,
  };

  const updated = all.map((b) => (b.id === id ? updatedBank : b));
  localStorage.setItem(LS_BANKS_KEY, JSON.stringify(updated));
  return updatedBank;
}

export async function deleteBank(id: string): Promise<void> {
  await delay(250);
  // Block delete if used by any branch
  const branches = await listBranches();
  const isUsed = branches.some((br) => br.bankId === id);
  if (isUsed) {
    throw new Error('Cannot delete this bank because one or more branches are linked to it.');
  }

  const all = await listBanks();
  const filtered = all.filter((b) => b.id !== id);
  localStorage.setItem(LS_BANKS_KEY, JSON.stringify(filtered));
}
