"use client";

import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface DecimalInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "step" | "onChange"> {
  value?: number | string;
  onChange?: (value: number) => void;
  maxDecimals?: number;
  allowNegative?: boolean;
}

/**
 * Input especializado para números decimales con alta precisión
 * Soporta hasta 16 decimales para criptomonedas de bajo valor
 */
const DecimalInput = React.forwardRef<HTMLInputElement, DecimalInputProps>(
  (
    {
      className,
      value = "",
      onChange,
      maxDecimals = 16,
      allowNegative = false,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    // Sincronizar valor externo con valor de display
    React.useEffect(() => {
      if (!isFocused) {
        if (value === "" || value === 0) {
          setDisplayValue("");
        } else {
          // Formatear el número manteniendo todos los decimales significativos
          const numValue = typeof value === "string" ? parseFloat(value) : value;
          if (!isNaN(numValue)) {
            // Usar notación científica si es muy pequeño
            if (numValue > 0 && numValue < 0.000001) {
              setDisplayValue(numValue.toExponential(maxDecimals));
            } else {
              setDisplayValue(numValue.toString());
            }
          }
        }
      }
    }, [value, isFocused, maxDecimals]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Permitir string vacío
      if (inputValue === "") {
        setDisplayValue("");
        onChange?.(0);
        return;
      }

      // Regex para validar número decimal con precisión
      const decimalRegex = allowNegative
        ? /^-?\d*\.?\d*$/
        : /^\d*\.?\d*$/;

      if (!decimalRegex.test(inputValue)) {
        return; // Ignorar entrada inválida
      }

      // Limitar número de decimales
      if (inputValue.includes(".")) {
        const [, decimals] = inputValue.split(".");
        if (decimals && decimals.length > maxDecimals) {
          return; // No permitir más decimales del límite
        }
      }

      setDisplayValue(inputValue);

      // Parsear y enviar el valor numérico
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        onChange?.(numValue);
      } else if (inputValue.endsWith(".")) {
        // Permitir punto decimal al final mientras se escribe
        const baseValue = parseFloat(inputValue.slice(0, -1));
        if (!isNaN(baseValue)) {
          onChange?.(baseValue);
        }
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      // Si el valor es 0, limpiar el input
      if (e.target.value === "0") {
        setDisplayValue("");
      }
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      
      // Normalizar el valor al desenfocar
      if (displayValue && displayValue !== "-") {
        const numValue = parseFloat(displayValue);
        if (!isNaN(numValue)) {
          // Limpiar ceros innecesarios pero mantener precisión
          if (numValue > 0 && numValue < 0.000001) {
            setDisplayValue(numValue.toExponential(maxDecimals));
          } else {
            setDisplayValue(numValue.toString());
          }
        }
      }
      
      onBlur?.(e);
    };

    return (
      <div className="relative">
        <Input
          type="text"
          inputMode="decimal"
          ref={ref}
          className={cn(className)}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {/* Mostrar hint cuando está enfocado y el valor es muy pequeño */}
        {isFocused && displayValue && parseFloat(displayValue) < 0.000001 && parseFloat(displayValue) > 0 && (
          <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
            {parseFloat(displayValue).toFixed(maxDecimals).replace(/\.?0+$/, "")}
          </div>
        )}
      </div>
    );
  }
);

DecimalInput.displayName = "DecimalInput";

export { DecimalInput };
