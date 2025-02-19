import { ComponentType } from "@/components/ComponentsTable";
import { ComponentStatusBadge } from "@/components/ComponentStatusBadge";
import {
  IncidentTimelineType,
  IncidentType,
} from "@/components/IncidentsTable";
import { IncidentStatusBadge } from "@/components/IncidentStatusBadge";
import { MaintenanceStatusBadge } from "@/components/MaintenanceStatusBadge";
import {
  MaintenanceTimelineType,
  MaintenanceType,
} from "@/components/MaintenanceTable";
import { NewSubscriberDialogPublic } from "@/components/NewSubscriberDialogPublic";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSocket from "@/hooks/useSocket";
import { calculateMaintenanceStatus, cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const PublicStatus = () => {
  const { orgId } = useParams();
  const { socket, status } = useSocket();
  const [components, setComponents] = useState<ComponentType[]>([]);
  const [incidents, setIncidents] = useState<IncidentType[]>([]);
  const [maintenances, setMaintenances] = useState<MaintenanceType[]>([]);

  const hasNonOperationalComponent = components.some(
    (component) => component.status !== "OPERATIONAL",
  );
  useEffect(() => {
    if (!socket || status !== "connected" || !orgId) return;

    socket.emit("join", orgId);
    socket.emit("get-components", orgId, (data: ComponentType[]) => {
      setComponents(data);
    });
    socket.emit("get-incidents", orgId, (incidents: IncidentType[]) => {
      setIncidents(incidents);
    });
    socket.emit(
      "get-maintenances",
      orgId,
      (maintenances: MaintenanceType[]) => {
        setMaintenances(maintenances);
      },
    );
    socket.on("new-component", (data: ComponentType) => {
      console.log(data);
      setComponents((prev) => [data, ...prev]);
    });
    socket.on("component-deleted", (id: string) => {
      setComponents((prev) => prev.filter((p) => p.id !== id));
    });
    socket.on("component-update", (data: ComponentType) => {
      setComponents((prevComponents) => [
        ...prevComponents.map((e) => (e.id === data.id ? data : e)),
      ]);
    });
    socket.on("new-incident", (data: IncidentType) => {
      setIncidents((prev) => [data, ...prev]);
    });

    socket.on("incident-deleted", (id: string) => {
      setIncidents((prev) => prev.filter((p) => p.id !== id));
    });

    socket.on("incident-updated", (data: IncidentType) => {
      setIncidents((prevIncidents) => [
        ...prevIncidents.map((e) => (e.id === data.id ? data : e)),
      ]);
    });

    socket.on("timeline-updated", (data: IncidentTimelineType) => {
      setIncidents((prevIncidents) =>
        prevIncidents.map((i) =>
          i.id === data.incidentId
            ? { ...i, IncidentTimeline: [data, ...i.IncidentTimeline] }
            : i,
        ),
      );
    });

    socket.on("new-maintenance", (data: MaintenanceType) => {
      setMaintenances((prev) => [data, ...prev]);
    });

    socket.on("maintenance-deleted", (id: string) => {
      setMaintenances((prev) => prev.filter((p) => p.id !== id));
    });

    socket.on("maintenance-updated", (data: MaintenanceType) => {
      setMaintenances((prevMaintenances) => [
        ...prevMaintenances.map((e) => (e.id === data.id ? data : e)),
      ]);
    });

    socket.on(
      "maintenance-timeline-updated",
      (data: MaintenanceTimelineType) => {
        setMaintenances((prevIncidents) =>
          prevIncidents.map((i) =>
            i.id === data.maintenanceId
              ? { ...i, timeline: [data, ...i.timeline] }
              : i,
          ),
        );
      },
    );

    socket.on(
      "incident-timeline-deleted",
      (incidentId: string, updateId: string) => {
        setIncidents((prevIncidents) =>
          prevIncidents.map((incident) =>
            incident.id === incidentId
              ? {
                  ...incident,
                  IncidentTimeline: incident.IncidentTimeline.filter(
                    (update) => update.id !== updateId,
                  ),
                }
              : incident,
          ),
        );
      },
    );

    socket.on(
      "maintenance-timeline-deleted",
      (maintenanceId: string, updateId: string) => {
        console.log(maintenanceId, updateId);
        setMaintenances((prevMaintenances) =>
          prevMaintenances.map((maintenance) =>
            maintenance.id === maintenanceId
              ? {
                  ...maintenance,
                  timeline: maintenance.timeline.filter(
                    (update) => update.id !== updateId,
                  ),
                }
              : maintenance,
          ),
        );
      },
    );

    return () => {
      socket.removeAllListeners();
    };
  }, [orgId, status, socket]);

  return (
    <div className="h-screen">
      <ScrollArea className="h-full">
        <div className="mx-auto max-w-4xl space-y-14 p-4">
          <div className="flex items-center justify-between">
            <span>ACME</span>
            {orgId && <NewSubscriberDialogPublic orgId={orgId} />}
          </div>
          <div className="space-y-10">
            {components.length > 0 && (
              <Alert
                className={cn(
                  hasNonOperationalComponent ? "bg-yellow-600" : "bg-green-600",
                )}
              >
                <AlertTitle className="text-lg font-normal">
                  {hasNonOperationalComponent
                    ? "Some systems are experiencing issues"
                    : "All Systems Operational"}
                </AlertTitle>
              </Alert>
            )}
            <div className="space-y-2">
              <h1 className="text-lg font-semibold">Components</h1>
              <div className="rounded-lg border">
                {components?.map((data, index, array) => (
                  <Card
                    key={index}
                    className={cn(
                      "w-full rounded-none border-b border-l-0 border-r-0 border-t-0",
                      index === array.length - 1 && "border-b-0",
                      array.length === 1 && "rounded-lg",
                      index === 0 && "rounded-t-lg",
                      index === array.length - 1 && "rounded-b-lg",
                    )}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{data.name}</CardTitle>
                        <ComponentStatusBadge status={data.status} />
                      </div>
                      <CardDescription>{data.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-lg font-semibold">Incidents</h1>
              <div className="space-y-2 rounded-lg">
                {incidents?.map((data) => (
                  <Card key={data.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{data.title}</CardTitle>
                        <IncidentStatusBadge status={data.status} />
                      </div>
                      <CardDescription className="text-xs">
                        <div className="text-white/90">{data.description}</div>
                        <div>
                          {format(
                            new Date(data.createdAt),
                            "MMM dd, yyyy hh:mm:ss a",
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {data.IncidentTimeline.map((timeline) => (
                        <Alert className="space-y-3" key={timeline.id}>
                          <IncidentStatusBadge status={timeline.status} />
                          <AlertTitle className="text-xs font-normal text-white/60">
                            {format(
                              new Date(timeline.createdAt),
                              "MMM dd, yyyy hh:mm:ss a",
                            )}
                          </AlertTitle>
                          <AlertDescription className="text-sm font-medium">
                            {timeline.message}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-lg font-semibold">Scheduled Maintenance</h1>
              <div className="space-y-2 rounded-lg">
                {maintenances?.map((data) => (
                  <Card key={data.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{data.title}</CardTitle>
                        <MaintenanceStatusBadge
                          status={calculateMaintenanceStatus(
                            data.startAt,
                            data.endAt,
                          )}
                        />
                      </div>
                      <CardDescription className="text-xs">
                        <div className="mb-2 text-white/90">
                          {data.description}
                        </div>
                        <div className="space-y-1">
                          <div>
                            Starts:
                            {format(
                              new Date(data.startAt),
                              "MMM dd, yyyy hh:mm:ss a",
                            )}
                          </div>

                          <div>
                            Ends:
                            {data.endAt
                              ? format(
                                  new Date(data.endAt),
                                  "MMM dd, yyyy hh:mm:ss a",
                                )
                              : "---"}
                          </div>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {data.timeline.map((timeline) => (
                        <Alert className="space-y-3" key={timeline.id}>
                          <IncidentStatusBadge status={timeline.status} />
                          <AlertTitle className="text-xs font-normal text-white/60">
                            {format(
                              new Date(timeline.createdAt),
                              "MMM dd, yyyy hh:mm:ss a",
                            )}
                          </AlertTitle>
                          <AlertDescription className="text-sm font-medium">
                            {timeline.message}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
export default PublicStatus;
