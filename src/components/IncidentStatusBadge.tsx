import { cn, incidentStatusConfig } from "@/lib/utils";
import { Badge } from "./ui/badge";

// Incident Status Badge
interface IncidentStatusBadgeProps {
  status: keyof typeof incidentStatusConfig;
}

export function IncidentStatusBadge({ status }: IncidentStatusBadgeProps) {
  const config = incidentStatusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        config.color,
        "pointer-events-none flex items-center gap-1",
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm capitalize">{config.label}</span>
    </Badge>
  );
}
