import { cn, componentStatusConfig } from "@/lib/utils";
import { Badge } from "./ui/badge";

// Component Status Badge
interface ComponentStatusBadgeProps {
  status: keyof typeof componentStatusConfig;
  text?: boolean;
}

export function ComponentStatusBadge({
  status,
  text = true,
}: ComponentStatusBadgeProps) {
  const config = componentStatusConfig[status];
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
