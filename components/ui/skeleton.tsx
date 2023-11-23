import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-300/80 dark:bg-gray-100/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
