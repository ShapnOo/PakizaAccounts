import React from 'react';
import { CountryPicker } from './CountryPicker';
import { SupplierAlsoToggle } from './SupplierAlsoToggle';
import { AddressList } from './AddressList';
import { BinTinPair } from './BinTinPair';
import { KeyPersonMobilePair } from './KeyPersonMobilePair';
import { NoteField } from './NoteField';
import { AccountsReceivablePicker } from './AccountsReceivablePicker';
import { AttachmentDropzone } from './AttachmentDropzone';
import { Address, Attachment } from '../../types/customer';
import { Mail, Building } from 'lucide-react';

interface IdentityBlockProps {
  customerName: string;
  shortName: string;
  country: string;
  makeSupplierAlso: boolean;
  addresses: Address[];
  email: string;
  bin: string;
  tin: string;
  keyPerson: string;
  mobile: string;
  note: string;
  accountsReceivableId: string | null;
  attachments: Attachment[];
  errors: Record<string, string | undefined>;
  onChangeField: (field: string, value: any) => void;
  isCreateMode?: boolean;
}

export const IdentityBlock: React.FC<IdentityBlockProps> = ({
  customerName,
  shortName,
  country,
  makeSupplierAlso,
  addresses,
  email,
  bin,
  tin,
  keyPerson,
  mobile,
  note,
  accountsReceivableId,
  attachments,
  errors,
  onChangeField,
  isCreateMode = true,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Customer Name */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-bold text-foreground flex items-center gap-1.5">
          <Building className="size-3 text-indigo-600" />
          <span>Customer Name</span>
          <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          autoFocus={isCreateMode}
          placeholder="e.g. Next Sourc Ltd."
          value={customerName}
          onChange={(e) => onChangeField('customerName', e.target.value)}
          className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-semibold text-foreground outline-none shadow-2xs ${
            errors.customerName
              ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
              : 'border-border focus:ring-1 focus:ring-indigo-500'
          }`}
        />
        {errors.customerName && (
          <p className="text-[10.5px] text-rose-500 font-medium">
            {errors.customerName}
          </p>
        )}
      </div>

      {/* 2. Short Name */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-bold text-foreground flex items-center gap-1">
            <span>Short Name</span>
            <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10.5px] text-muted-foreground font-mono">
            (2–8 UPPERCASE CHARS)
          </span>
        </div>
        <input
          type="text"
          maxLength={8}
          placeholder="e.g. NST"
          value={shortName}
          onChange={(e) =>
            onChangeField(
              'shortName',
              e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
            )
          }
          className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-mono font-bold text-foreground outline-none shadow-2xs tracking-wider uppercase ${
            errors.shortName
              ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
              : 'border-border focus:ring-1 focus:ring-indigo-500'
          }`}
        />
        {errors.shortName && (
          <p className="text-[10.5px] text-rose-500 font-medium">
            {errors.shortName}
          </p>
        )}
      </div>

      {/* 3. Region/Country/Region */}
      <CountryPicker
        value={country}
        onChange={(val) => onChangeField('country', val)}
        error={errors.country}
      />

      {/* 4. Make this Supplier also */}
      <SupplierAlsoToggle
        checked={makeSupplierAlso}
        onChange={(val) => onChangeField('makeSupplierAlso', val)}
      />

      {/* 5. Address Book */}
      <AddressList
        addresses={addresses}
        defaultCountry={country}
        onChange={(val) => onChangeField('addresses', val)}
        error={errors.addresses}
      />

      {/* 6. Email */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-bold text-foreground flex items-center gap-1.5">
          <Mail className="size-3 text-indigo-600" />
          <span>Email Address</span>
          <span className="text-[10px] text-muted-foreground font-normal italic">
            (Optional)
          </span>
        </label>
        <input
          type="email"
          placeholder="accounts@customer.com"
          value={email}
          onChange={(e) => onChangeField('email', e.target.value)}
          className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none shadow-2xs ${
            errors.email
              ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
              : 'border-border focus:ring-1 focus:ring-indigo-500'
          }`}
        />
        {errors.email && (
          <p className="text-[10.5px] text-rose-500 font-medium">
            {errors.email}
          </p>
        )}
      </div>

      {/* 7. BIN | TIN */}
      <BinTinPair
        bin={bin}
        tin={tin}
        onChangeBin={(val) => onChangeField('bin', val)}
        onChangeTin={(val) => onChangeField('tin', val)}
        binError={errors.bin}
        tinError={errors.tin}
      />

      {/* 8. Key Person | Mobile */}
      <KeyPersonMobilePair
        keyPerson={keyPerson}
        mobile={mobile}
        onChangeKeyPerson={(val) => onChangeField('keyPerson', val)}
        onChangeMobile={(val) => onChangeField('mobile', val)}
        keyPersonError={errors.keyPerson}
        mobileError={errors.mobile}
      />

      {/* 9. Note */}
      <NoteField
        value={note}
        onChange={(val) => onChangeField('note', val)}
        error={errors.note}
      />

      {/* 10. Accounts Receivable (COA) */}
      <AccountsReceivablePicker
        value={accountsReceivableId}
        onChange={(val) => onChangeField('accountsReceivableId', val)}
        error={errors.accountsReceivableId}
      />

      {/* 11. Attachments */}
      <AttachmentDropzone
        attachments={attachments}
        onChange={(val) => onChangeField('attachments', val)}
        error={errors.attachments}
      />
    </div>
  );
};
