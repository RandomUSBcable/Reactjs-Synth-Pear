export type OscillatorType = 'sine' | 'saw' | 'triangle' | 'pulse' | 'analog-sine' | 'analog-saw' | 'analog-square';
export type FilterType = 'highpass' | 'lowpass' | 'bandpass';
export type FilterSlope = '6' | '12' | '24';
export type LFOType = 'sine' | 'triangle' | 'saw' | 'random';
export type LFOMode = 'sync' | 'time';
export type PlaybackMode = 'monophonic' | 'polyphonic';

export interface OscillatorParams {
  type: OscillatorType;
  unison: number;
  unisonDetune: number;
  velocitySensitivity: number;
  volume: number;
  mute: boolean;
  solo: boolean;
}

export interface FilterParams {
  type: FilterType;
  slope: FilterSlope;
  cutoff: number;
}

export interface EnvelopeParams {
  delay: number;
  attack: number;
  hold: number;
  decay: number;
  sustain: number;
  sustainSlope?: number;
  release: number;
  releaseSlope?: number;
}

export interface LFOParams {
  type: LFOType;
  depth: number;
  mode: LFOMode;
  rate: number | string; // number for time (ms), string for sync (e.g., '1/4')
  assignedParam: string;
}

export interface SynthState {
  bpm: number;
  oscillators: OscillatorParams[];
  filters: FilterParams[];
  mainEnvelope: EnvelopeParams;
  filterEnvelope: EnvelopeParams;
  additionalEnvelope: EnvelopeParams & { assignedParam: string };
  lfos: LFOParams[];
  playbackMode: PlaybackMode;
  holdMode: boolean;
  transpose: number;
  octave: number;
}