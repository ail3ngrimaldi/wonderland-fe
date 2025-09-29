import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    mint: Palette['primary']
    approve: Palette['primary']
    transfer: Palette['primary']
  }

  interface PaletteOptions {
    mint?: PaletteOptions['primary']
    approve?: PaletteOptions['primary']
    transfer?: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    mint: true
    approve: true
    transfer: true
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    mint: true
    approve: true
    transfer: true
  }
}
