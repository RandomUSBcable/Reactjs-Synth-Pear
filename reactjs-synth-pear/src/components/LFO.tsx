import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Knob } from "./common/Knob";
import { TimeSlider } from "./common/Slider";
import { useSynth } from "../context/SynthContext";
import { LFOType, LFOMode } from "../types/synth";
import { synthColors, StyledComponents } from "../styles/theme";

const LFOContainer = styled.div`
  ${StyledComponents.ModuleContainer}
  border: 2px solid ${synthColors.lfo};
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 80px;
  background-color: ${synthColors.background.dark};
  border-radius: 8px;
  margin: 10px 0;
`;

const ControlsRow = styled.div`
  ${StyledComponents.ControlRow}
`;

interface LFOProps {
  index: number;
}

export const LFO: React.FC<LFOProps> = ({ index }) => {
  const { state, dispatch } = useSynth();
  const lfo = state.lfos[index];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleTypeChange = (event: any) => {
    dispatch({
      type: "UPDATE_LFO",
      index,
      params: { type: event.target.value as LFOType },
    });
  };

  const handleModeChange = (_: any, newMode: LFOMode) => {
    if (newMode !== null) {
      dispatch({
        type: "UPDATE_LFO",
        index,
        params: { mode: newMode },
      });
    }
  };

  const handleRateChange = (value: number | string) => {
    dispatch({
      type: "UPDATE_LFO",
      index,
      params: { rate: value },
    });
  };

  const handleDepthChange = (value: number) => {
    dispatch({
      type: "UPDATE_LFO",
      index,
      params: { depth: value },
    });
  };

  const handleAssignmentChange = (event: any) => {
    dispatch({
      type: "UPDATE_LFO",
      index,
      params: { assignedParam: event.target.value },
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

    const width = canvas.width / 2;
    const height = canvas.height / 2;
    const centerY = height / 2;
    const amplitude = height / 3;

    // Clear canvas
    ctx.fillStyle = synthColors.background.dark;
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    ctx.beginPath();
    ctx.strokeStyle = synthColors.lfo;
    ctx.lineWidth = 2;

    const points = 100;
    let lastY = centerY;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      let y = centerY;

      switch (lfo.type) {
        case "sine":
          y = centerY + Math.sin((i / points) * Math.PI * 2) * amplitude;
          break;
        case "triangle":
          const phase = (i / points) % 1;
          y =
            centerY +
            (phase < 0.5
              ? (phase * 4 - 1) * amplitude
              : (3 - phase * 4) * amplitude);
          break;
        case "saw":
          y = centerY + (((i / points) % 1) * 2 - 1) * amplitude;
          break;
        case "random":
          if (i % 10 === 0) {
            y = centerY + (Math.random() * 2 - 1) * amplitude;
            lastY = y;
          } else {
            y = lastY;
          }
          break;
      }

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }, [lfo.type]);

  const getAvailableParameters = () => {
    return [
      { value: "osc1.volume", label: "Oscillator 1 Volume" },
      { value: "osc2.volume", label: "Oscillator 2 Volume" },
      { value: "osc3.volume", label: "Oscillator 3 Volume" },
      { value: "osc4.volume", label: "Oscillator 4 Volume" },
      { value: "filter1.cutoff", label: "Filter 1 Cutoff" },
      { value: "filter2.cutoff", label: "Filter 2 Cutoff" },
      { value: "filter3.cutoff", label: "Filter 3 Cutoff" },
      { value: "env.attack", label: "Envelope Attack" },
      { value: "env.decay", label: "Envelope Decay" },
      { value: "env.release", label: "Envelope Release" },
    ];
  };

  const syncRates = [
    "1/32",
    "1/16",
    "1/8",
    "1/4",
    "1/2",
    "1",
    "1/32.",
    "1/16.",
    "1/8.",
    "1/4.",
    "1/2.",
    "1.",
  ];

  return (
    <LFOContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: synthColors.lfo }}>
          LFO {index + 1}
        </Typography>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value={lfo.assignedParam}
            onChange={handleAssignmentChange}
            displayEmpty
            sx={{ color: synthColors.lfo }}
          >
            <MenuItem value="">
              <em>Select Parameter</em>
            </MenuItem>
            {getAvailableParameters().map((param) => (
              <MenuItem key={param.value} value={param.value}>
                {param.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Type</InputLabel>
          <Select
            value={lfo.type}
            onChange={handleTypeChange}
            label="Type"
            sx={{ color: synthColors.lfo }}
          >
            <MenuItem value="sine">Sine</MenuItem>
            <MenuItem value="triangle">Triangle</MenuItem>
            <MenuItem value="saw">Saw</MenuItem>
            <MenuItem value="random">Random</MenuItem>
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={lfo.mode}
          exclusive
          onChange={handleModeChange}
          size="small"
        >
          <ToggleButton value="sync">Sync</ToggleButton>
          <ToggleButton value="time">Time</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Canvas ref={canvasRef} />

      <ControlsRow>
        <Knob
          value={lfo.depth}
          min={0}
          max={100}
          onChange={handleDepthChange}
          label="Depth"
          unit="%"
          color={synthColors.lfo}
        />

        {lfo.mode === "sync" ? (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Rate</InputLabel>
            <Select
              value={lfo.rate}
              onChange={(e) => handleRateChange(e.target.value)}
              label="Rate"
              sx={{ color: synthColors.lfo }}
            >
              {syncRates.map((rate) => (
                <MenuItem key={rate} value={rate}>
                  {rate}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TimeSlider
            value={typeof lfo.rate === "number" ? lfo.rate : 1000}
            min={10}
            max={10000}
            onChange={handleRateChange}
            label="Rate"
            color={synthColors.lfo}
          />
        )}
      </ControlsRow>
    </LFOContainer>
  );
};
