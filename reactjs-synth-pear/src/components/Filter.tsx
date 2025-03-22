import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FrequencySlider } from "./common/Slider";
import { useSynth } from "../context/SynthContext";
import { FilterType, FilterSlope } from "../types/synth";
import { synthColors, StyledComponents } from "../styles/theme";

const FilterContainer = styled.div`
  ${StyledComponents.ModuleContainer}
  border: 2px solid ${synthColors.filter};
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 150px;
  background-color: ${synthColors.background.dark};
  border-radius: 8px;
  margin: 10px 0;
`;

interface FilterProps {
  index: number;
}

export const Filter: React.FC<FilterProps> = ({ index }) => {
  const { state, dispatch } = useSynth();
  const filter = state.filters[index];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleTypeChange = (event: any) => {
    dispatch({
      type: "UPDATE_FILTER",
      index,
      params: { type: event.target.value as FilterType },
    });
  };

  const handleSlopeChange = (event: any) => {
    dispatch({
      type: "UPDATE_FILTER",
      index,
      params: { slope: event.target.value as FilterSlope },
    });
  };

  const handleCutoffChange = (value: number) => {
    dispatch({
      type: "UPDATE_FILTER",
      index,
      params: { cutoff: value },
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas resolution
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.fillStyle = synthColors.background.dark;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw frequency response curve
    ctx.beginPath();
    ctx.strokeStyle = synthColors.filter;
    ctx.lineWidth = 2;

    const width = canvas.width / 2;
    const height = canvas.height / 2;
    const frequencyScale = Math.log10(20000 / 20);
    const cutoffX = (Math.log10(filter.cutoff / 20) / frequencyScale) * width;
    const slope = parseInt(filter.slope);

    for (let x = 0; x < width; x++) {
      const frequency = 20 * Math.pow(10, (x / width) * frequencyScale);
      let response = 0;

      switch (filter.type) {
        case "lowpass":
          response =
            1 /
            Math.sqrt(1 + Math.pow(frequency / filter.cutoff, 2 * (slope / 6)));
          break;
        case "highpass":
          response = Math.sqrt(
            Math.pow(frequency / filter.cutoff, 2 * (slope / 6)) /
              (1 + Math.pow(frequency / filter.cutoff, 2 * (slope / 6)))
          );
          break;
        case "bandpass":
          const q = 1;
          const f0 = filter.cutoff;
          response = Math.sqrt(
            Math.pow((f0 * q) / frequency, 2 * (slope / 12)) /
              (1 + Math.pow(Math.pow(frequency / f0, 2) - 1, 2 * (slope / 12)))
          );
          break;
      }

      const y = height - response * height;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw cutoff frequency marker
    ctx.beginPath();
    ctx.strokeStyle = synthColors.filter;
    ctx.setLineDash([5, 5]);
    ctx.moveTo(cutoffX, 0);
    ctx.lineTo(cutoffX, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw frequency labels
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px Roboto Mono";
    ctx.textAlign = "center";
    [20, 100, 1000, 10000, 20000].forEach((freq) => {
      const x = (Math.log10(freq / 20) / frequencyScale) * width;
      const label = freq >= 1000 ? `${freq / 1000}k` : freq.toString();
      ctx.fillText(label, x, height - 5);
    });
  }, [filter, canvasRef]);

  return (
    <FilterContainer>
      <Typography
        variant="h6"
        sx={{ color: synthColors.filter, marginBottom: 2 }}
      >
        Filter {index + 1}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Type</InputLabel>
          <Select
            value={filter.type}
            onChange={handleTypeChange}
            label="Type"
            sx={{ color: synthColors.filter }}
          >
            <MenuItem value="lowpass">Low Pass</MenuItem>
            <MenuItem value="highpass">High Pass</MenuItem>
            <MenuItem value="bandpass">Band Pass</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Slope</InputLabel>
          <Select
            value={filter.slope}
            onChange={handleSlopeChange}
            label="Slope"
            sx={{ color: synthColors.filter }}
          >
            <MenuItem value="6">6 dB/oct</MenuItem>
            <MenuItem value="12">12 dB/oct</MenuItem>
            <MenuItem value="24">24 dB/oct</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Canvas ref={canvasRef} />

      <Box sx={{ marginTop: 2 }}>
        <FrequencySlider
          value={filter.cutoff}
          min={20}
          max={20000}
          step={1}
          onChange={handleCutoffChange}
          label="Cutoff"
          color={synthColors.filter}
        />
      </Box>
    </FilterContainer>
  );
};
