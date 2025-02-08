import { NewSubscriberDialog } from "@/components/NewSubscriberDialog";
import { SubscribersTable } from "@/components/SubscribersTable";

const Subscribers = () => {
  return (
    <>
      <div className="absolute right-0 top-1">
        <NewSubscriberDialog />
      </div>
      <SubscribersTable />
    </>
  );
};

export default Subscribers;
