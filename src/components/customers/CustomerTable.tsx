import React from 'react';
import { Customer, CustomerGroup } from '../../types/customer';
import { CustomerRow } from './CustomerRow';

interface CustomerTableProps {
  customers: Customer[];
  groups: CustomerGroup[];
  onToggleActive: (id: string) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  groups,
  onToggleActive,
  onDelete,
}) => {
  if (customers.length === 0) {
    return (
      <div className="p-12 text-center bg-card rounded-2xl border border-border/80 space-y-2">
        <p className="text-sm font-semibold text-foreground">No customers found</p>
        <p className="text-xs text-muted-foreground">
          Try adjusting your search criteria or filters, or add a new customer.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/60 text-muted-foreground text-[11px] font-bold uppercase tracking-wider border-b border-border">
            <tr>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Short Name</th>
              <th className="py-3 px-4">Group</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Country</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4 text-center">Active Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {customers.map((c) => (
              <CustomerRow
                key={c.id}
                customer={c}
                groups={groups}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
