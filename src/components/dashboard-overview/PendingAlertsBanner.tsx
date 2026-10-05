import { Link } from 'react-router-dom';
import {
  BellRing,
  AlertTriangle,
  CalendarCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { getPendingAlerts } from '../../services/dashboardService';

export function PendingAlertsBanner() {
  const alerts = getPendingAlerts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {alerts.map((alert) => {
        const isWarning = alert.type === 'warning';
        const isSuccess = alert.type === 'success';

        return (
          <div
            key={alert.id}
            className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
              isWarning
                ? 'bg-amber-500/10 border-amber-300 dark:border-amber-900/60 text-amber-950 dark:text-amber-100'
                : isSuccess
                ? 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-100'
                : 'bg-blue-500/10 border-blue-300 dark:border-blue-900/60 text-blue-950 dark:text-blue-100'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isWarning
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : isSuccess
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                }`}
              >
                {isWarning ? (
                  <AlertTriangle className="size-4" />
                ) : isSuccess ? (
                  <CalendarCheck className="size-4" />
                ) : (
                  <Sparkles className="size-4" />
                )}
              </div>

              <div className="min-w-0">
                <h4 className="text-xs font-bold truncate">{alert.title}</h4>
                <p className="text-[11px] opacity-80 line-clamp-1">
                  {alert.description}
                </p>
              </div>
            </div>

            <Link
              to={alert.link}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                isWarning
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : isSuccess
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <span>{alert.actionLabel}</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
