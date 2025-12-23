"use client";

export function FitText({ text, className = "" }: { text: string, className?: string }) {
  // Simple heuristic: clearer and faster than measuring DOM elements
  const length = text.length;
  let scaleClass = "text-6xl"; // Default size

  if (length > 30) scaleClass = "text-3xl";       // Very long names
  else if (length > 20) scaleClass = "text-4xl";  // Long names
  else if (length > 15) scaleClass = "text-5xl";  // Medium names
  else scaleClass = "text-6xl md:text-8xl";       // Short names (Full Power)

  return (
    <div className={`${scaleClass} ${className} transition-all duration-300 ease-out`}>
      {text}
    </div>
  );
}