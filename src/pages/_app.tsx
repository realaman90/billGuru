import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {theme} from '../styles/theme'
import {Providers} from '../global.redux/provider'
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return (
    <Providers>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <SessionProvider session={session}>
      <Component {...pageProps} />
      </SessionProvider>
    </ThemeProvider>
    
    </Providers>
    
  )
}
