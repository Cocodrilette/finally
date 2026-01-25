import { useAppStore } from "@/store/app.store";

export function HiddableValue({
  value,
  className,
  ...props
}: {
  value: string;
  className?: string;
}) {
  const { hideValues } = useAppStore();

  return (
    <span className={className}>
      {hideValues ? "*".repeat(value.length + 1) : value}
    </span>
  );
}
