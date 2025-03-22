import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  SynthState,
  OscillatorParams,
  FilterParams,
  EnvelopeParams,
  LFOParams,
} from "../types/synth";

const initialOscillator: OscillatorParams = {
  type: "sine",
  unison: 1,
  unisonDetune: 0,
  velocitySensitivity: 0,
  volume: 0.75,
  mute: false,
  solo: false,
};

const initialFilter: FilterParams = {
  type: "lowpass",
  slope: "12",
  cutoff: 1000,
};

const initialEnvelope: EnvelopeParams = {
  delay: 0,
  attack: 0.01,
  hold: 0,
  decay: 0.1,
  sustain: 0.5,
  sustainSlope: 0,
  release: 0.1,
  releaseSlope: 0,
};

const initialLFO: LFOParams = {
  type: "sine",
  depth: 50,
  mode: "sync",
  rate: "1/4",
  assignedParam: "",
};

const initialState: SynthState = {
  bpm: 120,
  oscillators: Array(4).fill(initialOscillator),
  filters: Array(3).fill(initialFilter),
  mainEnvelope: initialEnvelope,
  filterEnvelope: {
    ...initialEnvelope,
    sustainSlope: undefined,
    releaseSlope: undefined,
  },
  additionalEnvelope: {
    ...initialEnvelope,
    sustainSlope: undefined,
    releaseSlope: undefined,
    assignedParam: "",
  },
  lfos: Array(2).fill(initialLFO),
  playbackMode: "polyphonic",
  holdMode: false,
  transpose: 0,
  octave: 0,
};

type SynthAction =
  | { type: "SET_BPM"; value: number }
  | {
      type: "UPDATE_OSCILLATOR";
      index: number;
      params: Partial<OscillatorParams>;
    }
  | { type: "UPDATE_FILTER"; index: number; params: Partial<FilterParams> }
  | { type: "UPDATE_MAIN_ENVELOPE"; params: Partial<EnvelopeParams> }
  | { type: "UPDATE_FILTER_ENVELOPE"; params: Partial<EnvelopeParams> }
  | {
      type: "UPDATE_ADDITIONAL_ENVELOPE";
      params: Partial<EnvelopeParams & { assignedParam: string }>;
    }
  | { type: "UPDATE_LFO"; index: number; params: Partial<LFOParams> }
  | { type: "SET_PLAYBACK_MODE"; mode: "monophonic" | "polyphonic" }
  | { type: "TOGGLE_HOLD" }
  | { type: "SET_TRANSPOSE"; value: number }
  | { type: "SET_OCTAVE"; value: number };

function synthReducer(state: SynthState, action: SynthAction): SynthState {
  switch (action.type) {
    case "SET_BPM":
      return { ...state, bpm: action.value };
    case "UPDATE_OSCILLATOR":
      return {
        ...state,
        oscillators: state.oscillators.map((osc, i) =>
          i === action.index ? { ...osc, ...action.params } : osc
        ),
      };
    case "UPDATE_FILTER":
      return {
        ...state,
        filters: state.filters.map((filter, i) =>
          i === action.index ? { ...filter, ...action.params } : filter
        ),
      };
    case "UPDATE_MAIN_ENVELOPE":
      return {
        ...state,
        mainEnvelope: { ...state.mainEnvelope, ...action.params },
      };
    case "UPDATE_FILTER_ENVELOPE":
      return {
        ...state,
        filterEnvelope: { ...state.filterEnvelope, ...action.params },
      };
    case "UPDATE_ADDITIONAL_ENVELOPE":
      return {
        ...state,
        additionalEnvelope: { ...state.additionalEnvelope, ...action.params },
      };
    case "UPDATE_LFO":
      return {
        ...state,
        lfos: state.lfos.map((lfo, i) =>
          i === action.index ? { ...lfo, ...action.params } : lfo
        ),
      };
    case "SET_PLAYBACK_MODE":
      return { ...state, playbackMode: action.mode };
    case "TOGGLE_HOLD":
      return { ...state, holdMode: !state.holdMode };
    case "SET_TRANSPOSE":
      return { ...state, transpose: action.value };
    case "SET_OCTAVE":
      return { ...state, octave: action.value };
    default:
      return state;
  }
}

interface SynthContextType {
  state: SynthState;
  dispatch: React.Dispatch<SynthAction>;
}

const SynthContext = createContext<SynthContextType | undefined>(undefined);

export function SynthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(synthReducer, initialState);

  return (
    <SynthContext.Provider value={{ state, dispatch }}>
      {children}
    </SynthContext.Provider>
  );
}

export function useSynth() {
  const context = useContext(SynthContext);
  if (context === undefined) {
    throw new Error("useSynth must be used within a SynthProvider");
  }
  return context;
}
