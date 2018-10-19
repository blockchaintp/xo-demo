import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { convertHexToRGB, lighten, darken } from '@material-ui/core/styles/colorManipulator'
import CssBaseline from '@material-ui/core/CssBaseline'

const primary = convertHexToRGB('#3D4797')
const secondary = convertHexToRGB('#D81C38')

const theme = createMuiTheme({
  palette: {
    primary: {
      light: lighten(primary, 0.2),
      main: primary,
      dark: darken(primary, 0.2),
    },
    secondary: {
      light: lighten(secondary, 0.2),
      main: secondary,
      dark: darken(secondary, 0.2),
    },
  },
})

function Theme(props) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      { props.children }
    </MuiThemeProvider>
  );
}

export default Theme