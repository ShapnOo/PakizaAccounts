import React, { useState, useEffect, useMemo } from 'react';
import { Customer, CustomerType, PaymentType } from '../../types/customer';
import { listCustomers, deleteCustomer, toggleCustomerActive } from '../../services/customerService';
import { useCustomerStore } from '../../stores/customerStore';
import { CustomerTable } from '../../components/customers/CustomerTable';
import { DeleteConfirmDialog } from '../../components/customers/DeleteConfirmDialog';
import { TableSkeleton } from '../../components/custom-fields/TableSkeleton';
import { Plus, Search, Filter, RefreshCw, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const CustomerListPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { groups, loadGroups } = useCustomerStore();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await listCustomers();
      setCustomers(data);
    } catch (e) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    loadGroups();
  }, []);

  const handleToggleActive = async (id: string) => {
    try {
      const updated = await toggleCustomerActive(id);
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
      toast.success(
        `Customer "${updated.customerName}" is now ${updated.activeStatus}`
      );
    } catch (e) {
      toast.error('Failed to toggle status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCustomer(customerToDelete.id);
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
      toast.success(`Customer "${customerToDelete.customerName}" deleted`);
      setCustomerToDelete(null);
    } catch (e) {
      toast.error('Failed to delete customer');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const groupName = groups.find((g) => g.id === c.groupId)?.name || '';
      const matchesSearch =
        c.customerName.toLowerCase().includes(search.toLowerCase()) ||
        c.shortName.toLowerCase().includes(search.toLowerCase()) ||
        groupName.toLowerCase().includes(search.toLowerCase()) ||
        c.country.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        typeFilter === 'All' || c.customerType === typeFilter;
      const matchesPayment =
        paymentFilter === 'All' || c.paymentType === paymentFilter;
      const matchesStatus =
        statusFilter === 'All' || c.activeStatus === statusFilter;

      return matchesSearch && matchesType && matchesPayment && matchesStatus;
    });
  }, [customers, groups, search, typeFilter, paymentFilter, statusFilter]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 pb-20">
      {/* ── Top Bar / Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
            <UserCheck className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-foreground">
              Customer Master Directory
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage debtor party records, credit parameters, billing addresses, and linked supplier bridges
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchCustomers}
            className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/customers/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            <span>+ New Customer</span>
          </Link>
        </div>
      </div>

      {/* ── Filters & Search Toolbar ── */}
      <div className="bg-card p-3 rounded-xl border border-border/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="size-4 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by customer name, short code, group, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-foreground placeholder:text-muted-foreground/60 shadow-2xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Customer Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="All">All Types</option>
            <option value="General">General</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Corporate">Corporate</option>
            <option value="Government">Government</option>
          </select>

          {/* Payment Type Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="All">All Payments</option>
            <option value="Credit">Credit</option>
            <option value="Cash">Cash</option>
            <option value="Advance">Advance</option>
            <option value="LC">LC</option>
            <option value="Others">Others</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ── Table Content ── */}
      {loading ? (
        <div className="bg-card p-6 rounded-2xl border border-border">
          <TableSkeleton rows={6} />
        </div>
      ) : (
        <CustomerTable
          customers={filteredCustomers}
          groups={groups}
          onToggleActive={handleToggleActive}
          onDelete={(c) => setCustomerToDelete(c)}
        />
      )}

      {/* ── Delete Confirmation Dialog ── */}
      <DeleteConfirmDialog
        isOpen={!!customerToDelete}
        customerName={customerToDelete?.customerName || ''}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
