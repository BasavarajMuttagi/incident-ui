import { cn, incidentStatusConfig } from "@/lib/utils";
import { Badge } from "./ui/badge";

// Incident Status Badge
interface IncidentStatusBadgeProps {
  status: keyof typeof incidentStatusConfig;
  text?: boolean;
}

export function IncidentStatusBadge({
  status,
  text = true,
}: IncidentStatusBadgeProps) {
  const config = incidentStatusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        config.color,
        "pointer-events-none flex w-fit items-center gap-1",
      )}
    >
      <Icon className="h-4 w-4" />
      {text && <span className="text-xs capitalize">{config.label}</span>}
    </Badge>
  );
}
