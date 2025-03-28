type Props = {
  quantity: number;
};

const Skeleton = ({ quantity }: Props) => {
  return new Array(quantity).fill(0).map((_, index) => (
    <div key={index} className="p-2 flex items-center gap-4">
      <div className="size-12 rounded-full bg-primary/10 dark:bg-foreground/10 animate-pulse" />
      <div className="space-y-2">
        <div className="w-36 h-4 rounded-md bg-primary/10 dark:bg-foreground/10 animate-pulse" />
        <div className="w-20 h-4 rounded-md bg-primary/10 dark:bg-foreground/10 animate-pulse" />
      </div>
    </div>
  ));
};

export default Skeleton;
