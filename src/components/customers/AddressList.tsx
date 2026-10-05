import React, { useState } from 'react';
import { Address } from '../../types/customer';
import { Plus, MapPin, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';

interface AddressListProps {
  addresses: Address[];
  defaultCountry: string;
  onChange: (addresses: Address[]) => void;
  error?: string;
}

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  defaultCountry,
  onChange,
  error,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields for address editor
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState(defaultCountry || 'Bangladesh');
  const [isPrimary, setIsPrimary] = useState(addresses.length === 0);
  const [fieldErrors, setFieldErrors] = useState<{ line1?: string; city?: string }>({});

  const handleOpenAdd = () => {
    setEditingId(null);
    setLine1('');
    setLine2('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry(defaultCountry || 'Bangladesh');
    setIsPrimary(addresses.length === 0);
    setFieldErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingId(addr.id);
    setLine1(addr.line1);
    setLine2(addr.line2 || '');
    setCity(addr.city);
    setState(addr.state || '');
    setPostalCode(addr.postalCode || '');
    setCountry(addr.country);
    setIsPrimary(addr.isPrimary);
    setFieldErrors({});
    setModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { line1?: string; city?: string } = {};
    if (!line1.trim()) errors.line1 = 'Address line 1 is required';
    if (!city.trim()) errors.city = 'City is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (editingId) {
      // Update existing
      const updated = addresses.map((a) => {
        if (a.id === editingId) {
          return {
            ...a,
            line1: line1.trim(),
            line2: line2.trim() || undefined,
            city: city.trim(),
            state: state.trim() || undefined,
            postalCode: postalCode.trim() || undefined,
            country: country.trim(),
            isPrimary,
          };
        }
        // If this address is set to primary, unset others
        return isPrimary ? { ...a, isPrimary: false } : a;
      });
      onChange(updated);
    } else {
      // Create new
      const newAddress: Address = {
        id: `addr-${Date.now().toString(36)}`,
        line1: line1.trim(),
        line2: line2.trim() || undefined,
        city: city.trim(),
        state: state.trim() || undefined,
        postalCode: postalCode.trim() || undefined,
        country: country.trim(),
        isPrimary: addresses.length === 0 || isPrimary,
      };

      const updated = isPrimary
        ? addresses.map((a) => ({ ...a, isPrimary: false })).concat(newAddress)
        : [...addresses, newAddress];

      onChange(updated);
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const filtered = addresses.filter((a) => a.id !== id);
    // If deleted address was primary, make the first remaining address primary
    if (filtered.length > 0 && !filtered.some((a) => a.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    onChange(filtered);
  };

  const handleSetPrimary = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isPrimary: a.id === id,
    }));
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-indigo-600" />
          <label className="text-[12px] font-bold text-foreground">
            Address Book
          </label>
          <span className="text-[10px] text-muted-foreground font-mono">
            ({addresses.length})
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 rounded-md border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
        >
          <Plus className="size-3" />
          <span>Add Address</span>
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-border text-center bg-muted/20 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">
            No addresses added yet
          </p>
          <p className="text-[10.5px] text-muted-foreground/80">
            Click "+ Add Address" to record primary billing & shipping locations
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/60 text-muted-foreground text-[10.5px] font-bold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="py-2 px-3">Address Line</th>
                <th className="py-2 px-3">City / State</th>
                <th className="py-2 px-3">Country</th>
                <th className="py-2 px-2.5 text-center">Primary</th>
                <th className="py-2 px-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-card">
              {addresses.map((addr) => (
                <tr key={addr.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2 px-3 font-medium text-foreground max-w-[200px] truncate">
                    <div>{addr.line1}</div>
                    {addr.line2 && (
                      <div className="text-[10.5px] text-muted-foreground truncate">
                        {addr.line2}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">
                    {addr.city}
                    {addr.state ? `, ${addr.state}` : ''}
                    {addr.postalCode ? ` - ${addr.postalCode}` : ''}
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">
                    {addr.country}
                  </td>
                  <td className="py-2 px-2.5 text-center">
                    {addr.isPrimary ? (
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="size-2.5" />
                        <span>Primary</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(addr.id)}
                        className="text-[10.5px] text-muted-foreground hover:text-indigo-600 cursor-pointer underline"
                      >
                        Set Primary
                      </button>
                    )}
                  </td>
                  <td className="py-2 px-2.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(addr)}
                        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                        title="Edit address"
                      >
                        <Edit2 className="size-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(addr.id)}
                        className="p-1 rounded text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      )}

      {/* Address Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  {editingId ? 'Edit Address' : 'Add New Address'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground block">
                  Address Line 1 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="Street address, building, suite..."
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className={`w-full h-8.5 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none shadow-2xs ${
                    fieldErrors.line1
                      ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
                      : 'border-border focus:ring-1 focus:ring-indigo-500'
                  }`}
                />
                {fieldErrors.line1 && (
                  <p className="text-[10px] text-rose-500 font-medium">
                    {fieldErrors.line1}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground block">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Apartment, unit, landmark..."
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-foreground block">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="City name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full h-8.5 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none shadow-2xs ${
                      fieldErrors.city
                        ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
                        : 'border-border focus:ring-1 focus:ring-indigo-500'
                    }`}
                  />
                  {fieldErrors.city && (
                    <p className="text-[10px] text-rose-500 font-medium">
                      {fieldErrors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground block">
                    State / Division
                  </label>
                  <input
                    type="text"
                    placeholder="State or Division"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground block">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1208 or 10019"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-foreground block">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border/80">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="rounded border-border text-indigo-600 focus:ring-indigo-500 size-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-foreground">
                    Set as Primary Address
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                  >
                    {editingId ? 'Save Changes' : 'Add to Book'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
