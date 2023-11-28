// import { Card } from "@/components/ui/card";
// import { CardSkeleton } from "@/components/card-skeleton";
// import { DashboardHeader } from "@/components/Header";
// import { DashboardShell } from "@/components/Shell";
import { Loader2 } from "lucide-react";

export default function DashboardSettingsLoading() {
  return (
    //Loading Spinner in the middle
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    </div>
  );
}

// <DashboardShell>
//   <DashboardHeader
//     heading="Settings"
//     text="Manage account and website settings."
//   />
//   <div className="grid gap-10">
//     <CardSkeleton />
//   </div>
// </DashboardShell>;
