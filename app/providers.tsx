"use client"

import { CacheProvider } from "@chakra-ui/next-js"
import { ChakraProvider } from "@chakra-ui/react"

// Needed for chakra ui
// see: https://chakra-ui.com/getting-started/nextjs-guide
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider prepend={true}>
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
  )
}
