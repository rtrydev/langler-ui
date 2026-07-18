"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type DrawingPadProps = Omit<ComponentProps<"canvas">, "onChange"> & {
  guide?: string;
  clearSignal?: number;
  onDraw?: () => void;
};

export function DrawingPad({
  guide,
  clearSignal = 0,
  onDraw,
  className,
  ...props
}: DrawingPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [clearSignal]);

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
      y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
    };
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    drawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const current = point(event);
    context.beginPath();
    context.moveTo(current.x, current.y);
    onDraw?.();
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    const current = point(event);
    context.lineWidth = 5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#1f1d1a";
    context.lineTo(current.x, current.y);
    context.stroke();
  }

  return (
    <div className="glyph-guides relative aspect-square overflow-hidden rounded-lg border border-dashed border-line bg-surface">
      {guide ? (
        <span className="pointer-events-none absolute inset-0 grid place-items-center font-jp-serif text-[clamp(4rem,18vw,8rem)] text-line">
          {guide}
        </span>
      ) : null}
      <canvas
        aria-label="Drawing practice area"
        className={cn("absolute inset-0 size-full touch-none cursor-crosshair", className)}
        height={320}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={() => { drawing.current = false; }}
        onPointerCancel={() => { drawing.current = false; }}
        ref={canvasRef}
        width={320}
        {...props}
      />
    </div>
  );
}
