import { ComponentStatusBadge } from "@/components/ComponentStatusBadge";
import { NewSubscriberDialogPublic } from "@/components/NewSubscriberDialogPublic";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";

const PublicStatus = () => {
  const { orgId } = useParams();
  console.log(orgId);
  return (
    <div className="h-screen">
      <ScrollArea className="h-full">
        <div className="mx-auto max-w-4xl space-y-14 p-4">
          <div className="flex items-center justify-between">
            <span>ACME</span>
            {orgId && <NewSubscriberDialogPublic orgId={orgId} />}
          </div>
          <div className="space-y-5">
            <Alert className="bg-green-600">
              <AlertTitle className="text-xl tracking-wider">
                All Systems Operational
              </AlertTitle>
            </Alert>
            <div className="rounded-lg border">
              {[1, 2, 3, 4, 5].map((_, index, array) => (
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
                      <CardTitle>Create project</CardTitle>
                      <ComponentStatusBadge status="DEGRADED" />
                    </div>
                    <CardDescription>
                      Deploy your new project in one-click.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
export default PublicStatus;
