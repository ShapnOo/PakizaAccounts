import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Customer, CustomerType, PaymentType, Address, Attachment } from '../../types/customer';
import {
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  isShortNameUnique,
} from '../../services/customerService';
import { useCustomerStore } from '../../stores/customerStore';
import { customerSchema } from '../../lib/validation/customer';
import { FormHeader } from '../../components/customers/FormHeader';
import { FormFooter } from '../../components/customers/FormFooter';
import { IdentityBlock } from '../../components/customers/IdentityBlock';
import { ClassificationBlock } from '../../components/customers/ClassificationBlock';
import { DeleteConfirmDialog } from '../../components/customers/DeleteConfirmDialog';
import { TableSkeleton } from '../../components/custom-fields/TableSkeleton';
import { toast } from 'sonner';

export const CustomerFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { groups, loadGroups, addGroup } = useCustomerStore();

  const [loading, setLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [shortName, setShortName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('General');
  const [country, setCountry] = useState('Bangladesh');
  const [paymentType, setPaymentType] = useState<PaymentType>('Credit');
  const [makeSupplierAlso, setMakeSupplierAlso] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [email, setEmail] = useState('');
  const [bin, setBin] = useState('');
  const [tin, setTin] = useState('');
  const [keyPerson, setKeyPerson] = useState('');
  const [mobile, setMobile] = useState('');
  const [note, setNote] = useState('');
  const [accountsReceivableId, setAccountsReceivableId] = useState<string | null>(null);
  const [advanceReceiveAccountId, setAdvanceReceiveAccountId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [effectiveCompanyId, setEffectiveCompanyId] = useState('PSL');
  const [activeStatus, setActiveStatus] = useState<'Active' | 'Inactive'>('Active');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // Set default group when groups are loaded
  useEffect(() => {
    if (!isEditMode && groups.length > 0 && !groupId) {
      setGroupId(groups[0].id);
    }
  }, [groups, isEditMode, groupId]);

  // Load existing customer in edit mode
  useEffect(() => {
    if (!id) return;
    const loadCustomer = async () => {
      setLoading(true);
      try {
        const cust = await getCustomer(id);
        if (cust) {
          setCustomerName(cust.customerName);
          setShortName(cust.shortName);
          setGroupId(cust.groupId);
          setCustomerType(cust.customerType);
          setCountry(cust.country);
          setPaymentType(cust.paymentType);
          setMakeSupplierAlso(cust.makeSupplierAlso);
          setAddresses(cust.addresses || []);
          setEmail(cust.email || '');
          setBin(cust.bin || '');
          setTin(cust.tin || '');
          setKeyPerson(cust.keyPerson || '');
          setMobile(cust.mobile || '');
          setNote(cust.note || '');
          setAccountsReceivableId(cust.accountsReceivableId);
          setAdvanceReceiveAccountId(cust.advanceReceiveAccountId);
          setAttachments(cust.attachments || []);
          setEffectiveCompanyId(cust.effectiveCompanyId || 'PSL');
          setActiveStatus(cust.activeStatus);
          setCreatedAt(cust.createdAt);
          setUpdatedAt(cust.updatedAt);
        } else {
          toast.error('Customer not found');
          navigate('/customers');
        }
      } catch (e) {
        toast.error('Failed to load customer');
      } finally {
        setLoading(false);
      }
    };
    loadCustomer();
  }, [id, navigate]);

  const handleFieldChange = (field: string, value: any) => {
    setDirty(true);
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    switch (field) {
      case 'customerName':
        setCustomerName(value);
        break;
      case 'shortName':
        setShortName(value);
        break;
      case 'groupId':
        setGroupId(value);
        break;
      case 'customerType':
        setCustomerType(value);
        break;
      case 'country':
        setCountry(value);
        break;
      case 'paymentType':
        setPaymentType(value);
        break;
      case 'makeSupplierAlso':
        setMakeSupplierAlso(value);
        break;
      case 'addresses':
        setAddresses(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'bin':
        setBin(value);
        break;
      case 'tin':
        setTin(value);
        break;
      case 'keyPerson':
        setKeyPerson(value);
        break;
      case 'mobile':
        setMobile(value);
        break;
      case 'note':
        setNote(value);
        break;
      case 'accountsReceivableId':
        setAccountsReceivableId(value);
        break;
      case 'advanceReceiveAccountId':
        setAdvanceReceiveAccountId(value);
        break;
      case 'attachments':
        setAttachments(value);
        break;
      case 'activeStatus':
        setActiveStatus(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      customerName: customerName.trim(),
      shortName: shortName.trim().toUpperCase(),
      groupId,
      customerType,
      country,
      paymentType,
      makeSupplierAlso,
      addresses,
      email: email.trim() || '',
      bin: bin.trim() || '',
      tin: tin.trim() || '',
      keyPerson: keyPerson.trim() || '',
      mobile: mobile.trim() || '',
      note: note.trim() || '',
      accountsReceivableId,
      advanceReceiveAccountId,
      attachments,
      effectiveCompanyId,
      activeStatus,
    };

    // Zod Validation
    const validationResult = customerSchema.safeParse(payload);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error('Please resolve the highlighted errors in the form.');
      return;
    }

    // Check shortName uniqueness per company
    const isUnique = await isShortNameUnique(
      payload.shortName,
      effectiveCompanyId,
      id
    );
    if (!isUnique) {
      setErrors((prev) => ({
        ...prev,
        shortName: `Short name "${payload.shortName}" is already in use for this company.`,
      }));
      toast.error(`Short name "${payload.shortName}" is already in use.`);
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditMode && id) {
        await updateCustomer(id, payload);
        toast.success(`Customer "${payload.customerName}" updated successfully`);
      } else {
        await createCustomer(payload);
        toast.success(`Customer "${payload.customerName}" created successfully`);
      }
      setDirty(false);
      navigate('/customers');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteCustomer(id);
      toast.success(`Customer "${customerName}" deleted`);
      setDeleteDialogOpen(false);
      navigate('/customers');
    } catch (e) {
      toast.error('Failed to delete customer');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (dirty) {
      if (confirm('You have unsaved changes. Discard and exit?')) {
        navigate('/customers');
      }
    } else {
      navigate('/customers');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl border border-border/80 shadow-md p-6 relative">
          <FormHeader
            title={isEditMode ? `Edit — ${customerName}` : 'New Customer'}
            subtitle={
              isEditMode
                ? 'Update debtor party master profile and financial accounts'
                : 'Customer Master Setup — Two-column party profile and classification'
            }
            dirty={dirty}
            onCancel={handleCancel}
          />

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* ── Two-Column Layout (Left: Identity, Right: Classification) ── */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Identity Block (cols 1-7) */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-1.5 pb-1 border-b border-border/60">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                    Identity & Party Details
                  </span>
                </div>
                <IdentityBlock
                  customerName={customerName}
                  shortName={shortName}
                  country={country}
                  makeSupplierAlso={makeSupplierAlso}
                  addresses={addresses}
                  email={email}
                  bin={bin}
                  tin={tin}
                  keyPerson={keyPerson}
                  mobile={mobile}
                  note={note}
                  accountsReceivableId={accountsReceivableId}
                  attachments={attachments}
                  errors={errors}
                  onChangeField={handleFieldChange}
                  isCreateMode={!isEditMode}
                />
              </div>

              {/* Right Column: Classification Block (cols 8-12) */}
              <div className="md:col-span-5 space-y-4 md:border-l md:border-border/60 md:pl-6">
                <div className="flex items-center gap-1.5 pb-1 border-b border-border/60">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                    Classification & Accounts
                  </span>
                </div>
                <ClassificationBlock
                  groups={groups}
                  groupId={groupId}
                  customerType={customerType}
                  paymentType={paymentType}
                  advanceReceiveAccountId={advanceReceiveAccountId}
                  activeStatus={activeStatus}
                  errors={errors}
                  onChangeField={handleFieldChange}
                  onAddGroup={addGroup}
                />
              </div>
            </div>

            {/* ── Sticky Form Footer ── */}
            <FormFooter
              isSubmitting={isSubmitting}
              isEditMode={isEditMode}
              onCancel={handleCancel}
              onDelete={() => setDeleteDialogOpen(true)}
            />
          </form>

          {/* Edit Mode Metadata */}
          {isEditMode && createdAt && (
            <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>
                Created: {new Date(createdAt).toLocaleDateString()} at{' '}
                {new Date(createdAt).toLocaleTimeString()}
              </span>
              {updatedAt && (
                <span>
                  Last Updated: {new Date(updatedAt).toLocaleDateString()} at{' '}
                  {new Date(updatedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        customerName={customerName}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
