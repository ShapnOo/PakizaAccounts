import React from 'react';
import { User, Phone } from 'lucide-react';

interface KeyPersonMobilePairProps {
  keyPerson: string;
  mobile: string;
  onChangeKeyPerson: (val: string) => void;
  onChangeMobile: (val: string) => void;
  keyPersonError?: string;
  mobileError?: string;
}

export const KeyPersonMobilePair: React.FC<KeyPersonMobilePairProps> = ({
  keyPerson,
  mobile,
  onChangeKeyPerson,
  onChangeMobile,
  keyPersonError,
  mobileError,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Key Person */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-bold text-foreground flex items-center gap-1.5">
          <User className="size-3 text-indigo-600" />
          <span>Key Person</span>
        </label>
        <input
          type="text"
          placeholder="Contact person name..."
          value={keyPerson}
          onChange={(e) => onChangeKeyPerson(e.target.value)}
          className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none shadow-2xs ${
            keyPersonError
              ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
              : 'border-border focus:ring-1 focus:ring-indigo-500'
          }`}
        />
        {keyPersonError && (
          <p className="text-[10.5px] text-rose-500 font-medium">
            {keyPersonError}
          </p>
        )}
      </div>

      {/* Mobile */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-bold text-foreground flex items-center gap-1.5">
          <Phone className="size-3 text-indigo-600" />
          <span>Mobile Phone</span>
        </label>
        <input
          type="tel"
          placeholder="+880 1711 000000"
          value={mobile}
          onChange={(e) => onChangeMobile(e.target.value)}
          className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-mono font-medium text-foreground outline-none shadow-2xs ${
            mobileError
              ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
              : 'border-border focus:ring-1 focus:ring-indigo-500'
          }`}
        />
        {mobileError && (
          <p className="text-[10.5px] text-rose-500 font-medium">
            {mobileError}
          </p>
        )}
      </div>
    </div>
  );
};
