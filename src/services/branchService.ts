import { Branch } from '../types/bank';
import { MOCK_BRANCHES } from '../mock/branches';

const LS_BRANCHES_KEY = 'branches';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function listBranches(): Promise<Branch[]> {
  await delay(300);
  const raw = localStorage.getItem(LS_BRANCHES_KEY);
  if (!raw) {
    localStorage.setItem(LS_BRANCHES_KEY, JSON.stringify(MOCK_BRANCHES));
    return MOCK_BRANCHES;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length < MOCK_BRANCHES.length) {
      localStorage.setItem(LS_BRANCHES_KEY, JSON.stringify(MOCK_BRANCHES));
      return MOCK_BRANCHES;
    }
    return parsed;
  } catch (e) {
    return MOCK_BRANCHES;
  }
}

export async function getBranch(id: string): Promise<Branch | null> {
  await delay(200);
  const all = await listBranches();
  return all.find((b) => b.id === id) ?? null;
}

export async function createBranch(
  payload: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Branch> {
  await delay(450);
  const all = await listBranches();
  const now = new Date().toISOString();

  // Check branch name uniqueness per bank
  const duplicate = all.some(
    (b) =>
      b.bankId === payload.bankId &&
      b.branchName.trim().toLowerCase() === payload.branchName.trim().toLowerCase()
  );
  if (duplicate) {
    throw new Error(`Branch "${payload.branchName}" already exists for this bank.`);
  }

  const next: Branch = {
    ...payload,
    id: `br-${Date.now().toString(36)}`,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [next, ...all];
  localStorage.setItem(LS_BRANCHES_KEY, JSON.stringify(updated));
  return next;
}

export async function updateBranch(
  id: string,
  patch: Partial<Branch>
): Promise<Branch> {
  await delay(400);
  const all = await listBranches();
  const existing = all.find((b) => b.id === id);
  if (!existing) throw new Error('Branch not found');

  if (patch.branchName) {
    const bankId = patch.bankId || existing.bankId;
    const duplicate = all.some(
      (b) =>
        b.id !== id &&
        b.bankId === bankId &&
        b.branchName.trim().toLowerCase() === patch.branchName!.trim().toLowerCase()
    );
    if (duplicate) {
      throw new Error(`Branch "${patch.branchName}" already exists for this bank.`);
    }
  }

  const updatedBranch: Branch = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  const updated = all.map((b) => (b.id === id ? updatedBranch : b));
  localStorage.setItem(LS_BRANCHES_KEY, JSON.stringify(updated));
  return updatedBranch;
}

export async function deleteBranch(id: string): Promise<void> {
  await delay(300);
  const all = await listBranches();
  const filtered = all.filter((b) => b.id !== id);
  localStorage.setItem(LS_BRANCHES_KEY, JSON.stringify(filtered));
}

export async function duplicateBranch(id: string): Promise<Branch> {
  await delay(350);
  const all = await listBranches();
  const existing = all.find((b) => b.id === id);
  if (!existing) throw new Error('Branch not found');

  const now = new Date().toISOString();
  const copyName = `${existing.branchName} (Copy)`;

  const duplicateItem: Branch = {
    ...existing,
    id: `br-${Date.now().toString(36)}`,
    branchName: copyName,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [duplicateItem, ...all];
  localStorage.setItem(LS_BRANCHES_KEY, JSON.stringify(updated));
  return duplicateItem;
}
