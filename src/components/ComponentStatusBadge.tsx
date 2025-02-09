import { cn, componentStatusConfig } from "@/lib/utils";
import { Badge } from "./ui/badge";

// Component Status Badge
interface ComponentStatusBadgeProps {
  status: keyof typeof componentStatusConfig;
}

export function ComponentStatusBadge({ status }: ComponentStatusBadgeProps) {
  const config = componentStatusConfig[status];
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
