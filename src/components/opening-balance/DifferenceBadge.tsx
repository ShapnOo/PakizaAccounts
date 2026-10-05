import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/format';

interface DifferenceBadgeProps {
  difference: number;
  balanced: boolean;
  shake?: boolean;
}

export const DifferenceBadge: React.FC<DifferenceBadgeProps> = ({
  difference,
  balanced,
  shake,
}) => {
  const isZero = balanced || Math.abs(difference) < 0.01;

  return (
    <motion.div
      animate={shake ? { x: [-6, 6, -4, 4, -2, 2, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors shadow-2xs ${
        isZero
          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25 ring-1 ring-emerald-500/20'
          : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25 ring-1 ring-rose-500/20'
      }`}
    >
      {isZero ? (
        <>
          <CheckCircle2 className="size-3.5 text-emerald-600 stroke-[2.5]" />
          <span>Balanced ✓</span>
        </>
      ) : (
        <>
          <AlertCircle className="size-3.5 text-rose-600 stroke-[2.5]" />
          <span>
            Difference: {difference > 0 ? `+${formatCurrency(difference)}` : formatCurrency(difference)} BDT
          </span>
        </>
      )}
    </motion.div>
  );
};
