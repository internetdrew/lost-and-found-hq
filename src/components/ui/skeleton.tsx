import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-testid='location-info-skeleton'
      className={cn('animate-pulse rounded-md bg-primary/10', className)}
      {...props}
    />
  );
}

export { Skeleton };
