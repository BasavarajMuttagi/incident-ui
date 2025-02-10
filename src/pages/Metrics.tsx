import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Metrics = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Coming Soon</AlertTitle>
            <AlertDescription>
              The metrics dashboard is currently under development. Check back
              later for detailed analytics and insights.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default Metrics;
