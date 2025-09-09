"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ThemeColorSelector } from '@/components/theme-color-selector'
import { useThemeConfig } from '@/hooks/use-theme-config'

export function ThemeSettings() {
  const { theme, setTheme, mounted } = useThemeConfig()

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Customize the appearance of your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>
          Customize the appearance of your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Mode Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Mode</Label>
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-medium">Light</div>
                  <div className="text-sm text-muted-foreground">
                    Always use light mode
                  </div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-medium">Dark</div>
                  <div className="text-sm text-muted-foreground">
                    Always use dark mode
                  </div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-medium">System</div>
                  <div className="text-sm text-muted-foreground">
                    Follow your system preference
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Base Color Selection */}
        <ThemeColorSelector />
      </CardContent>
    </Card>
  )
}
