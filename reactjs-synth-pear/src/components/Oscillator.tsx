import React from "react";
import styled from "styled-components";
import {
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { VolumeUp, VolumeOff, Star } from "@mui/icons-material";
import { Knob } from "./common/Knob";
import { Slider } from "./common/Slider";
import { useSynth } from "../context/SynthContext";
import { OscillatorType } from "../types/synth";
import { synthColors, StyledComponents } from "../styles/theme";

const OscillatorContainer = styled.div`
  ${StyledComponents.ModuleContainer}
  border: 2px solid ${synthColors.oscillator};
`;

const ControlsRow = styled.div`
  ${StyledComponents.ControlRow}
`;

interface OscillatorProps {
  index: number;
}

export const Oscillator: React.FC<OscillatorProps> = ({ index }) => {
  const { state, dispatch } = useSynth();
  const oscillator = state.oscillators[index];

  const handleTypeChange = (event: any) => {
    dispatch({
      type: "UPDATE_OSCILLATOR",
      index,
      params: { type: event.target.value as OscillatorType },
    });
  };

  const handleParamChange =
    (param: keyof typeof oscillator) => (value: number) => {
      dispatch({
        type: "UPDATE_OSCILLATOR",
        index,
        params: { [param]: value },
      });
    };

  const toggleMute = () => {
    dispatch({
      type: "UPDATE_OSCILLATOR",
      index,
      params: { mute: !oscillator.mute },
    });
  };

  const toggleSolo = () => {
    dispatch({
      type: "UPDATE_OSCILLATOR",
      index,
      params: { solo: !oscillator.solo },
    });
  };

  return (
    <OscillatorContainer>
      <Typography
        variant="h6"
        sx={{ color: synthColors.oscillator, marginBottom: 2 }}
      >
        Oscillator {index + 1}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel>Type</InputLabel>
          <Select
            value={oscillator.type}
            onChange={handleTypeChange}
            label="Type"
            sx={{ color: synthColors.oscillator }}
          >
            <MenuItem value="sine">Sine</MenuItem>
            <MenuItem value="saw">Saw</MenuItem>
            <MenuItem value="triangle">Triangle</MenuItem>
            <MenuItem value="pulse">Pulse</MenuItem>
            <MenuItem value="analog-sine">Analog Sine</MenuItem>
            <MenuItem value="analog-saw">Analog Saw</MenuItem>
            <MenuItem value="analog-square">Analog Square</MenuItem>
          </Select>
        </FormControl>

        <IconButton
          onClick={toggleMute}
          color={oscillator.mute ? "error" : "primary"}
        >
          {oscillator.mute ? <VolumeOff /> : <VolumeUp />}
        </IconButton>

        <IconButton
          onClick={toggleSolo}
          color={oscillator.solo ? "warning" : "primary"}
        >
          <Star />
        </IconButton>
      </Box>

      <ControlsRow>
        <Knob
          value={oscillator.unison}
          min={1}
          max={12}
          step={1}
          onChange={handleParamChange("unison")}
          label="Unison"
          color={synthColors.oscillator}
        />

        <Knob
          value={oscillator.unisonDetune}
          min={0}
          max={100}
          step={0.1}
          onChange={handleParamChange("unisonDetune")}
          label="Detune"
          unit=" cents"
          color={synthColors.oscillator}
        />

        <Knob
          value={oscillator.velocitySensitivity}
          min={0}
          max={100}
          onChange={handleParamChange("velocitySensitivity")}
          label="Velocity"
          unit="%"
          color={synthColors.oscillator}
        />
      </ControlsRow>

      <Box sx={{ marginTop: 2 }}>
        <Slider
          value={oscillator.volume}
          min={0}
          max={1}
          step={0.01}
          onChange={handleParamChange("volume")}
          label="Volume"
          color={synthColors.oscillator}
          valueLabelFormat={(v) => `${Math.round(v * 100)}%`}
        />
      </Box>
    </OscillatorContainer>
  );
};
