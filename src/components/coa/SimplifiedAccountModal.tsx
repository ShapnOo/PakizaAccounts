import React, { useState, useEffect, useMemo } from 'react';
import { Account, HierarchyLevel } from '../../types/coa';
import { generateNextAccountCode, formatAccountCode } from '../../lib/accountCode';
import { MOCK_CUSTOMERS } from '../../mock/customers';
import { X, FolderTree, Building2, ChevronDown, Check, Layers, AlertCircle } from 'lucide-react';

export type SimplifiedTargetLevel = 3 | 4 | 5;

interface SimplifiedAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLevel?: SimplifiedTargetLevel | null;
  parentAccount?: Account | null;
  allAccounts: Account[];
  onSubmit: (data: {
    name: string;
    manualCode?: string;
    targetLevel: SimplifiedTargetLevel;
    parentId: string;
    customerName?: string;
    companyName: string;
    activeStatus: 'Active' | 'Inactive';
  }) => void;
}

const COMPANY_OPTIONS = [
  'All Company',
  'Pakiza Software Ltd.',
  'Pakiza Knit Composite Ltd.',
  'Pakiza Fashion & Design Ltd.',
  'Pakiza Textiles Ltd.',
];

export const SimplifiedAccountModal: React.FC<SimplifiedAccountModalProps> = ({
  isOpen,
  onClose,
  targetLevel: initialTargetLevel,
  parentAccount: initialParent,
  allAccounts,
  onSubmit,
}) => {
  // Determine effective target level: default to 3 (SubGroup), 4 (Control), or 5 (GL Account)
  const [selectedTargetLevel, setSelectedTargetLevel] = useState<SimplifiedTargetLevel>(
    initialTargetLevel ?? 3
  );

  // Parent selection
  const [selectedParentId, setSelectedParentId] = useState<string>(
    initialParent?.id ?? ''
  );

  // Form states
  const [accountTitle, setAccountTitle] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('All Company');
  const [activation, setActivation] = useState<'Active' | 'Inactive'>('Active');
  const [errorMessage, setErrorMessage] = useState('');

  // Reset/sync when opened or parent changes
  useEffect(() => {
    if (isOpen) {
      const targetLvl = initialTargetLevel ?? (initialParent ? ((initialParent.level + 1) as SimplifiedTargetLevel) : 3);
      setSelectedTargetLevel(targetLvl <= 5 ? (targetLvl as SimplifiedTargetLevel) : 5);
      setSelectedParentId(initialParent?.id ?? '');
      setAccountTitle('');
      setManualCode('');
      setCustomerName('');
      setCompanyName('All Company');
      setActivation('Active');
      setErrorMessage('');
    }
  }, [isOpen, initialTargetLevel, initialParent]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Find candidate parents based on target level:
  // If target is 3 (SubGroup) -> parent must be level 2 (Group)
  // If target is 4 (Control) -> parent must be level 3 (SubGroup)
  // If target is 5 (GL Account) -> parent must be level 4 (Control)
  const candidateParents = useMemo(() => {
    const neededParentLevel = selectedTargetLevel - 1;
    return allAccounts
      .filter((a) => a.level === neededParentLevel)
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [allAccounts, selectedTargetLevel]);

  // Ensure selectedParentId is valid for candidateParents if not pre-locked
  useEffect(() => {
    if (!initialParent && candidateParents.length > 0) {
      if (!candidateParents.some((p) => p.id === selectedParentId)) {
        setSelectedParentId(candidateParents[0].id);
      }
    }
  }, [candidateParents, selectedParentId, initialParent]);

  const currentParent = useMemo(() => {
    return allAccounts.find((a) => a.id === selectedParentId) || initialParent || null;
  }, [allAccounts, selectedParentId, initialParent]);

  // Calculate auto generated code preview
  const codePreview = useMemo(() => {
    try {
      if (!currentParent) return '';
      const { code } = generateNextAccountCode(currentParent.nature, currentParent, allAccounts);
      return formatAccountCode(code);
    } catch {
      return '';
    }
  }, [currentParent, allAccounts]);

  // Modal Title per screenshot
  const modalTitle = useMemo(() => {
    switch (selectedTargetLevel) {
      case 3:
        return 'SubGroup Name Info';
      case 4:
        return 'Control Name Info';
      case 5:
      default:
        return 'GL Account Info';
    }
  }, [selectedTargetLevel]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountTitle.trim()) {
      setErrorMessage('Account Title/Head is required.');
      return;
    }
    if (!selectedParentId) {
      setErrorMessage('Parent account must be selected.');
      return;
    }

    onSubmit({
      name: accountTitle.trim(),
      manualCode: manualCode.trim() || undefined,
      targetLevel: selectedTargetLevel,
      parentId: selectedParentId,
      customerName: selectedTargetLevel === 5 && customerName ? customerName : undefined,
      companyName,
      activeStatus: activation,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50 duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card - Styled to match screenshot */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="px-6 pt-5 pb-3.5 flex items-center justify-between border-b border-slate-200/90 dark:border-slate-800">
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            {modalTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-md"
            title="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4.5">
          {/* Target Type Selector (Shown only when opened globally without locked parent) */}
          {!initialParent && (
            <div className="space-y-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Account Level to Create
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { level: 3 as const, label: 'SubGroup', sub: 'under Group' },
                  { level: 4 as const, label: 'Control', sub: 'under SubGroup' },
                  { level: 5 as const, label: 'GL Account', sub: 'under Control' },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => {
                      setSelectedTargetLevel(item.level);
                      setErrorMessage('');
                    }}
                    className={`py-2 px-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedTargetLevel === item.level
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{item.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Parent Selection / Breadcrumb context */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {selectedTargetLevel === 3
                  ? 'Parent Group *'
                  : selectedTargetLevel === 4
                  ? 'Parent SubGroup *'
                  : 'Parent Control Account *'}
              </span>
              {codePreview && (
                <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                  Next Code: {codePreview}
                </span>
              )}
            </div>

            {initialParent ? (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
                <FolderTree className="size-4 text-blue-600 shrink-0" />
                <div className="truncate font-semibold text-slate-800 dark:text-slate-200">
                  <span className="font-mono text-slate-500 mr-1.5">{currentParent?.manualCode || formatAccountCode(currentParent?.code || '')}</span>
                  <span>{currentParent?.name}</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 pr-8 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
                >
                  {candidateParents.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.manualCode ? `[${parent.manualCode}] ` : ''}{parent.name} ({formatAccountCode(parent.code)})
                    </option>
                  ))}
                </select>
                <ChevronDown className="size-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Account Title/Head * */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Account Title/Head <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={accountTitle}
              onChange={(e) => {
                setAccountTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder={
                selectedTargetLevel === 3
                  ? 'e.g. Advance & Pre-Payments'
                  : selectedTargetLevel === 4
                  ? 'e.g. Advance to Employee'
                  : 'e.g. Advance Against Cash Purchase'
              }
              className="w-full text-sm font-semibold text-slate-900 dark:text-slate-100 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 placeholder:font-normal transition-all"
            />
          </div>

          {/* Manual Code */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Manual Code
            </label>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. 110001 (Optional)"
              className="w-full text-sm font-medium text-slate-900 dark:text-slate-100 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Customer Name (for GL Account only) */}
          {selectedTargetLevel === 5 && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Customer Name
              </label>
              <div className="relative">
                <select
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 dark:text-slate-200 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 pr-8 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
                >
                  <option value="">Select Customer / Party (Optional)</option>
                  {MOCK_CUSTOMERS.map((cust) => (
                    <option key={cust.id} value={cust.customerName}>
                      {cust.customerName} {cust.shortName ? `(${cust.shortName})` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="size-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Company Name (for GL Account only) */}
          {selectedTargetLevel === 5 && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Company Name
              </label>
              <div className="relative">
                <select
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 pr-8 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
                >
                  {COMPANY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="size-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Activation */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Activation
            </label>
            <div className="relative">
              <select
                value={activation}
                onChange={(e) => setActivation(e.target.value as 'Active' | 'Inactive')}
                className="w-full text-xs font-semibold text-slate-800 dark:text-slate-200 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 pr-8 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="size-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-900">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons matching screenshot */}
          <div className="flex items-center justify-between pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white uppercase tracking-wider py-2 px-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              CLOSE
            </button>

            <button
              type="submit"
              className="bg-[#1e88e5] hover:bg-[#1976d2] text-white text-xs font-bold px-7 py-2.5 rounded-lg uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

