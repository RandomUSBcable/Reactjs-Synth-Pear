import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
      light: '#6effff',
      dark: '#00b2cc',
    },
    secondary: {
      main: '#ff1744',
      light: '#ff616f',
      dark: '#c4001d',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto Mono", monospace',
  },
  components: {
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#00e5ff',
          height: 8,
          '& .MuiSlider-track': {
            border: 'none',
          },
          '& .MuiSlider-thumb': {
            height: 24,
            width: 24,
            backgroundColor: '#fff',
            border: '2px solid currentColor',
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
              boxShadow: 'inherit',
            },
            '&:before': {
              display: 'none',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export const synthColors = {
  oscillator: '#00e5ff',
  filter: '#ff1744',
  envelope: '#ffea00',
  lfo: '#00e676',
  keyboard: '#7c4dff',
  background: {
    main: '#121212',
    light: '#1e1e1e',
    dark: '#0a0a0a',
  },
};

export const StyledComponents = {
  ModuleContainer: {
    backgroundColor: synthColors.background.light,
    borderRadius: '12px',
    padding: '20px',
    margin: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  ModuleTitle: {
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '15px',
  },
  ControlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '15px',
  },
  ControlRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
};