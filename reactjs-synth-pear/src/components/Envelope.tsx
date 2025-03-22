import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import { TimeSlider } from "./common/Slider";
import { useSynth } from "../context/SynthContext";
import { EnvelopeParams } from "../types/synth";
import { synthColors, StyledComponents } from "../styles/theme";

const EnvelopeContainer = styled.div<{ $color: string }>`
  ${StyledComponents.ModuleContainer}
  border: 2px solid ${(props) => props.$color};
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 120px;
  background-color: ${synthColors.background.dark};
  border-radius: 8px;
  margin: 10px 0;
`;

const SlidersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

interface EnvelopeProps {
  type: "main" | "filter" | "additional";
  color?: string;
}

export const Envelope: React.FC<EnvelopeProps> = ({
  type,
  color = synthColors.envelope,
}) => {
  const { state, dispatch } = useSynth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const envelope =
    type === "main"
      ? state.mainEnvelope
      : type === "filter"
      ? state.filterEnvelope
      : state.additionalEnvelope;

  const handleParamChange =
    (param: keyof EnvelopeParams) => (value: number) => {
      const action =
        type === "main"
          ? "UPDATE_MAIN_ENVELOPE"
          : type === "filter"
          ? "UPDATE_FILTER_ENVELOPE"
          : "UPDATE_ADDITIONAL_ENVELOPE";

      dispatch({
        type: action as any,
        params: { [param]: value },
      });
    };

  const handleAssignmentChange = (event: any) => {
    if (type === "additional") {
      dispatch({
        type: "UPDATE_ADDITIONAL_ENVELOPE",
        params: { assignedParam: event.target.value },
      });
    }
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

    // Clear canvas
    ctx.fillStyle = synthColors.background.dark;
    ctx.fillRect(0, 0, width, height);

    // Draw envelope curve
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    // Starting point
    ctx.moveTo(0, height);

    // Delay
    const delayX = (envelope.delay / 2) * width;
    ctx.lineTo(delayX, height);

    // Attack
    const attackX = delayX + (envelope.attack / 2) * width;
    ctx.lineTo(attackX, 0);

    // Hold
    const holdX = attackX + (envelope.hold / 2) * width;
    ctx.lineTo(holdX, 0);

    // Decay and Sustain
    const decayX = holdX + (envelope.decay / 2) * width;
    const sustainY = height * (1 - envelope.sustain);
    ctx.lineTo(decayX, sustainY);

    // Sustain line
    const releaseStartX = width * 0.7;
    ctx.lineTo(releaseStartX, sustainY);

    // Release
    const releaseX = releaseStartX + (envelope.release / 2) * width;
    ctx.lineTo(releaseX, height);

    ctx.stroke();

    // Draw labels
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px Roboto Mono";
    ctx.textAlign = "center";

    const labels = ["D", "A", "H", "D", "S", "R"];
    const positions = [
      delayX,
      attackX,
      holdX,
      decayX,
      (decayX + releaseStartX) / 2,
      releaseX,
    ];

    labels.forEach((label, i) => {
      ctx.fillText(label, positions[i], height - 5);
    });
  }, [envelope, color]);

  const getAvailableParameters = () => {
    return [
      { value: "osc1.volume", label: "Oscillator 1 Volume" },
      { value: "osc2.volume", label: "Oscillator 2 Volume" },
      { value: "osc3.volume", label: "Oscillator 3 Volume" },
      { value: "osc4.volume", label: "Oscillator 4 Volume" },
      { value: "filter1.cutoff", label: "Filter 1 Cutoff" },
      { value: "filter2.cutoff", label: "Filter 2 Cutoff" },
      { value: "filter3.cutoff", label: "Filter 3 Cutoff" },
      { value: "lfo1.depth", label: "LFO 1 Depth" },
      { value: "lfo2.depth", label: "LFO 2 Depth" },
    ];
  };

  return (
    <EnvelopeContainer $color={color}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h6" sx={{ color }}>
          {type === "main"
            ? "Main Envelope"
            : type === "filter"
            ? "Filter Envelope"
            : "Additional Envelope"}
        </Typography>

        {type === "additional" && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={(envelope as any).assignedParam || ""}
              onChange={handleAssignmentChange}
              displayEmpty
              sx={{ color }}
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
        )}
      </Box>

      <Canvas ref={canvasRef} />

      <SlidersContainer>
        <TimeSlider
          value={envelope.delay}
          min={0}
          max={2000}
          onChange={handleParamChange("delay")}
          label="Delay"
          color={color}
        />
        <TimeSlider
          value={envelope.attack}
          min={0}
          max={2000}
          onChange={handleParamChange("attack")}
          label="Attack"
          color={color}
        />
        <TimeSlider
          value={envelope.hold}
          min={0}
          max={2000}
          onChange={handleParamChange("hold")}
          label="Hold"
          color={color}
        />
        <TimeSlider
          value={envelope.decay}
          min={0}
          max={2000}
          onChange={handleParamChange("decay")}
          label="Decay"
          color={color}
        />
        <TimeSlider
          value={envelope.sustain}
          min={0}
          max={1}
          step={0.01}
          onChange={handleParamChange("sustain")}
          label="Sustain"
          color={color}
        />
        {type === "main" && (
          <TimeSlider
            value={envelope.sustainSlope || 0}
            min={-1}
            max={1}
            step={0.01}
            onChange={handleParamChange("sustainSlope")}
            label="Sustain Slope"
            color={color}
          />
        )}
        <TimeSlider
          value={envelope.release}
          min={0}
          max={2000}
          onChange={handleParamChange("release")}
          label="Release"
          color={color}
        />
        {type === "main" && (
          <TimeSlider
            value={envelope.releaseSlope || 0}
            min={-1}
            max={1}
            step={0.01}
            onChange={handleParamChange("releaseSlope")}
            label="Release Slope"
            color={color}
          />
        )}
      </SlidersContainer>
    </EnvelopeContainer>
  );
};
