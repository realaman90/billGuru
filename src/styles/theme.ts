import { createTheme } from '@mui/material/styles';


export  const theme = createTheme({
  
  palette: {
     primary: {
      main: '#6750a4',
      dark: '#462B8C',
      contrastText: '#E6E1E5',
    },
    secondary: {
      main: '#49454F',
      light: '#7986cb',
      contrastText: '#E6E1E5',
      dark: '#1C1B1F',
    },

},
components: {
  // Name of the component
  MuiButton: {
    styleOverrides: {      
      root: {        
        fontSize: '1rem',
        '@media (max-width:600px)': {
          fontSize: '0.75rem',
        },
      },
    },
  },
  MuiTextField:{
    styleOverrides:{
      root:{
        fontFamily:'Montserrat, sans-serif'
      },
      

    }
  }
},
typography: {  
  fontFamily: 'Montserrat, sans-serif',
  subtitle1: {
    fontSize: '1rem',
    fontWeight:500
  },
  body2:{
    fontStyle:'italic'

  },
  
  body1:{
    fontSize:'1rem',
    '@media (max-width:600px)': {
      fontSize: '0.75rem',
    },
  
},
},

});