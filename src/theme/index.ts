import { createTheme } from '@mui/material/styles'
import './types'

export const impactTheme = createTheme({
  palette: {
    primary: {
      main: '#b596e5',
      light: '#4ade80',
      dark: '#15803d',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#8367c7',
      light: '#06b6d4',
      dark: '#5603ad',
      contrastText: '#ffffff'
    },
    // success: {
    //   main: '',
    //   light: '',
    //   dark: ''
    // },
    // warning: {
    //   main: '',
    //   light: '',
    //   dark: ''
    // },
    // error: {
    //   main: '',
    //   light: '',
    //   dark: ''
    // },
    mint: {
      main: '#b3e9c7',
      dark: '#92c5a7',
      contrastText: '#166534'
    },
    approve: {
      main: '#0d00a4',
      dark: '#080070',
      contrastText: '#fff'
    },
    transfer: {
      main: '#8367c7',
      dark: '#5603ad',
      contrastText: '#fff'
    },
    grey: {
      50: '#f9fafb',
      500: '#6b7280',
      900: '#111827'
    }
  },
  typography: {
    fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    }
  },
  spacing: 8,
  shape: {
    borderRadius: 12
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(-20deg,rgba(220, 176, 237, 0.82) 0%,rgba(182, 238, 186, 0.8) 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 12,
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }
        },
        containedPrimary: {
          backgroundColor: '#b596e5',
          '&:hover': {
            backgroundColor: '#8367c7'
          }
        },
        containedMint: ({ theme }) => ({
          backgroundColor: theme.palette.mint.main,
          color: theme.palette.mint.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.mint.dark
          }
        }),
        containedApprove: ({ theme }) => ({
          backgroundColor: theme.palette.approve.main,
          color: '#ffffff',
          '&:hover': {
            backgroundColor: theme.palette.approve.dark
          }
        }),
        containedTransfer: ({ theme }) => ({
          backgroundColor: theme.palette.transfer.main,
          color: theme.palette.transfer.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.transfer.dark
          }
        })
      }
    },
    MuiChip: {
      styleOverrides: {
        filledMint: ({ theme }) => ({
          backgroundColor: theme.palette.mint.main,
          color: theme.palette.mint.contrastText,
        }),
        filledApprove: ({ theme }) => ({
          backgroundColor: theme.palette.approve.main,
          color: theme.palette.approve.contrastText,
        }),
        filledTransfer: ({ theme }) => ({
          backgroundColor: theme.palette.transfer.main,
          color: theme.palette.transfer.contrastText,
        })
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          },
          transition: 'box-shadow 0.2s ease-in-out'
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: 24,
          paddingBottom: 24
        }
      }
    }
  }
})