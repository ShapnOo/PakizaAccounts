import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Store,
  Calculator,
  ShoppingCart,
  Package,
  Monitor,
  Truck,
  Banknote,
  Target,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  Coins,
} from "lucide-react";

interface ModuleConfig {
  id: string;
  name: string;
  icon: any;
  color: string;
  shadow: string;
  path: string;
}

const modules: ModuleConfig[] = [
  {
    id: "accounts",
    name: "Accounts",
    icon: Coins,
    color: "from-blue-600 to-indigo-700",
    shadow: "shadow-blue-500/20",
    path: "/",
  },
  {
    id: "hris",
    name: "HRIS",
    icon: Users,
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20",
    path: "#",
  },
  {
    id: "merchandising",
    name: "Merchandising",
    icon: Store,
    color: "from-teal-500 to-emerald-600",
    shadow: "shadow-teal-500/20",
    path: "#",
  },
  {
    id: "finance",
    name: "Finance",
    icon: Calculator,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
    path: "#",
  },
  {
    id: "procurement",
    name: "Procurement",
    icon: ShoppingCart,
    color: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
    path: "#",
  },
  {
    id: "inventory",
    name: "Inventory",
    icon: Package,
    color: "from-purple-500 to-fuchsia-600",
    shadow: "shadow-purple-500/20",
    path: "#",
  },
  {
    id: "asset",
    name: "Asset",
    icon: Monitor,
    color: "from-rose-500 to-red-600",
    shadow: "shadow-rose-500/20",
    path: "#",
  },
  {
    id: "fleet",
    name: "Fleet",
    icon: Truck,
    color: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/20",
    path: "#",
  },
  {
    id: "payroll",
    name: "Payroll",
    icon: Banknote,
    color: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/20",
    path: "#",
  },
  {
    id: "project",
    name: "Project",
    icon: Target,
    color: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20",
    path: "#",
  },
  {
    id: "dms",
    name: "DMS",
    icon: FileText,
    color: "from-slate-500 to-gray-700",
    shadow: "shadow-slate-500/20",
    path: "#",
  },
  {
    id: "crm",
    name: "CRM",
    icon: HeartHandshake,
    color: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20",
    path: "#",
  },
];

export function ModuleLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Google Waffle Icon Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative size-9 grid place-items-center rounded-lg transition-colors duration-200 cursor-pointer ${
          isOpen
            ? "bg-muted text-primary"
            : "hover:bg-muted text-foreground/80 hover:text-foreground"
        }`}
        title="Google-Style Modules Launcher"
      >
        <svg viewBox="0 0 24 24" className="size-4.5 fill-current">
          <path d="M6 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6-12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6-12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
        </svg>
      </button>

      {/* Launcher Popover */}
      {isOpen && (
        <div className="absolute right-0 top-11.5 w-[320px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4.5 py-3 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <span>Corporate Modules</span>
            <span className="text-primary font-bold text-[9px] uppercase tracking-wider">
              Pakiza Hub
            </span>
          </div>

          {/* Grid of Modules */}
          <div className="max-h-[360px] overflow-y-auto p-3 grid grid-cols-3 gap-2.5 scrollbar-thin">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.id}
                  to={m.path}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-transparent hover:border-slate-200/60 hover:bg-slate-50/70 dark:hover:border-slate-800/50 dark:hover:bg-slate-950/40 transition duration-200 group text-center cursor-pointer"
                >
                  <div
                    className={`size-10.5 rounded-xl bg-gradient-to-br ${m.color} ${m.shadow} flex items-center justify-center text-white transition-all duration-300 group-hover:scale-108 group-hover:-rotate-3 shadow-md`}
                  >
                    <Icon className="size-4.5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350 truncate w-full group-hover:text-primary transition-colors">
                    {m.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
