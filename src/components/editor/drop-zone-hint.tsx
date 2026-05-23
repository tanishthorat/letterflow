import { cn } from "@/lib/utils";

interface DropZoneHintProps {
  isOver: boolean;
  label?: string;
  colorClass?: string;
}

export function DropZoneHint({ isOver, label = "Drop here", colorClass = "bg-primary" }: DropZoneHintProps) {
  return (
    <>
      <div className={cn(
        "w-full h-0.5 rounded-full shadow-sm transition-all duration-200",
        colorClass,
        isOver ? "scale-x-100" : "scale-x-0"
      )} />
      {isOver && (
        <div className={cn(
          "absolute text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-md whitespace-nowrap z-50 pointer-events-none transform -translate-y-1/2 top-1/2",
          colorClass
        )}>
          {label}
        </div>
      )}
    </>
  );
}