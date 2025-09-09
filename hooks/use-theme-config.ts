"use client"

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { BaseColor, getThemeCSSClass } from '@/lib/theme-config'
import { createThemeStorage } from '@/lib/theme-storage'

export function useThemeConfig() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [baseColor, setBaseColorState] = useState<BaseColor>('neutral')
  const [mounted, setMounted] = useState(false)

  const themeStorage = createThemeStorage()

  // Load saved base color on mount
  useEffect(() => {
    const savedBaseColor = themeStorage.getBaseColor()
    if (savedBaseColor) {
      setBaseColorState(savedBaseColor)
    }
    setMounted(true)
  }, [])

  // Apply CSS class when base color changes
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    
    // Remove all theme classes
    const themeClasses = ['theme-neutral', 'theme-stone', 'theme-zinc', 'theme-gray', 'theme-slate', 'theme-red', 'theme-rose', 'theme-orange', 'theme-green', 'theme-blue', 'theme-yellow', 'theme-violet', 'theme-coffee', 'theme-dracula', 'theme-nord', 'theme-monokai', 'theme-onedark', 'theme-github']
    root.classList.remove(...themeClasses)
    
    // Add the current theme class
    root.classList.add(getThemeCSSClass(baseColor))
  }, [baseColor, mounted])

  const setBaseColor = async (color: BaseColor) => {
    setBaseColorState(color)
    await themeStorage.setBaseColor(color)
  }

  // Get the current resolved theme (light/dark)
  const resolvedTheme = theme === 'system' ? systemTheme : theme

  return {
    // Theme mode (light/dark/system)
    theme,
    setTheme,
    resolvedTheme,
    
    // Base color theme
    baseColor,
    setBaseColor,
    
    // Utility
    mounted
  }
}
