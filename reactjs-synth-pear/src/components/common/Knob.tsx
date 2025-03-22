import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";

const KnobContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const KnobOuter = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #2a2a2a;
  position: relative;
  cursor: pointer;
  border: 2px solid ${(props) => props.$color};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const KnobInner = styled.div<{ $rotation: number; $color: string }>`
  width: 4px;
  height: 20px;
  background-color: ${(props) => props.$color};
  position: absolute;
  left: 50%;
  bottom: 50%;
  transform: translateX(-50%) rotate(${(props) => props.$rotation}deg);
  transform-origin: bottom center;
  border-radius: 2px;
`;

const ValueDisplay = styled.div`
  background: #1a1a1a;
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 60px;
  text-align: center;
`;

interface KnobProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  color?: string;
  label?: string;
  unit?: string;
  size?: "small" | "medium" | "large";
}

export const Knob: React.FC<KnobProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  color = "#00e5ff",
  label,
  unit = "",
  size = "medium",
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(0);

  const normalizedValue = ((value - min) / (max - min)) * 270 - 135;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartValue(value);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const sensitivity = 0.5;
    const deltaY = (startY - e.clientY) * sensitivity;
    const range = max - min;
    const newValue = Math.min(
      max,
      Math.max(min, startValue + (deltaY / 100) * range)
    );
    const steppedValue = Math.round(newValue / step) * step;

    onChange(steppedValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? -1 : 1;
    const newValue = Math.min(max, Math.max(min, value + direction * step));
    onChange(newValue);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <KnobContainer>
      {label && (
        <Typography variant="caption" color="textSecondary">
          {label}
        </Typography>
      )}
      <KnobOuter
        ref={knobRef}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        $color={color}
      >
        <KnobInner $rotation={normalizedValue} $color={color} />
      </KnobOuter>
      <ValueDisplay>
        <Typography variant="caption" color="textPrimary">
          {value.toFixed(step >= 1 ? 0 : 2)}
          {unit}
        </Typography>
      </ValueDisplay>
    </KnobContainer>
  );
};
