import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useSynth } from "../context/SynthContext";
import { synthColors, StyledComponents } from "../styles/theme";

const KeyboardContainer = styled.div`
  ${StyledComponents.ModuleContainer}
  border: 2px solid ${synthColors.keyboard};
`;

const KeysContainer = styled.div`
  position: relative;
  height: 150px;
  margin: 20px 0;
  display: flex;
`;

const WhiteKey = styled.div<{ $active: boolean }>`
  flex: 1;
  height: 100%;
  background-color: ${(props) =>
    props.$active ? synthColors.keyboard : "#ffffff"};
  border: 1px solid #000000;
  border-radius: 0 0 4px 4px;
  cursor: pointer;
  transition: background-color 0.1s;
  z-index: 1;

  &:hover {
    background-color: ${(props) =>
      props.$active ? synthColors.keyboard : "#e0e0e0"};
  }
`;

const BlackKey = styled.div<{ $active: boolean }>`
  position: absolute;
  width: 60%;
  height: 60%;
  background-color: ${(props) =>
    props.$active ? synthColors.keyboard : "#000000"};
  border-radius: 0 0 4px 4px;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.1s;

  &:hover {
    background-color: ${(props) =>
      props.$active ? synthColors.keyboard : "#333333"};
  }
`;

const ControlsRow = styled.div`
  ${StyledComponents.ControlRow}
  justify-content: space-between;
  margin-bottom: 20px;
`;

interface Note {
  note: string;
  octave: number;
  isBlack: boolean;
  position?: number;
}

const NOTES: Note[] = [
  { note: "C", octave: 4, isBlack: false },
  { note: "C#", octave: 4, isBlack: true, position: 0.7 },
  { note: "D", octave: 4, isBlack: false },
  { note: "D#", octave: 4, isBlack: true, position: 1.7 },
  { note: "E", octave: 4, isBlack: false },
  { note: "F", octave: 4, isBlack: false },
  { note: "F#", octave: 4, isBlack: true, position: 3.7 },
  { note: "G", octave: 4, isBlack: false },
  { note: "G#", octave: 4, isBlack: true, position: 4.7 },
  { note: "A", octave: 4, isBlack: false },
  { note: "A#", octave: 4, isBlack: true, position: 5.7 },
  { note: "B", octave: 4, isBlack: false },
  { note: "C", octave: 5, isBlack: false },
  { note: "C#", octave: 5, isBlack: true, position: 7.7 },
  { note: "D", octave: 5, isBlack: false },
  { note: "D#", octave: 5, isBlack: true, position: 8.7 },
  { note: "E", octave: 5, isBlack: false },
  { note: "F", octave: 5, isBlack: false },
  { note: "F#", octave: 5, isBlack: true, position: 10.7 },
  { note: "G", octave: 5, isBlack: false },
  { note: "G#", octave: 5, isBlack: true, position: 11.7 },
  { note: "A", octave: 5, isBlack: false },
  { note: "A#", octave: 5, isBlack: true, position: 12.7 },
  { note: "B", octave: 5, isBlack: false },
];

export const Keyboard: React.FC = () => {
  const { state, dispatch } = useSynth();
  const activeNotesRef = useRef<Set<string>>(new Set());

  const handlePlaybackModeChange = (
    _: any,
    newMode: "monophonic" | "polyphonic"
  ) => {
    if (newMode !== null) {
      dispatch({ type: "SET_PLAYBACK_MODE", mode: newMode });
    }
  };

  const handleHoldToggle = () => {
    dispatch({ type: "TOGGLE_HOLD" });
  };

  const handleTranspose = (amount: number) => {
    dispatch({ type: "SET_TRANSPOSE", value: state.transpose + amount });
  };

  const handleOctave = (amount: number) => {
    dispatch({ type: "SET_OCTAVE", value: state.octave + amount });
  };

  const handleNoteOn = (note: Note) => {
    const noteId = `${note.note}${note.octave}`;

    if (state.playbackMode === "monophonic") {
      activeNotesRef.current.clear();
    }

    activeNotesRef.current.add(noteId);
    // Here you would trigger the actual note in your audio engine
  };

  const handleNoteOff = (note: Note) => {
    const noteId = `${note.note}${note.octave}`;
    if (!state.holdMode) {
      activeNotesRef.current.delete(noteId);
      // Here you would release the note in your audio engine
    }
  };

  const isNoteActive = (note: Note) => {
    return activeNotesRef.current.has(`${note.note}${note.octave}`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Map computer keyboard to notes
      const keyMap: { [key: string]: Note } = {
        a: NOTES[0], // C4
        w: NOTES[1], // C#4
        s: NOTES[2], // D4
        e: NOTES[3], // D#4
        d: NOTES[4], // E4
        f: NOTES[5], // F4
        t: NOTES[6], // F#4
        g: NOTES[7], // G4
        y: NOTES[8], // G#4
        h: NOTES[9], // A4
        u: NOTES[10], // A#4
        j: NOTES[11], // B4
        k: NOTES[12], // C5
      };

      const note = keyMap[e.key.toLowerCase()];
      if (note && !e.repeat) {
        handleNoteOn(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyMap: { [key: string]: Note } = {
        a: NOTES[0],
        w: NOTES[1],
        s: NOTES[2],
        e: NOTES[3],
        d: NOTES[4],
        f: NOTES[5],
        t: NOTES[6],
        g: NOTES[7],
        y: NOTES[8],
        h: NOTES[9],
        u: NOTES[10],
        j: NOTES[11],
        k: NOTES[12],
      };

      const note = keyMap[e.key.toLowerCase()];
      if (note) {
        handleNoteOff(note);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [state.playbackMode, state.holdMode]);

  return (
    <KeyboardContainer>
      <ControlsRow>
        <Box>
          <Typography variant="subtitle2" color="textSecondary">
            Mode
          </Typography>
          <ToggleButtonGroup
            value={state.playbackMode}
            exclusive
            onChange={handlePlaybackModeChange}
            size="small"
          >
            <ToggleButton value="monophonic">Mono</ToggleButton>
            <ToggleButton value="polyphonic">Poly</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="textSecondary">
            Hold
          </Typography>
          <ToggleButton
            value="hold"
            selected={state.holdMode}
            onChange={handleHoldToggle}
            size="small"
          >
            Hold
          </ToggleButton>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="textSecondary">
            Transpose
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton size="small" onClick={() => handleTranspose(-1)}>
              <Remove />
            </IconButton>
            <Typography>
              {state.transpose > 0 ? `+${state.transpose}` : state.transpose}
            </Typography>
            <IconButton size="small" onClick={() => handleTranspose(1)}>
              <Add />
            </IconButton>
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="textSecondary">
            Octave
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton size="small" onClick={() => handleOctave(-1)}>
              <Remove />
            </IconButton>
            <Typography>
              {state.octave > 0 ? `+${state.octave}` : state.octave}
            </Typography>
            <IconButton size="small" onClick={() => handleOctave(1)}>
              <Add />
            </IconButton>
          </Box>
        </Box>
      </ControlsRow>

      <KeysContainer>
        {NOTES.filter((note) => !note.isBlack).map((note, index) => (
          <WhiteKey
            key={`${note.note}${note.octave}`}
            $active={isNoteActive(note)}
            onMouseDown={() => handleNoteOn(note)}
            onMouseUp={() => handleNoteOff(note)}
            onMouseLeave={() => handleNoteOff(note)}
          />
        ))}
        {NOTES.filter((note) => note.isBlack).map((note) => (
          <BlackKey
            key={`${note.note}${note.octave}`}
            $active={isNoteActive(note)}
            onMouseDown={() => handleNoteOn(note)}
            onMouseUp={() => handleNoteOff(note)}
            onMouseLeave={() => handleNoteOff(note)}
            style={{ left: `${note.position}%` }}
          />
        ))}
      </KeysContainer>
    </KeyboardContainer>
  );
};
