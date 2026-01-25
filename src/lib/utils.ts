import { AssetHistory } from "@/types";
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

export function generateHexColor(input: string): string {
  // Hash the input string to produce a consistent number
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash to a hex color
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }

  return color;
}

export const shortDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "2-digit",
    month: "short",
    day: "numeric",
  });
