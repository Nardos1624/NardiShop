"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  className?: string;
}

/**
 * QuantitySelector lets the shopper decrease or increase how many of a
 * product they want with -/+ buttons.
 */
export default function QuantitySelector({ value, onChange, min = 1, className = "" }: QuantitySelectorProps) {
  return (
    <div className={`inline-flex items-center rounded-md border border-zinc-300 ${className}`}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center text-sm font-medium" aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
