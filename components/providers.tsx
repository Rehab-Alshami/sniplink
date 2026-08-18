"use client"

import { useState, type ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { LocaleProvider } from "@/components/providers/locale-provider"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false },
        },
      }),
  )

  return (
    <ThemeProvider>
      <LocaleProvider>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </SessionProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}
