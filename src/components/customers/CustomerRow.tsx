import React, { useState, useRef, useEffect } from 'react';
import { Customer, CustomerGroup } from '../../types/customer';
import { ActiveStatusPill } from './ActiveStatusPill';
import { MoreVertical, Edit2, Power, Trash2, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CustomerRowProps {
  customer: Customer;
  groups: CustomerGroup[];
  onToggleActive: (id: string) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerRow: React.FC<CustomerRowProps> = ({
  customer,
  groups,
  onToggleActive,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const groupName = groups.find((g) => g.id === customer.groupId)?.name || customer.groupId;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <tr
      onClick={() => navigate(`/customers/${customer.id}/edit`)}
      className="hover:bg-muted/40 transition-colors cursor-pointer group"
    >
      {/* Customer Name */}
      <td className="py-3 px-4 font-semibold text-foreground">
        <div className="flex items-center gap-2">
          <span>{customer.customerName}</span>
          {customer.makeSupplierAlso && (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800"
              title="Also linked as Supplier"
            >
              <Truck className="size-2.5" />
              <span>Supplier</span>
            </span>
          )}
        </div>
        {customer.email && (
          <span className="text-[11px] text-muted-foreground block font-normal">
            {customer.email}
          </span>
        )}
      </td>

      {/* Short Name */}
      <td className="py-3 px-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
        {customer.shortName}
      </td>

      {/* Group */}
      <td className="py-3 px-4">
        <span className="inline-block px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          {groupName}
        </span>
      </td>

      {/* Customer Type */}
      <td className="py-3 px-4 text-xs text-muted-foreground">
        {customer.customerType}
      </td>

      {/* Country */}
      <td className="py-3 px-4 text-xs text-muted-foreground">
        {customer.country}
      </td>

      {/* Payment Type */}
      <td className="py-3 px-4 text-xs font-medium text-foreground">
        <span className="px-2 py-0.5 rounded bg-muted text-[11px]">
          {customer.paymentType}
        </span>
      </td>

      {/* Status */}
      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
        <ActiveStatusPill
          status={customer.activeStatus}
          clickable
          onClick={() => onToggleActive(customer.id)}
        />
      </td>

      {/* Kebab Action */}
      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
        <div ref={menuRef} className="relative inline-block text-left">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <MoreVertical className="size-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-30 mt-1 w-36 bg-card rounded-xl border border-border shadow-xl py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(`/customers/${customer.id}/edit`);
                }}
                className="w-full px-3 py-1.5 text-left text-foreground hover:bg-muted flex items-center gap-2 cursor-pointer"
              >
                <Edit2 className="size-3.5 text-muted-foreground" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onToggleActive(customer.id);
                }}
                className="w-full px-3 py-1.5 text-left text-foreground hover:bg-muted flex items-center gap-2 cursor-pointer"
              >
                <Power className="size-3.5 text-muted-foreground" />
                <span>{customer.activeStatus === 'Active' ? 'Deactivate' : 'Activate'}</span>
              </button>

              <div className="border-t border-border my-1" />

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(customer);
                }}
                className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
