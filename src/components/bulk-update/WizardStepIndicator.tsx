import React from 'react';
import { Filter, CheckSquare, Edit3, Check } from 'lucide-react';

interface WizardStepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export const WizardStepIndicator: React.FC<WizardStepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { num: 1, label: 'Filter Criteria', icon: Filter },
    { num: 2, label: 'Select Vouchers', icon: CheckSquare },
    { num: 3, label: 'Apply Update', icon: Edit3 },
  ];

  return (
    <div className="flex items-center justify-between w-full max-w-lg mx-auto py-3 px-4 mb-4 border-b border-slate-100">
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.num;
        const isCurrent = currentStep === step.num;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.num}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-sm'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.num}
              </div>
              <span
                className={`text-xs font-medium hidden sm:inline ${
                  isCurrent
                    ? 'text-slate-900 font-semibold'
                    : isCompleted
                    ? 'text-emerald-700 font-medium'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 sm:mx-3 rounded transition-colors ${
                  currentStep > step.num ? 'bg-emerald-400' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
