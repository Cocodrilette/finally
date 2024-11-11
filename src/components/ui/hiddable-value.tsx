import { useAppStore } from "@/store/app.store";

export function HiddableValue({ value, ...props }: { value: string }) {
  const { hideValues } = useAppStore();

  return <span>{hideValues ? "*".repeat(value.length + 1) : value}</span>;
}
