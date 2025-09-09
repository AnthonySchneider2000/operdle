"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useThemeConfig } from "@/hooks/use-theme-config"

function ThemeConfigProvider({ children }: { children: React.ReactNode }) {
  // This component ensures our theme config hook is initialized
  useThemeConfig()
  return <>{children}</>
}

export function ThemeProvider({ 
  children, 
  ...props 
}: { 
  children: React.ReactNode
  [key: string]: any 
}) {
  return (
    <NextThemesProvider {...props}>
      <ThemeConfigProvider>
        {children}
      </ThemeConfigProvider>
    </NextThemesProvider>
  )
}
