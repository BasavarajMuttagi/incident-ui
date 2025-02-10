import { cn, maintenanceStatusConfig } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface MaintenanceStatusBadgeProps {
  status: keyof typeof maintenanceStatusConfig;
  text?: boolean;
}

export function MaintenanceStatusBadge({
  status,
  text = true,
}: MaintenanceStatusBadgeProps) {
  const config = maintenanceStatusConfig[status];
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
