import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box, Typography, Slider } from "@mui/material";
import styled from "styled-components";
import { theme, synthColors } from "./styles/theme";
import { SynthProvider, useSynth } from "./context/SynthContext";
import { Oscillator } from "./components/Oscillator";
import { Filter } from "./components/Filter";
import { Envelope } from "./components/Envelope";
import { LFO } from "./components/LFO";
import { Keyboard } from "./components/Keyboard";

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${synthColors.background.main};
  padding: 20px;
  overflow-x: hidden;
`;

const ModuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled(Typography)`
  color: #fff;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${synthColors.background.light};
`;

const BPMControl = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: ${synthColors.background.light};
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const MainContent = () => {
  const { state, dispatch } = useSynth();

  const handleBPMChange = (_: Event, value: number | number[]) => {
    dispatch({ type: "SET_BPM", value: value as number });
  };

  return (
    <AppContainer>
      <Box sx={{ maxWidth: 1400, margin: "0 auto" }}>
        <Typography
          variant="h4"
          sx={{ color: "#fff", mb: 4, textAlign: "center" }}
        >
          Pear Synthesizer
        </Typography>

        <BPMControl>
          <Typography variant="h6" sx={{ color: "#fff", minWidth: 100 }}>
            BPM: {state.bpm}
          </Typography>
          <Slider
            value={state.bpm}
            min={50}
            max={200}
            onChange={handleBPMChange}
            sx={{ flexGrow: 1 }}
          />
        </BPMControl>

        <Section>
          <SectionTitle variant="h5">Oscillators</SectionTitle>
          <ModuleGrid>
            {state.oscillators.map((_, index) => (
              <Oscillator key={index} index={index} />
            ))}
          </ModuleGrid>
        </Section>

        <Section>
          <SectionTitle variant="h5">Filters</SectionTitle>
          <ModuleGrid>
            {state.filters.map((_, index) => (
              <Filter key={index} index={index} />
            ))}
          </ModuleGrid>
        </Section>

        <Section>
          <SectionTitle variant="h5">Envelopes</SectionTitle>
          <ModuleGrid>
            <Envelope type="main" color={synthColors.envelope} />
            <Envelope type="filter" color={synthColors.filter} />
            <Envelope type="additional" color="#9c27b0" />
          </ModuleGrid>
        </Section>

        <Section>
          <SectionTitle variant="h5">LFOs</SectionTitle>
          <ModuleGrid>
            {state.lfos.map((_, index) => (
              <LFO key={index} index={index} />
            ))}
          </ModuleGrid>
        </Section>

        <Section>
          <SectionTitle variant="h5">Keyboard</SectionTitle>
          <Keyboard />
        </Section>
      </Box>
    </AppContainer>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SynthProvider>
        <MainContent />
      </SynthProvider>
    </ThemeProvider>
  );
};

export default App;
