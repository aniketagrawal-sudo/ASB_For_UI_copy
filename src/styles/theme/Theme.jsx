import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import PropTypes from 'prop-types';
import appBarTheme from './components/appBarTheme';

/** changes made
v1.1.0 :
  =>Update the default info color for the Alert to match the design system [MuiAlert]
**/
const DTtheme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: ['Inter', 'Poppins', 'sans-serif'].join(', '),
  },
  components: {
    MuiAppBar: appBarTheme,
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: 'rgb(160 154 154)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardInfo: {
          '--mui-palette-Alert-infoFilledBg': '#f5a449',
        },
        filledInfo: {
          '--mui-palette-Alert-infoFilledBg': '#f5a449',
        },
      },
    },
  },
});

function AppTheme({ children }) {
  return <ThemeProvider theme={DTtheme}>{children}</ThemeProvider>;
}

AppTheme.propTypes = {
  children: PropTypes.node,
};

export default AppTheme;
