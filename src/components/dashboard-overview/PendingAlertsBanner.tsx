import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react';
import { getPendingAlerts } from '../../services/dashboardService';

export function PendingAlertsBanner() {
  const [dismissed, setDismissed] = useState(false);
  const alerts = getPendingAlerts();

  if (dismissed || alerts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {alerts.map((alert) => {
        const isWarning = alert.type === 'warning';
        const isSuccess = alert.type === 'success';

        return (
          <div
            key={alert.id}
            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/70 bg-card hover:border-border transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isWarning
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : isSuccess
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
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
                <h4 className="text-xs font-semibold text-foreground truncate">
                  {alert.title}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {alert.description}
                </p>
              </div>
            </div>

            <Link
              to={alert.link}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted hover:bg-muted/80 text-foreground transition-all shrink-0"
            >
              <span>{alert.actionLabel}</span>
              <ArrowRight className="size-3 text-muted-foreground" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
