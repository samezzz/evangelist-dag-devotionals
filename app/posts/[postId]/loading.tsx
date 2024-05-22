import { Loader2 } from "lucide-react";

export default function PostItemSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    </div>
  );
}
