import React from "react";
import { Slider as MuiSlider, Typography, Box } from "@mui/material";
import styled from "styled-components";

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 120px;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  color?: string;
  orientation?: "horizontal" | "vertical";
  size?: "small" | "medium";
  valueLabelFormat?: (value: number) => string;
}

export const Slider: React.FC<CustomSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  unit = "",
  color = "#00e5ff",
  orientation = "horizontal",
  size = "medium",
  valueLabelFormat,
}) => {
  const handleChange = (_: Event, newValue: number | number[]) => {
    onChange(newValue as number);
  };

  const formatValue = (value: number) => {
    if (valueLabelFormat) {
      return valueLabelFormat(value);
    }
    return `${value.toFixed(step >= 1 ? 0 : 2)}${unit}`;
  };

  return (
    <SliderContainer>
      <SliderLabel>
        {label && (
          <Typography variant="caption" color="textSecondary">
            {label}
          </Typography>
        )}
        <Typography variant="caption" color="textPrimary">
          {formatValue(value)}
        </Typography>
      </SliderLabel>
      <Box sx={{ height: orientation === "vertical" ? 150 : "auto" }}>
        <MuiSlider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          orientation={orientation}
          sx={{
            color: color,
            "& .MuiSlider-thumb": {
              width: size === "small" ? 12 : 20,
              height: size === "small" ? 12 : 20,
            },
            "& .MuiSlider-track": {
              border: "none",
            },
          }}
        />
      </Box>
    </SliderContainer>
  );
};

// Specialized version for time-based parameters (ms/s)
export const TimeSlider: React.FC<
  Omit<CustomSliderProps, "valueLabelFormat" | "unit">
> = (props) => {
  const formatTime = (value: number) => {
    return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${value}ms`;
  };

  return <Slider {...props} valueLabelFormat={formatTime} />;
};

// Specialized version for frequency parameters (Hz/kHz)
export const FrequencySlider: React.FC<
  Omit<CustomSliderProps, "valueLabelFormat" | "unit">
> = (props) => {
  const formatFrequency = (value: number) => {
    return value >= 1000 ? `${(value / 1000).toFixed(1)}kHz` : `${value}Hz`;
  };

  return <Slider {...props} valueLabelFormat={formatFrequency} />;
};
