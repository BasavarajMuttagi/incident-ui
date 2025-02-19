import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttachComponentDialog } from "./AttachComponentDialog";
import { AttachedComponents } from "./AttachedComponents";
import { IncidentTimelineForm } from "./IncidentTimelineForm";
import { IncidentUpdates } from "./IncidentUpdates";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function IncidentEditTabs({ incidentId }: { incidentId: string }) {
  return (
    <Tabs defaultValue="updates" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="components">Components</TabsTrigger>
        <TabsTrigger value="updates">Updates</TabsTrigger>
      </TabsList>
      <TabsContent value="components">
        <Card className="w-full bg-zinc-900">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between text-xl">
              <span>Components</span>
              <AttachComponentDialog incidentId={incidentId} />
            </CardTitle>
          </CardHeader>

          <CardContent className="mt-2 min-h-52 space-y-2 p-0">
            <AttachedComponents incidentId={incidentId} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="updates">
        <Card className="w-full bg-zinc-900">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between text-xl">
              <span>Updates</span>
              <IncidentTimelineForm incidentId={incidentId} />
            </CardTitle>
          </CardHeader>

          <CardContent className="mt-2 min-h-52 space-y-2 p-0">
            <IncidentUpdates incidentId={incidentId} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
