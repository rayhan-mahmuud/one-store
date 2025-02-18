import { cn } from "@/lib/utils";

export default function ProductPrice({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  //Ensure 2 decimal places
  const strValue = Number(value).toFixed(2);
  const [intValue, floatValue] = strValue.trim().split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
}
