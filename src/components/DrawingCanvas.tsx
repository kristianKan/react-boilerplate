// DrawingCanvas.tsx
import React, { useRef, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { store, Rectangle } from "../RectangleStore";
import { autorun } from "mobx";

const DrawingCanvas: React.FC = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentRect, setCurrentRect] = useState<Rectangle | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Draw rectangles
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    // Initialize the autorun function
    const disposeAutorun = autorun(() => {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        store.rectangles.forEach((rect) => {
          // Draw all rectangles
          ctx.beginPath();
          ctx.rect(rect.x, rect.y, rect.width, rect.height);
          ctx.stroke();
        });
      }
    });

    // Cleanup autorun on component unmount
    return () => disposeAutorun();
  }, []);

  // Mouse down event
  useEffect(() => {
    const canvas = canvasRef.current;

    const mouseDownHandler = (e: MouseEvent) => {
      const rect = canvas?.getBoundingClientRect();
      const x = e.clientX - (rect?.left ?? 0);
      const y = e.clientY - (rect?.top ?? 0);
      let foundRect = false;

      store.rectangles.forEach((rectangle) => {
        if (
          x > rectangle.x &&
          x < rectangle.x + rectangle.width &&
          y > rectangle.y &&
          y < rectangle.y + rectangle.height
        ) {
          foundRect = true;
          setCurrentRect(rectangle);
          setDragOffset({ x: x - rectangle.x, y: y - rectangle.y });

          // Check for resize handle
          if (
            x > rectangle.x + rectangle.width - 30 &&
            y > rectangle.y + rectangle.height - 30
          ) {
            setIsResizing(true);
          } else {
            setIsDragging(true);
          }
        }
      });

      if (!foundRect) {
        const newRect = new Rectangle(crypto.randomUUID(), x, y, 100, 100); // Default size
        store.addRectangle(newRect.x, newRect.y, newRect.width, newRect.height);
      }
    };

    canvas?.addEventListener("mousedown", mouseDownHandler);

    return () => {
      canvas?.removeEventListener("mousedown", mouseDownHandler);
    };
  }, [canvasRef]);

  // Mouse move event
  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => {
      if (!canvasRef.current || !currentRect) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isDragging) {
        store.rectangles.forEach((rect) => {
          if (rect.id === currentRect.id) {
            rect.x = x - dragOffset.x;
            rect.y = y - dragOffset.y;
          }
        });
      } else if (isResizing) {
        store.rectangles.forEach((rect) => {
          if (rect.id === currentRect.id) {
            rect.width = Math.max(10, x - rect.x);
            rect.height = Math.max(10, y - rect.y);
          }
        });
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", mouseMoveHandler);
    }

    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [isDragging, isResizing, currentRect, dragOffset]);

  // Mouse up event
  useEffect(() => {
    const mouseUpHandler = () => {
      if (isDragging || isResizing) {
        setIsDragging(false);
        setIsResizing(false);
        setCurrentRect(null);
      }
    };

    window.addEventListener("mouseup", mouseUpHandler);

    return () => {
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [isDragging, isResizing]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "1px solid #ccc" }}
    ></canvas>
  );
});

export default DrawingCanvas;
