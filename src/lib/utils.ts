import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const copIntl = new Intl.NumberFormat("es-CO", {
  style: "decimal",
  currency: "COP",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function formatCurrency(value: number) {
  return copIntl.format(value);
}
