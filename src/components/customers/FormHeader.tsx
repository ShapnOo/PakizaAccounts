import React from 'react';
import { ArrowLeft, User, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormHeaderProps {
  title: string;
  subtitle: string;
  dirty?: boolean;
  onCancel?: () => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  subtitle,
  dirty = false,
}) => {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-border/80">
      <div className="flex items-center gap-3">
        <Link
          to="/customers"
          className="size-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs"
          title="Back to Customer List"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tight text-foreground">
              {title}
            </h1>
            {dirty && (
              <span
                className="size-2 rounded-full bg-amber-500 animate-pulse"
                title="Unsaved changes in form"
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
