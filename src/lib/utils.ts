import { clsx, type ClassValue } from "clsx";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  Search,
  Shield,
  XCircle,
} from "lucide-react";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TimelineSize = "sm" | "md" | "lg";
export type TimelineStatus = "completed" | "in-progress" | "pending";
export type TimelineColor =
  | "primary"
  | "secondary"
  | "muted"
  | "accent"
  | "destructive";

export interface TimelineElement {
  id: number;
  date: string;
  title: string;
  description: string;
  icon?: ReactNode | (() => ReactNode);
  status?: TimelineStatus;
  color?: TimelineColor;
  size?: TimelineSize;
  loading?: boolean;
  error?: string;
}

export interface TimelineProps {
  items: TimelineElement[];
  size?: TimelineSize;
  animate?: boolean;
  iconColor?: TimelineColor;
  connectorColor?: TimelineColor;
  className?: string;
}

export const componentStatusOptions = [
  {
    value: "OPERATIONAL",
    label: "Operational",
    icon: CheckCircle,
    className:
      "bg-emerald-500/20 text-emerald-500 data-[state=on]:bg-emerald-500 data-[state=on]:text-white",
  },
  {
    value: "DEGRADED",
    label: "Degraded",
    icon: Activity,
    className:
      "bg-yellow-500/20 text-yellow-500 data-[state=on]:bg-yellow-500 data-[state=on]:text-white",
  },
  {
    value: "PARTIAL_OUTAGE",
    label: "Partial Outage",
    icon: AlertCircle,
    className:
      "bg-orange-500/20 text-orange-500 data-[state=on]:bg-orange-500 data-[state=on]:text-white",
  },
  {
    value: "MAJOR_OUTAGE",
    label: "Major Outage",
    icon: XCircle,
    className:
      "bg-red-500/20 text-red-500 data-[state=on]:bg-red-500 data-[state=on]:text-white",
  },
];

export const incidentStatusConfig = {
  INVESTIGATING: {
    color: "bg-blue-500/15 text-blue-400",
    icon: Search,
    label: "investigating",
  },
  IDENTIFIED: {
    color: "bg-violet-500/15 text-violet-400",
    icon: AlertCircle,
    label: "identified",
  },
  MONITORING: {
    color: "bg-yellow-500/15 text-yellow-400",
    icon: Shield,
    label: "monitoring",
  },
  RESOLVED: {
    color: "bg-green-500/15 text-green-400",
    icon: CheckCircle,
    label: "resolved",
  },
};

export const incidentStatusOptions = [
  {
    value: "INVESTIGATING",
    label: "Investigating",
    icon: Search,
    className:
      "bg-blue-500/20 text-blue-500 data-[state=on]:bg-blue-500 data-[state=on]:text-white",
  },
  {
    value: "IDENTIFIED",
    label: "Identified",
    icon: AlertCircle,
    className:
      "bg-violet-500/20 text-violet-500 data-[state=on]:bg-violet-500 data-[state=on]:text-white",
  },
  {
    value: "MONITORING",
    label: "Monitoring",
    icon: Shield,
    className:
      "bg-yellow-500/20 text-yellow-500 data-[state=on]:bg-yellow-500 data-[state=on]:text-white",
  },
  {
    value: "RESOLVED",
    label: "Resolved",
    icon: CheckCircle,
    className:
      "bg-green-500/20 text-green-500 data-[state=on]:bg-green-500 data-[state=on]:text-white",
  },
];

export const componentStatusConfig = {
  OPERATIONAL: {
    color: "bg-emerald-500/20 text-emerald-500",
    icon: CheckCircle,
    label: "operational",
  },
  DEGRADED: {
    color: "bg-yellow-500/20 text-yellow-500",
    icon: Activity,
    label: "degraded",
  },
  PARTIAL_OUTAGE: {
    color: "bg-orange-500/20 text-orange-500",
    icon: AlertCircle,
    label: "partial outage",
  },
  MAJOR_OUTAGE: {
    color: "bg-red-500/20 text-red-500",
    icon: XCircle,
    label: "major outage",
  },
};

export const maintenanceStatusConfig = {
  SCHEDULED: {
    label: "Scheduled",
    color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    icon: Calendar,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    icon: Clock,
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    icon: XCircle,
  },
};

export const maintenanceStatusOptions = [
  {
    label: "Scheduled",
    value: "SCHEDULED",
    icon: Calendar,
    className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
    icon: Clock,
    className: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  },
  {
    label: "Completed",
    value: "COMPLETED",
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
    icon: XCircle,
    className: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  },
] as const;

export const calculateMaintenanceStatus = (
  startAt: Date,
  endAt: Date,
): "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" => {
  const now = new Date();

  if (now < new Date(startAt)) {
    return "SCHEDULED";
  } else if (now >= new Date(startAt) && now <= new Date(endAt)) {
    return "IN_PROGRESS";
  } else if (now > new Date(endAt)) {
    return "COMPLETED";
  }

  return "SCHEDULED"; // Default status
};
