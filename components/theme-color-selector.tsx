"use client"

import { BaseColor, baseColors, themeConfigs } from '@/lib/theme-config'
import { useThemeConfig } from '@/hooks/use-theme-config'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

interface ThemeColorSelectorProps {
  className?: string
}

export function ThemeColorSelector({ className }: ThemeColorSelectorProps) {
  const { baseColor, setBaseColor, mounted } = useThemeConfig()

  if (!mounted) {
    return <div className="space-y-3">
      <div className="h-4 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium">Base Color</Label>
      <RadioGroup
        value={baseColor}
        onValueChange={(value) => setBaseColor(value as BaseColor)}
        className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3"
      >
        {baseColors.map((color) => {
          const config = themeConfigs[color]
          const isSelected = baseColor === color
          
          return (
            <div key={color} className="relative">
              <RadioGroupItem
                value={color}
                id={color}
                className="sr-only"
              />
              <Label
                htmlFor={color}
                className={cn(
                  "cursor-pointer block p-1 rounded-lg border-2 transition-all hover:scale-105",
                  isSelected 
                    ? "border-primary shadow-md" 
                    : "border-transparent hover:border-border"
                )}
              >
                <div className="space-y-1">
                  <div 
                    className="h-12 rounded-md border border-border/50 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(45deg, ${config.colors.light['--background']} 50%, ${config.colors.dark['--background']} 50%)`
                    }}
                  >
                    {/* Light side accent */}
                    <div 
                      className="absolute top-1 left-1 w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: config.colors.light['--primary'] }}
                    />
                    {/* Dark side accent */}
                    <div 
                      className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: config.colors.dark['--primary'] }}
                    />
                  </div>
                  <div className="text-xs text-center font-medium text-muted-foreground">
                    {config.label}
                  </div>
                </div>
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}
