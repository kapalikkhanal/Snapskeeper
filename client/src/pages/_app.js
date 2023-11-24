import '@/styles/globals.css'

import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'

export default function App({ Component, pageProps }) {
  global.performance = global.performance || {
    now: () => new Date().getTime(),
  };
  return <>
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  </>
}
