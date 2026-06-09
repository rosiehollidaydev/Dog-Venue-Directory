import { cn } from "@/lib/utils";

interface AmenityBadgeProps {
  label: string;
  icon: string;
  active: boolean;
  className?: string;
}

export default function AmenityBadge({ label, icon, active, className }: AmenityBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors",
        active
          ? "border-mint bg-mint/10 text-charcoal"
          : "border-gray-100 bg-gray-50 text-gray-400",
        className
      )}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
