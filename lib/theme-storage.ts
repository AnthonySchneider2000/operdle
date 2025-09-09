import { BaseColor } from './theme-config'

export interface ThemeStorage {
  getBaseColor(): BaseColor | null
  setBaseColor(color: BaseColor): Promise<void>
  // Future expansion: could add user preferences, custom themes, etc.
  // getUserPreferences(): Promise<UserPreferences | null>
  // setUserPreferences(preferences: UserPreferences): Promise<void>
}

export class LocalStorageThemeStorage implements ThemeStorage {
  private readonly BASE_COLOR_KEY = 'theme-base-color'

  getBaseColor(): BaseColor | null {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem(this.BASE_COLOR_KEY)
      return stored as BaseColor | null
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error)
      return null
    }
  }

  async setBaseColor(color: BaseColor): Promise<void> {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.BASE_COLOR_KEY, color)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }
  }
}

// Example of how a database implementation might look:
// export class DatabaseThemeStorage implements ThemeStorage {
//   constructor(private userId: string) {}
//
//   async getBaseColor(): Promise<BaseColor | null> {
//     const response = await fetch(`/api/users/${this.userId}/theme`)
//     if (!response.ok) return null
//     const data = await response.json()
//     return data.baseColor
//   }
//
//   async setBaseColor(color: BaseColor): Promise<void> {
//     await fetch(`/api/users/${this.userId}/theme`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ baseColor: color })
//     })
//   }
// }

// Factory function to create the appropriate storage implementation
export function createThemeStorage(): ThemeStorage {
  // For now, use localStorage
  // In the future, this could check for authentication and return DatabaseThemeStorage
  return new LocalStorageThemeStorage()
}
